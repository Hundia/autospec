/**
 * Generate Specs — 14-Step Pipeline Orchestrator
 * Core of `autospec generate`. Runs sequentially: metadata → 10 role specs → backlog → validate → meta.json.
 *
 * Steps:
 *   1.  Extract project metadata (LLM, JSON)
 *   2-12. Generate each role spec (LLM, Markdown) with cross-spec summaries
 *   13. Validate all specs (local, no LLM)
 *   14. Write specs/.meta.json (informational)
 */

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import Handlebars from 'handlebars';
import { LLMProvider, GenerateOptions, ProviderError } from '../providers/interface.js';
import { atomicWriteFile, cleanOrphanedTmpFiles, computeHash, readFile, exists } from '../utils/file.js';
import { setupSignalHandlers, registerCleanup, setSrsPath } from '../utils/signals.js';
import { extractMetadata, ProjectMetadata } from './extract-metadata.js';
import { generateSingleSpec } from './generate-single-spec.js';
import { summarizeSpec } from './summarize-spec.js';
import { shouldResumeSpec, addFrontmatter } from './resume.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROMPTS_DIR = path.resolve(__dirname, '..', 'prompts', 'system');

// Retry configuration (from docs/cli/04_error_handling.md)
const RETRY_DELAYS_MS = [2_000, 6_000]; // exponential backoff for retries 1 and 2
const MAX_RETRIES_PER_SPEC = 2;
const MAX_RETRIES_TOTAL = 5;

// The 10 role specs + backlog, in generation order (pipeline steps 2-12)
const SPEC_ROLES = [
  { id: '01_product_manager', role: 'product_manager',  label: 'Product Manager',  template: '01_product_manager.hbs',  file: '01_product_manager.md',  minLines: 200 },
  { id: '02_backend_lead',    role: 'backend_lead',     label: 'Backend Lead',      template: '02_backend_lead.hbs',     file: '02_backend_lead.md',     minLines: 300 },
  { id: '03_frontend_lead',   role: 'frontend_lead',    label: 'Frontend Lead',     template: '03_frontend_lead.hbs',    file: '03_frontend_lead.md',    minLines: 250 },
  { id: '04_db_architect',    role: 'db_architect',     label: 'DB Architect',      template: '04_db_architect.hbs',     file: '04_db_architect.md',     minLines: 250 },
  { id: '05_qa_lead',         role: 'qa_lead',          label: 'QA Lead',           template: '05_qa_lead.hbs',          file: '05_qa_lead.md',          minLines: 250 },
  { id: '06_devops_lead',     role: 'devops_lead',      label: 'DevOps Lead',       template: '06_devops_lead.hbs',      file: '06_devops_lead.md',      minLines: 200 },
  { id: '07_marketing_lead',  role: 'marketing_lead',   label: 'Marketing Lead',    template: '07_marketing_lead.hbs',   file: '07_marketing_lead.md',   minLines: 150 },
  { id: '08_finance_lead',    role: 'finance_lead',     label: 'Finance Lead',      template: '08_finance_lead.hbs',     file: '08_finance_lead.md',     minLines: 150 },
  { id: '09_business_lead',   role: 'business_lead',    label: 'Business Lead',     template: '09_business_lead.hbs',    file: '09_business_lead.md',    minLines: 150 },
  { id: '10_ui_designer',     role: 'ui_designer',      label: 'UI Designer',       template: '10_ui_designer.hbs',      file: '10_ui_designer.md',      minLines: 200 },
  { id: 'backlog',            role: 'sprint_planner',   label: 'Sprint Planner',    template: 'backlog.hbs',             file: 'backlog.md',             minLines: 100 },
] as const;

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface GenerateSpecsOptions {
  srsPath: string;
  outputDir: string;
  provider: LLMProvider;
  model?: string;
  force?: boolean;
  verbose?: boolean;
  quiet?: boolean;
  maxBudgetUsd?: number;
}

export interface SpecResult {
  id: string;
  file: string;
  lines: number;
  durationMs: number;
  skipped: boolean;
}

export interface GenerateSpecsResult {
  specs: SpecResult[];
  totalCostUsd: number;   // estimated (tracked structurally, real cost needs token counts from provider)
  totalDurationMs: number;
  skippedCount: number;
  provider: string;
  model: string;
}

// ---------------------------------------------------------------------------
// Validation thresholds (Step 13)
// ---------------------------------------------------------------------------

interface ValidationResult {
  warnings: string[];
  errors: string[];
}

async function validateSpecs(outputDir: string, srsHash: string): Promise<ValidationResult> {
  const warnings: string[] = [];
  const errors: string[] = [];

  for (const spec of SPEC_ROLES) {
    const specPath = path.join(outputDir, spec.file);
    if (!(await exists(specPath))) {
      errors.push(`Missing spec file: ${spec.file}`);
      continue;
    }

    const content = await readFile(specPath);
    const lines = content.split('\n').length;

    // Check frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      errors.push(`${spec.file}: Missing YAML frontmatter`);
    } else {
      // Verify source_hash
      if (!content.includes(`sha256:${srsHash}`)) {
        warnings.push(`${spec.file}: source_hash mismatch (may be stale)`);
      }
    }

    // Line count check (warn only — not a hard error)
    if (lines < spec.minLines) {
      warnings.push(`${spec.file}: only ${lines} lines (minimum ${spec.minLines})`);
    }
  }

  return { warnings, errors };
}

// ---------------------------------------------------------------------------
// Retry helper
// ---------------------------------------------------------------------------

interface RetryState {
  totalRetries: number;
}

async function withRetry<T>(
  fn: () => Promise<T>,
  specLabel: string,
  specIndex: number,
  totalSpecs: number,
  retryState: RetryState,
  provider: LLMProvider,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES_PER_SPEC; attempt++) {
    if (attempt > 0) {
      if (retryState.totalRetries >= MAX_RETRIES_TOTAL) {
        throw new Error(
          `Total retry cap (${MAX_RETRIES_TOTAL}) reached. ` +
            `Run again to resume: autospec generate`,
        );
      }
      const delayMs = RETRY_DELAYS_MS[attempt - 1] ?? RETRY_DELAYS_MS[RETRY_DELAYS_MS.length - 1];
      console.log(
        chalk.yellow(
          `  Retry ${attempt}/${MAX_RETRIES_PER_SPEC} for spec ${specIndex}/${totalSpecs} (${specLabel}) in ${delayMs / 1000}s...`,
        ),
      );
      await new Promise(resolve => setTimeout(resolve, delayMs));
      retryState.totalRetries++;
    }

    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const providerError = provider.parseError(err) as ProviderError;

      // Non-retryable errors halt immediately
      if (!providerError.retryable) {
        throw err;
      }

      // Auth failures always halt
      if (providerError.type === 'auth') {
        throw err;
      }

      if (attempt === MAX_RETRIES_PER_SPEC) {
        // Exhausted retries for this spec
        break;
      }
    }
  }

  throw lastError;
}

// ---------------------------------------------------------------------------
// Main pipeline
// ---------------------------------------------------------------------------

export async function generateSpecs(options: GenerateSpecsOptions): Promise<GenerateSpecsResult> {
  const {
    srsPath,
    outputDir,
    provider,
    model,
    force = false,
    verbose = false,
    quiet = false,
    maxBudgetUsd,
  } = options;

  const isQuiet = quiet || process.env.CI === 'true';
  const log = (msg: string) => { if (!isQuiet) console.log(msg); };

  // -------------------------------------------------------------------------
  // Pre-flight: read SRS, compute hash
  // -------------------------------------------------------------------------

  const srsContent = await readFile(srsPath);
  const srsHash = computeHash(srsContent);
  const srsBasename = path.basename(srsPath);

  // Set up signal handlers for clean interrupt handling
  setSrsPath(srsPath);
  setupSignalHandlers();

  // Register cleanup of output dir temp files
  registerCleanup(async () => {
    await cleanOrphanedTmpFiles(outputDir);
  });

  // Clean orphaned temp files from any previous interrupted run
  const cleanedCount = await cleanOrphanedTmpFiles(outputDir);
  if (cleanedCount > 0 && !isQuiet) {
    console.log(chalk.dim(`  Cleaned ${cleanedCount} orphaned temp file(s) from previous run.`));
  }

  // Ensure output directory exists
  await fs.ensureDir(outputDir);

  // -------------------------------------------------------------------------
  // Step 1: Extract project metadata
  // -------------------------------------------------------------------------

  let metadata: ProjectMetadata;
  const metaSpinner = isQuiet ? null : ora('  [1/13] Extracting project metadata...').start();

  try {
    const generateOptions: GenerateOptions = { model };
    metadata = await extractMetadata(srsContent, provider, generateOptions);
    metaSpinner?.succeed(chalk.green(`  [1/13] Project metadata extracted — ${metadata.projectName}`));
  } catch (err) {
    metaSpinner?.fail(chalk.red('  [1/13] Failed to extract project metadata'));
    throw err;
  }

  if (verbose) {
    log(chalk.dim('  Metadata: ' + JSON.stringify(metadata, null, 2)));
  }

  // -------------------------------------------------------------------------
  // Steps 2-12: Generate each role spec
  // -------------------------------------------------------------------------

  const results: SpecResult[] = [];
  const summaries: Record<string, string> = {}; // id → summary text
  let skippedCount = 0;
  let totalDurationMs = 0;
  const retryState: RetryState = { totalRetries: 0 };
  const startTime = Date.now();

  for (let i = 0; i < SPEC_ROLES.length; i++) {
    const spec = SPEC_ROLES[i];
    const stepNum = i + 2; // Steps 2 through 12
    const totalSteps = 13; // steps 1 through 13 (validate)
    const specPath = path.join(outputDir, spec.file);
    const stepLabel = `[${stepNum}/${totalSteps}]`;

    // --- Resume check ---
    const shouldSkip = await shouldResumeSpec(specPath, srsHash, force);
    if (shouldSkip) {
      skippedCount++;
      if (!isQuiet) {
        console.log(chalk.dim(`  ${stepLabel} ${spec.label} — skipped (up to date)`));
      }
      // Still load summary from existing file for downstream specs
      try {
        const existingContent = await readFile(specPath);
        summaries[spec.id] = summarizeSpec(existingContent);
      } catch {
        // If we can't read it, downstream specs just won't have its summary
      }
      results.push({ id: spec.id, file: spec.file, lines: 0, durationMs: 0, skipped: true });
      continue;
    }

    // --- Budget guard ---
    if (maxBudgetUsd !== undefined) {
      // Rough cost estimate: ~$0.04 per spec (Sonnet, ~9K tokens)
      const estimatedSpentUsd = results.filter(r => !r.skipped).length * 0.04;
      if (estimatedSpentUsd >= maxBudgetUsd) {
        const specsDone = results.filter(r => !r.skipped).length;
        log(chalk.yellow(`\n  Budget cap reached: $${estimatedSpentUsd.toFixed(2)} spent of $${maxBudgetUsd.toFixed(2)} limit.`));
        log(chalk.yellow(`  ${specsDone} of ${SPEC_ROLES.length} specs completed and saved.\n`));
        log(`  To generate remaining specs:`);
        log(`    autospec generate ${srsPath} --max-budget ${(maxBudgetUsd * 2).toFixed(2)}`);
        log(`  Or without a cap:`);
        log(`    autospec generate ${srsPath}\n`);
        process.exit(6);
      }
    }

    // --- Load and compile Handlebars template ---
    const templatePath = path.join(PROMPTS_DIR, spec.template);
    let templateSource: string;
    try {
      templateSource = await readFile(templatePath);
    } catch {
      throw new Error(`Template not found: ${templatePath}`);
    }

    const template = Handlebars.compile(templateSource, { noEscape: true });

    // Build summaries string for this spec (all previously generated)
    const priorSummariesText = Object.entries(summaries)
      .map(([id, summary]) => `### ${id}\n${summary}`)
      .join('\n\n---\n\n');

    const systemPrompt = template({
      projectMetadataJSON: JSON.stringify(metadata, null, 2),
      summariesOfSpecsGeneratedSoFar: priorSummariesText || '(No prior specs yet — this is the first.)',
      fullSRSContent: srsContent,
    });

    // The user prompt is brief — the system prompt carries all context
    const userPrompt = `Generate the ${spec.label} specification for the project described in the system prompt. Output only the Markdown document with YAML frontmatter.`;

    // --- Generate spec with retry ---
    const spinner = isQuiet
      ? null
      : ora(`  ${stepLabel} Generating ${spec.label}...`).start();

    let specContent: string;
    let durationMs: number;

    try {
      const generateOptions: GenerateOptions = { model };

      const result = await withRetry(
        () => generateSingleSpec(userPrompt, systemPrompt, provider, generateOptions),
        spec.label,
        i + 1,
        SPEC_ROLES.length,
        retryState,
        provider,
      );

      specContent = result.content;
      durationMs = result.durationMs;
    } catch (err) {
      spinner?.fail(chalk.red(`  ${stepLabel} Failed to generate ${spec.label}`));

      const providerError = provider.parseError(err) as ProviderError;
      const specsDone = results.filter(r => !r.skipped).length;

      if (providerError.type === 'auth') {
        log(chalk.red(`\n  Error [spec ${i + 1}/${SPEC_ROLES.length}]: Authentication failed for ${provider.name}.`));
        log(chalk.red(`\n  ${providerError.message}`));
        log(`\n  ${specsDone} specs completed and saved. Resume after fixing auth:`);
        log(`    autospec generate ${srsPath}\n`);
        process.exit(5);
      }

      if (providerError.type === 'timeout' || providerError.type === 'network') {
        log(chalk.red(`\n  Error [spec ${i + 1}/${SPEC_ROLES.length}]: ${providerError.message}`));
        log(`\n  ${specsDone} specs completed and saved. Resume with:`);
        log(`    autospec generate ${srsPath}\n`);
        process.exit(7);
      }

      log(chalk.red(`\n  Error [spec ${i + 1}/${SPEC_ROLES.length}]: ${providerError.message}`));
      log(`\n  ${specsDone} specs completed and saved. Resume with:`);
      log(`    autospec generate ${srsPath}\n`);
      process.exit(1);
    }

    // --- Strip any YAML frontmatter the LLM already wrote, then add ours ---
    // (LLMs sometimes add frontmatter even though we add it ourselves)
    const contentWithoutFrontmatter = specContent.replace(/^---\n[\s\S]*?\n---\n*/, '');
    const finalContent = addFrontmatter(contentWithoutFrontmatter, {
      role: spec.role,
      model: model ?? 'auto',
      provider: provider.name,
      sourceSrs: srsBasename,
      sourceHash: srsHash,
    });

    // --- Write atomically ---
    await atomicWriteFile(specPath, finalContent);

    // --- Extract summary for downstream specs ---
    summaries[spec.id] = summarizeSpec(finalContent);

    const lineCount = finalContent.split('\n').length;
    totalDurationMs += durationMs;

    spinner?.succeed(
      chalk.green(`  ${stepLabel} ${spec.label}`) +
        chalk.dim(` — ${lineCount} lines, ${(durationMs / 1000).toFixed(1)}s`),
    );

    if (verbose) {
      log(chalk.dim(`    Summary:\n${summaries[spec.id].slice(0, 300)}...`));
    }

    results.push({ id: spec.id, file: spec.file, lines: lineCount, durationMs, skipped: false });
  }

  // -------------------------------------------------------------------------
  // Step 13: Validate all specs (local, no LLM)
  // -------------------------------------------------------------------------

  const validateSpinner = isQuiet ? null : ora('  [13/13] Validating specs...').start();
  const validation = await validateSpecs(outputDir, srsHash);

  if (validation.errors.length > 0) {
    validateSpinner?.fail(chalk.red('  [13/13] Validation failed'));
    for (const err of validation.errors) {
      log(chalk.red(`    ✗ ${err}`));
    }
    for (const warn of validation.warnings) {
      log(chalk.yellow(`    ⚠ ${warn}`));
    }
  } else {
    validateSpinner?.succeed(chalk.green('  [13/13] Validation passed'));
    for (const warn of validation.warnings) {
      log(chalk.yellow(`    ⚠ ${warn}`));
    }
  }

  // -------------------------------------------------------------------------
  // Step 14: Write specs/.meta.json (purely informational)
  // -------------------------------------------------------------------------

  const totalRunDurationMs = Date.now() - startTime;
  const generatedCount = results.filter(r => !r.skipped).length;

  const metaJson = {
    version: '0.2.0',
    generatedAt: new Date().toISOString(),
    provider: provider.name,
    model: model ?? 'auto',
    sourceSrs: srsBasename,
    sourceHash: `sha256:${srsHash}`,
    specs: Object.fromEntries(
      results.map(r => [
        r.id,
        {
          status: r.skipped ? 'skipped' : 'complete',
          lines: r.lines,
          durationMs: r.durationMs,
        },
      ]),
    ),
    totalGeneratedCount: generatedCount,
    totalSkippedCount: skippedCount,
    totalDurationMs: totalRunDurationMs,
  };

  const metaPath = path.join(outputDir, '.meta.json');
  try {
    await atomicWriteFile(metaPath, JSON.stringify(metaJson, null, 2) + '\n');
  } catch {
    // .meta.json is purely informational — failure here is non-fatal
    if (verbose) {
      log(chalk.dim('  Warning: Could not write .meta.json (non-fatal)'));
    }
  }

  // -------------------------------------------------------------------------
  // Completion summary
  // -------------------------------------------------------------------------

  if (!isQuiet) {
    const totalSeconds = Math.round(totalRunDurationMs / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

    log('');
    log(chalk.bold.green('  autospec generate — Complete!'));
    log('');
    log(`  Generated ${generatedCount} file(s) in ${path.relative(process.cwd(), outputDir) || outputDir}/`);

    for (const r of results) {
      if (r.skipped) {
        log(chalk.dim(`    ${r.file.padEnd(30)} (skipped — up to date)`));
      } else {
        log(`    ${chalk.cyan(r.file.padEnd(30))} ${String(r.lines).padStart(4)} lines`);
      }
    }

    log('');
    log(`  Time: ${timeStr} | Provider: ${provider.name}${model ? ` (${model})` : ''}`);
    if (skippedCount > 0) {
      log(chalk.dim(`  Skipped ${skippedCount} spec(s) that were already up to date`));
    }
    log('');
    log('  Next steps:');
    log(`    1. Review specs:    ls ${path.relative(process.cwd(), outputDir) || outputDir}/`);
    log(`    2. Check backlog:   autospec status`);
    log(`    3. Start Sprint 0:  autospec sprint 0`);
    log('');
  }

  return {
    specs: results,
    totalCostUsd: 0, // real cost tracking requires token counts from provider; deferred to v0.3.0
    totalDurationMs: totalRunDurationMs,
    skippedCount,
    provider: provider.name,
    model: model ?? 'auto',
  };
}
