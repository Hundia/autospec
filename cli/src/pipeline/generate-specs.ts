/**
 * Generate Specs — 14-Step Pipeline Orchestrator
 * Core of `autospec generate`. Runs: metadata → 10 role specs → backlog → validate → meta.json.
 *
 * Steps:
 *   1.  Extract project metadata (LLM, JSON)
 *   2-12. Generate each role spec (LLM, Markdown) with cross-spec summaries
 *   13. Validate all specs (local, no LLM)
 *   14. Write specs/.meta.json (informational)
 *
 * v0.3.0: Wave-based parallel generation (Sprint 36)
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
import { computeWaves, selectSummaries, DEPENDENCY_GRAPH } from './wave-scheduler.js';
import { WaveProgress } from '../utils/wave-progress.js';

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
// EXPORTED so wave-scheduler.ts can import for type inference
export const SPEC_ROLES = [
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
  /** Enable wave-based parallel generation. Default: true */
  parallel?: boolean;
  /** Max concurrent specs within a wave. Default: auto-detect from provider */
  concurrency?: number;
}

export interface SpecResult {
  id: string;
  file: string;
  lines: number;
  durationMs: number;
  skipped: boolean;
  failed?: boolean;
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
// LLM output cleaner (D2: strip agent narration artifacts)
// ---------------------------------------------------------------------------

/**
 * Clean LLM output artifacts — strip agent narration, tool-use text,
 * and anything before the first markdown heading or YAML frontmatter.
 */
function cleanLLMOutput(content: string): string {
  // Remove any text before the first --- (YAML frontmatter) or # heading
  const frontmatterStart = content.indexOf('---');
  const headingStart = content.search(/^#\s/m);

  let start = -1;
  if (frontmatterStart >= 0 && headingStart >= 0) {
    start = Math.min(frontmatterStart, headingStart);
  } else if (frontmatterStart >= 0) {
    start = frontmatterStart;
  } else if (headingStart >= 0) {
    start = headingStart;
  }

  if (start > 0) {
    content = content.slice(start);
  }

  // Remove markdown code fence wrappers (```markdown ... ```)
  content = content.replace(/^```(?:markdown|md)?\n/gm, '');
  content = content.replace(/\n```\s*$/gm, '');

  return content.trim();
}

// ---------------------------------------------------------------------------
// Concurrency limiter
// ---------------------------------------------------------------------------

/**
 * Run tasks with a maximum concurrency cap.
 * Uses Promise.allSettled semantics — never aborts siblings on failure.
 */
export async function executeWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  maxConcurrency: number,
): Promise<PromiseSettledResult<T>[]> {
  const results: PromiseSettledResult<T>[] = new Array(tasks.length);
  const executing = new Set<Promise<void>>();
  let taskIndex = 0;

  for (let i = 0; i < tasks.length; i++) {
    const index = i;
    const task = tasks[index];

    const p: Promise<void> = task().then(
      value => {
        results[index] = { status: 'fulfilled', value };
      },
      reason => {
        results[index] = { status: 'rejected', reason };
      },
    ).finally(() => executing.delete(p));

    executing.add(p);
    taskIndex++;

    if (executing.size >= maxConcurrency) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}

// ---------------------------------------------------------------------------
// Provider-aware default concurrency
// ---------------------------------------------------------------------------

function getDefaultConcurrency(provider: LLMProvider): number {
  switch (provider.name) {
    case 'anthropic-api': return 5;
    case 'claude-code':   return 3;
    case 'gemini-cli':    return 3;
    default:              return 3;
  }
}

// ---------------------------------------------------------------------------
// Per-spec generation (used inside waves)
// ---------------------------------------------------------------------------

interface SpecGenerationInput {
  spec: typeof SPEC_ROLES[number];
  summariesSnapshot: Record<string, string>; // immutable snapshot from wave start
  metadata: ProjectMetadata;
  srsContent: string;
  srsBasename: string;
  srsHash: string;
  provider: LLMProvider;
  model: string | undefined;
}

interface SpecGenerationOutput {
  id: string;
  file: string;
  content: string;
  lines: number;
  durationMs: number;
}

async function generateOneSpec(
  input: SpecGenerationInput,
  retryState: RetryState,
  specIndexOneBased: number,
  totalSpecs: number,
): Promise<SpecGenerationOutput> {
  const { spec, summariesSnapshot, metadata, srsContent, srsBasename, srsHash, provider, model } = input;

  // Load and compile Handlebars template
  const templatePath = path.join(PROMPTS_DIR, spec.template);
  let templateSource: string;
  try {
    templateSource = await readFile(templatePath);
  } catch {
    throw new Error(`Template not found: ${templatePath}`);
  }

  const template = Handlebars.compile(templateSource, { noEscape: true });

  // Build summaries text — use only what this spec depends on (ticket 36.2)
  const selectedSummaries = selectSummaries(summariesSnapshot, spec.id);
  const priorSummariesText = Object.entries(selectedSummaries)
    .map(([id, summary]) => `### ${id}\n${summary}`)
    .join('\n\n---\n\n');

  const systemPrompt = template({
    projectMetadataJSON: JSON.stringify(metadata, null, 2),
    summariesOfSpecsGeneratedSoFar: priorSummariesText || '(No prior specs yet — this is the first.)',
    fullSRSContent: srsContent,
  });

  const userPrompt = `Generate the ${spec.label} specification for the project described in the system prompt. Output only the Markdown document with YAML frontmatter.`;

  const generateOptions: GenerateOptions = { model };

  const result = await withRetry(
    () => generateSingleSpec(userPrompt, systemPrompt, provider, generateOptions),
    spec.label,
    specIndexOneBased,
    totalSpecs,
    retryState,
    provider,
  );

  const specContent = result.content;
  const durationMs = result.durationMs;

  // Clean LLM output artifacts
  const cleanedContent = cleanLLMOutput(specContent);

  // Strip any LLM-added frontmatter, then add canonical frontmatter
  const contentWithoutFrontmatter = cleanedContent.replace(/^(\s*---\n[\s\S]*?\n---\n*)+/, '');
  const finalContent = addFrontmatter(contentWithoutFrontmatter, {
    role: spec.role,
    model: model ?? 'auto',
    provider: provider.name,
    sourceSrs: srsBasename,
    sourceHash: srsHash,
  });

  return {
    id: spec.id,
    file: spec.file,
    content: finalContent,
    lines: finalContent.split('\n').length,
    durationMs,
  };
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
    parallel = true,
    concurrency,
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
  // Steps 2-12: Generate each role spec (wave-based or sequential)
  // -------------------------------------------------------------------------

  const results: SpecResult[] = [];
  const summaries: Record<string, string> = {}; // id → summary text
  let skippedCount = 0;
  let totalDurationMs = 0;
  const retryState: RetryState = { totalRetries: 0 };
  const startTime = Date.now();
  const failedSpecs = new Set<string>();

  // Build wave list:
  // - parallel mode: topological waves (multiple specs per wave)
  // - sequential mode (--no-parallel): one spec per wave, preserving original order
  const waves = parallel
    ? computeWaves(SPEC_ROLES)
    : SPEC_ROLES.map((spec, i) => ({
        index: i,
        specs: [spec] as typeof SPEC_ROLES[number][],
        dependencies: { [spec.id]: DEPENDENCY_GRAPH[spec.id] ?? [] },
      }));

  const maxConcurrency = concurrency ?? getDefaultConcurrency(provider);
  const waveProgress = new WaveProgress(waves.length, isQuiet);

  // Track global spec index for step numbering (steps 2-12)
  let globalSpecIndex = 0;

  for (const wave of waves) {
    // ---
    // Resume check: for each spec in this wave, determine if it needs generation
    // ---
    const toGenerate: typeof SPEC_ROLES[number][] = [];
    const waveSkipped: SpecResult[] = [];

    for (const spec of wave.specs) {
      globalSpecIndex++;
      const specPath = path.join(outputDir, spec.file);

      // Block if any dependency failed
      const deps = DEPENDENCY_GRAPH[spec.id] ?? [];
      const blockedBy = deps.filter(d => failedSpecs.has(d));
      if (blockedBy.length > 0) {
        log(chalk.yellow(`  Skipping ${spec.label} — blocked by failed: ${blockedBy.join(', ')}`));
        failedSpecs.add(spec.id);
        results.push({ id: spec.id, file: spec.file, lines: 0, durationMs: 0, skipped: false, failed: true });
        continue;
      }

      // Resume check
      const shouldSkip = await shouldResumeSpec(specPath, srsHash, force);
      if (shouldSkip) {
        skippedCount++;
        if (!isQuiet) {
          const stepNum = globalSpecIndex + 1;
          console.log(chalk.dim(`  [${stepNum}/13] ${spec.label} — skipped (up to date)`));
        }
        // Still load summary from existing file for downstream specs
        try {
          const existingContent = await readFile(specPath);
          summaries[spec.id] = summarizeSpec(existingContent);
        } catch {
          // If we can't read it, downstream specs just won't have its summary
        }
        const skippedResult: SpecResult = { id: spec.id, file: spec.file, lines: 0, durationMs: 0, skipped: true };
        waveSkipped.push(skippedResult);
        results.push(skippedResult);
        continue;
      }

      // Budget guard
      if (maxBudgetUsd !== undefined) {
        const estimatedSpentUsd = results.filter(r => !r.skipped && !r.failed).length * 0.04;
        if (estimatedSpentUsd >= maxBudgetUsd) {
          const specsDone = results.filter(r => !r.skipped && !r.failed).length;
          log(chalk.yellow(`\n  Budget cap reached: $${estimatedSpentUsd.toFixed(2)} spent of $${maxBudgetUsd.toFixed(2)} limit.`));
          log(chalk.yellow(`  ${specsDone} of ${SPEC_ROLES.length} specs completed and saved.\n`));
          log(`  To generate remaining specs:`);
          log(`    autospec generate ${srsPath} --max-budget ${(maxBudgetUsd * 2).toFixed(2)}`);
          log(`  Or without a cap:`);
          log(`    autospec generate ${srsPath}\n`);
          process.exit(6);
        }
      }

      toGenerate.push(spec);
    }

    if (toGenerate.length === 0) continue; // entire wave is skipped or blocked

    // ---
    // Take immutable snapshot of summaries before this wave starts
    // (all specs in the same wave share the same snapshot — ticket 36.6)
    // ---
    const summariesSnapshot = { ...summaries };

    // ---
    // Show wave progress
    // ---
    const specLabels = toGenerate.map(s => s.label);
    if (!isQuiet) {
      if (parallel && toGenerate.length > 1) {
        waveProgress.startWave(wave.index, specLabels);
      }
      // In sequential mode, individual ora spinners will be used (see below)
    }

    const waveStart = Date.now();

    if (parallel && toGenerate.length > 1) {
      // ---
      // Parallel execution within the wave (ticket 36.3)
      // ---
      const tasks = toGenerate.map(spec => () =>
        generateOneSpec(
          {
            spec,
            summariesSnapshot,
            metadata,
            srsContent,
            srsBasename,
            srsHash,
            provider,
            model,
          },
          retryState,
          globalSpecIndex,
          SPEC_ROLES.length,
        ),
      );

      const settled = await executeWithConcurrency(tasks, maxConcurrency);

      for (let i = 0; i < settled.length; i++) {
        const settledResult = settled[i];
        const spec = toGenerate[i];
        const specPath = path.join(outputDir, spec.file);

        if (settledResult.status === 'rejected') {
          failedSpecs.add(spec.id);
          waveProgress.waveFailed(wave.index, `${spec.label} failed: ${settledResult.reason}`);
          log(chalk.red(`  ${spec.label} failed: ${settledResult.reason}`));
          results.push({ id: spec.id, file: spec.file, lines: 0, durationMs: 0, skipped: false, failed: true });
        } else {
          const output = settledResult.value;

          // Write atomically
          await atomicWriteFile(specPath, output.content);

          // Extract summary for downstream waves
          summaries[spec.id] = summarizeSpec(output.content);
          totalDurationMs += output.durationMs;

          if (!isQuiet) {
            waveProgress.specCompleted(spec.label, output.lines, output.durationMs);
          }
          if (verbose) {
            log(chalk.dim(`    Summary:\n${summaries[spec.id].slice(0, 300)}...`));
          }

          results.push({ id: spec.id, file: spec.file, lines: output.lines, durationMs: output.durationMs, skipped: false });
        }
      }

      const waveDurationMs = Date.now() - waveStart;

      // Determine final labels: only successful ones
      const successLabels = toGenerate
        .filter((_, i) => settled[i].status === 'fulfilled')
        .map(s => s.label);

      if (successLabels.length > 0) {
        waveProgress.waveCompleted(wave.index, successLabels, waveDurationMs);
      }

    } else {
      // ---
      // Sequential execution (--no-parallel, or single-spec wave in parallel mode)
      // Matches exact v0.2.0 behavior: individual ora spinners, all prior summaries
      // ---
      for (let si = 0; si < toGenerate.length; si++) {
        const spec = toGenerate[si];
        const specPath = path.join(outputDir, spec.file);
        const stepNum = results.length + 2; // Steps 2 through 12
        const stepLabel = `[${stepNum}/13]`;

        const spinner = isQuiet
          ? null
          : ora(`  ${stepLabel} Generating ${spec.label}...`).start();

        let output: SpecGenerationOutput;

        // In sequential (--no-parallel) mode, inject ALL prior summaries (not selective)
        // to maintain v0.2.0 identical output behavior
        const sequentialSummariesSnapshot = parallel
          ? summariesSnapshot          // wave of 1 in parallel mode → use snapshot (selective)
          : { ...summaries };          // true sequential → all prior summaries at this point

        try {
          output = await generateOneSpec(
            {
              spec,
              // For --no-parallel: override selectedSummaries to inject all prior summaries
              // We do this by setting summariesSnapshot to the current full summaries
              summariesSnapshot: sequentialSummariesSnapshot,
              metadata,
              srsContent,
              srsBasename,
              srsHash,
              provider,
              model,
            },
            retryState,
            globalSpecIndex,
            SPEC_ROLES.length,
          );
        } catch (err) {
          spinner?.fail(chalk.red(`  ${stepLabel} Failed to generate ${spec.label}`));
          failedSpecs.add(spec.id);

          const providerError = provider.parseError(err) as ProviderError;
          const specsDone = results.filter(r => !r.skipped && !r.failed).length;

          if (providerError.type === 'auth') {
            log(chalk.red(`\n  Error [spec ${globalSpecIndex}/${SPEC_ROLES.length}]: Authentication failed for ${provider.name}.`));
            log(chalk.red(`\n  ${providerError.message}`));
            log(`\n  ${specsDone} specs completed and saved. Resume after fixing auth:`);
            log(`    autospec generate ${srsPath}\n`);
            process.exit(5);
          }

          if (providerError.type === 'timeout' || providerError.type === 'network') {
            log(chalk.red(`\n  Error [spec ${globalSpecIndex}/${SPEC_ROLES.length}]: ${providerError.message}`));
            log(`\n  ${specsDone} specs completed and saved. Resume with:`);
            log(`    autospec generate ${srsPath}\n`);
            process.exit(7);
          }

          log(chalk.red(`\n  Error [spec ${globalSpecIndex}/${SPEC_ROLES.length}]: ${providerError.message}`));
          log(`\n  ${specsDone} specs completed and saved. Resume with:`);
          log(`    autospec generate ${srsPath}\n`);
          process.exit(1);
        }

        // Write atomically
        await atomicWriteFile(specPath, output.content);

        // Extract summary for downstream specs
        summaries[spec.id] = summarizeSpec(output.content);
        totalDurationMs += output.durationMs;

        spinner?.succeed(
          chalk.green(`  ${stepLabel} ${spec.label}`) +
            chalk.dim(` — ${output.lines} lines, ${(output.durationMs / 1000).toFixed(1)}s`),
        );

        if (verbose) {
          log(chalk.dim(`    Summary:\n${summaries[spec.id].slice(0, 300)}...`));
        }

        results.push({ id: spec.id, file: spec.file, lines: output.lines, durationMs: output.durationMs, skipped: false });
      }
    }
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
  const generatedCount = results.filter(r => !r.skipped && !r.failed).length;

  const metaJson = {
    version: '0.3.0',
    generatedAt: new Date().toISOString(),
    provider: provider.name,
    model: model ?? 'auto',
    sourceSrs: srsBasename,
    sourceHash: `sha256:${srsHash}`,
    parallel,
    specs: Object.fromEntries(
      results.map(r => [
        r.id,
        {
          status: r.failed ? 'failed' : r.skipped ? 'skipped' : 'complete',
          lines: r.lines,
          durationMs: r.durationMs,
        },
      ]),
    ),
    totalGeneratedCount: generatedCount,
    totalSkippedCount: skippedCount,
    totalFailedCount: failedSpecs.size,
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
      if (r.failed) {
        log(chalk.red(`    ${r.file.padEnd(30)} (FAILED)`));
      } else if (r.skipped) {
        log(chalk.dim(`    ${r.file.padEnd(30)} (skipped — up to date)`));
      } else {
        log(`    ${chalk.cyan(r.file.padEnd(30))} ${String(r.lines).padStart(4)} lines`);
      }
    }

    log('');
    log(`  Time: ${timeStr} | Provider: ${provider.name}${model ? ` (${model})` : ''}`);
    if (parallel) {
      log(chalk.dim(`  Mode: parallel (concurrency: ${maxConcurrency})`));
    }
    if (skippedCount > 0) {
      log(chalk.dim(`  Skipped ${skippedCount} spec(s) that were already up to date`));
    }
    if (failedSpecs.size > 0) {
      log(chalk.yellow(`  ${failedSpecs.size} spec(s) failed. Resume with:`));
      log(chalk.yellow(`    autospec generate ${srsPath}`));
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
