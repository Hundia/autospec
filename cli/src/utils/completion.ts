import chalk from 'chalk';

export interface CompletionOptions {
  outputDir: string;
  specs: { id: string; lines: number; durationMs: number }[];
  totalCostUsd: number;
  totalDurationMs: number;
  providerName: string;
  modelName: string;
  skippedCount: number;
  quiet?: boolean;
}

export async function showCompletion(options: CompletionOptions): Promise<void> {
  if (options.quiet) {
    // Quiet mode — single line
    console.log(`autospec: complete (${options.specs.length} files, $${options.totalCostUsd.toFixed(2)}, ${formatDuration(options.totalDurationMs)})`);
    return;
  }

  console.log(chalk.bold.green('\n  autospec generate — Complete!\n'));
  console.log(`  Generated ${options.specs.length} files in ${options.outputDir}/`);

  for (const spec of options.specs) {
    const name = `${spec.id}.md`.padEnd(30);
    console.log(`    ${name} ${spec.lines} lines`);
  }

  console.log(`\n  Cost: $${options.totalCostUsd.toFixed(2)} | Time: ${formatDuration(options.totalDurationMs)} | Provider: ${options.providerName} (${options.modelName})`);

  if (options.skippedCount > 0) {
    console.log(chalk.dim(`  (${options.skippedCount} specs skipped — already up to date)`));
  }

  console.log(chalk.bold('\n  Next steps:'));
  console.log(`    1. Review specs:    ls ${options.outputDir}/`);
  console.log(`    2. Check backlog:   autospec status`);
  console.log(`    3. Start Sprint 0:  autospec sprint 0\n`);
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Quiet-mode per-spec progress line
 */
export function quietSpecDone(specId: string, lines: number, durationMs: number): void {
  console.log(`autospec: specs/${specId}.md (${lines} lines, ${formatDuration(durationMs)})`);
}
