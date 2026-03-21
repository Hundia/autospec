/**
 * Generate Command — Tier 1 (LLM-backed)
 * Generates all 10 role specs + backlog from an SRS/PRD document.
 *
 * Usage:
 *   autospec generate <file>
 *   autospec generate --interview
 *   cat reqs.md | autospec generate -
 */

import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { confirm } from '@inquirer/prompts';
import { resolveProvider } from '../providers/resolver.js';
import { loadEnvCascade } from '../utils/env.js';
import { generateSpecs } from '../pipeline/generate-specs.js';
import { runInterview } from './interview.js';
import { validateSrsInput, printValidationError } from '../utils/validation.js';
import { showConfirmation } from '../utils/confirmation.js';
import { showCompletion } from '../utils/completion.js';
import { ProviderError } from '../providers/interface.js';
import { computeHash, readFile, exists } from '../utils/file.js';

// The 11 spec files, in generation order (mirrors pipeline's SPEC_ROLES)
const DRY_RUN_SPECS = [
  'specs/01_product_manager.md',
  'specs/02_backend_lead.md',
  'specs/03_frontend_lead.md',
  'specs/04_db_architect.md',
  'specs/05_qa_lead.md',
  'specs/06_devops_lead.md',
  'specs/07_marketing_lead.md',
  'specs/08_finance_lead.md',
  'specs/09_business_lead.md',
  'specs/10_ui_designer.md',
  'specs/backlog.md',
] as const;

export interface GenerateCommandOptions {
  srs?: string;
  interview?: boolean;
  provider?: string;
  model?: string;
  spec?: string;
  output?: string;
  maxBudget?: string;
  force?: boolean;
  fallback?: boolean;
  yes?: boolean;
  dryRun?: boolean;
  quiet?: boolean;
  verbose?: boolean;
}

export async function generateCommand(
  file: string | undefined,
  options: GenerateCommandOptions,
): Promise<void> {
  // 1. Load env cascade (.env → git root .env → ~/.autospec/.env)
  await loadEnvCascade();

  // 2. Determine SRS path
  let srsPath = file || options.srs;
  const isStdin = srsPath === '-';
  const isInterview = options.interview;

  // Stdin pipe auto-implies --yes (non-interactive)
  if (isStdin || !process.stdin.isTTY) {
    options.yes = true;
  }

  // Quiet mode from CI env
  if (process.env.CI === 'true') {
    options.quiet = true;
  }

  // 3. Validate: need either file, stdin, or --interview
  if (!srsPath && !isInterview) {
    console.error(chalk.red('\n  Error: No input specified.\n'));
    console.error('  Usage:');
    console.error('    autospec generate <file>');
    console.error('    autospec generate --interview');
    console.error('    cat reqs.md | autospec generate -\n');
    process.exit(2);
  }

  // 4. Handle stdin
  if (isStdin) {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk as Buffer);
    }
    const stdinContent = Buffer.concat(chunks).toString('utf-8');
    const outputDir = options.output || './specs';
    srsPath = path.join(outputDir, '.stdin-srs.md');
    await fs.ensureDir(path.dirname(srsPath));
    await fs.writeFile(srsPath, stdinContent);
  }

  // 5. Handle interview mode
  if (isInterview) {
    const outputDir = options.output || './specs';
    srsPath = await runInterview(outputDir);
  }

  // 6. Validate SRS input (empty, binary, short) — skip for interview (SRS is generated)
  // Cache the result so we don't re-read the file at confirmation time
  let srsWordCount = 0;
  if (!isInterview) {
    const validation = await validateSrsInput(srsPath!);
    srsWordCount = validation.wordCount;

    if (!validation.valid) {
      printValidationError(validation);
      // File not found → exit 3; other validation errors (binary, empty) → exit 2
      const exitCode = validation.error?.includes('not found') ? 3 : 2;
      process.exit(exitCode);
    }
    if (validation.warning) {
      printValidationError(validation);
      if (!options.yes) {
        const proceed = await confirm({ message: 'Proceed anyway?', default: false });
        if (!proceed) process.exit(0);
      }
    }

    // 7. Handle --dry-run: show plan without making LLM calls
    if (options.dryRun) {
      const outputDir = options.output || './specs';

      // We need a provider for display — resolve it (errors are for display only)
      let dryProvider = { name: options.provider || 'auto-detect' };
      try {
        dryProvider = await resolveProvider(options.provider);
      } catch {
        // If no provider found, still show dry-run output with placeholder
      }

      // Compute SRS hash for display
      const srsContent = await readFile(srsPath!);
      const srsHash = computeHash(srsContent);
      const shortHash = srsHash.slice(0, 7);

      console.log(chalk.bold('\n  autospec generate --dry-run\n'));
      console.log(`  Provider:  ${dryProvider.name} — ${options.model || 'default'}`);
      console.log(`  SRS:       ${srsPath} (${srsWordCount.toLocaleString()} words, sha256:${shortHash}...)`);
      console.log(`  Output:    ${outputDir}/`);
      console.log('\n  Files to generate:');

      for (let i = 0; i < DRY_RUN_SPECS.length; i++) {
        const specFile = DRY_RUN_SPECS[i];
        // Resolve relative to cwd
        const specPath = path.isAbsolute(specFile) ? specFile : path.join(process.cwd(), specFile);
        const specExists = await exists(specPath);
        let status = '(NEW)';
        if (specExists && !options.force) {
          try {
            const existingContent = await readFile(specPath);
            if (existingContent.includes(`sha256:${srsHash}`)) {
              status = '(SKIP — up to date)';
            } else {
              status = '(REGENERATE)';
            }
          } catch {
            status = '(NEW)';
          }
        }
        console.log(`    [${String(i + 1).padStart(2)}] ${specFile.padEnd(38)} ${status}`);
      }

      console.log('\n  Est. cost: $0.20–$0.80 (Sonnet)');
      console.log('  Est. time: ~100–120 seconds');
      console.log('\n  No LLM calls made. Run without --dry-run to generate.\n');
      process.exit(0);
    }
  }

  // 8. Resolve provider (auto-detect or respect --provider flag)
  let provider;
  try {
    provider = await resolveProvider(options.provider);
  } catch (error) {
    if (error instanceof Error && error.message.includes('No LLM provider')) {
      console.error(chalk.red('\n  Error: No LLM provider available.\n'));
      console.error('  Install a supported provider or set ANTHROPIC_API_KEY:');
      console.error('    Claude Code CLI:  claude auth login');
      console.error('    Gemini CLI:       gemini auth');
      console.error('    Anthropic API:    export ANTHROPIC_API_KEY=sk-...\n');
      console.error('  Run `autospec doctor` for a full system check.\n');
      process.exit(4);
    }
    throw error;
  }

  // 9. Handle --fallback flag
  if (options.fallback) {
    if (!options.quiet) {
      console.log(chalk.dim('  Note: --fallback set. Cross-provider fallback chain coming in v0.2.1.'));
    }
    // For MVP, the flag is accepted and passed through; full fallback chain ships in v0.2.1
  }

  // 10. Pre-generation confirmation prompt
  const confirmed = await showConfirmation({
    srsPath: srsPath!,
    wordCount: srsWordCount,
    providerName: provider.name,
    modelName: options.model || 'default',
    specCount: 11,
    skippedCount: 0, // TODO: pre-compute from resume check before pipeline
    estimatedCostRange: [0.20, 0.80],
    estimatedTimeSeconds: [100, 120],
    maxBudgetUsd: options.maxBudget ? parseFloat(options.maxBudget) : undefined,
    yes: options.yes,
    quiet: options.quiet,
  });
  if (!confirmed) process.exit(0);

  // 11. Call the 14-step pipeline
  try {
    const result = await generateSpecs({
      srsPath: srsPath!,
      outputDir: options.output || './specs',
      provider,
      model: options.model,
      force: options.force,
      verbose: options.verbose,
      quiet: options.quiet,
      maxBudgetUsd: options.maxBudget ? parseFloat(options.maxBudget) : undefined,
    });

    // 12. Completion summary (command-layer summary after pipeline completes)
    await showCompletion({
      outputDir: options.output || './specs',
      specs: result.specs.filter(s => !s.skipped),
      totalCostUsd: result.totalCostUsd,
      totalDurationMs: result.totalDurationMs,
      providerName: result.provider,
      modelName: result.model,
      skippedCount: result.skippedCount,
      quiet: options.quiet,
    });
  } catch (error) {
    // 13. Map structured provider errors to exit codes (docs/cli/04_error_handling.md)
    if (error && typeof error === 'object' && 'type' in error) {
      const providerError = error as ProviderError;
      switch (providerError.type) {
        case 'auth':
          process.exit(5);
        case 'rate_limit':
        case 'timeout':
        case 'network':
          process.exit(7);
        case 'budget_exceeded':
          process.exit(6);
        case 'model_not_found':
          process.exit(2);
        default:
          process.exit(1);
      }
    }

    // No LLM provider found (from within pipeline)
    if (error instanceof Error && error.message.includes('No LLM provider')) {
      process.exit(4);
    }

    // Unexpected error
    if (!options.quiet) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(chalk.red(`\n  Unexpected error: ${msg}\n`));
    }
    process.exit(1);
  }

  // 14. Clean exit
  process.exit(0);
}
