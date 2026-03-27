/**
 * Wave-Aware Progress Display
 * Shows spinner per wave with per-spec completion lines for parallel mode.
 *
 * Sprint 36 ticket 36.5
 */

import ora, { Ora } from 'ora';
import chalk from 'chalk';

export class WaveProgress {
  private currentWave: number = 0;
  private readonly totalWaves: number;
  private spinner: Ora | null;
  private readonly quiet: boolean;

  constructor(totalWaves: number, quiet: boolean) {
    this.totalWaves = totalWaves;
    this.quiet = quiet;
    this.spinner = quiet ? null : ora();
  }

  startWave(waveIndex: number, specLabels: string[]): void {
    this.currentWave = waveIndex;
    const label =
      specLabels.length === 1 ? specLabels[0] : specLabels.join(', ');
    this.spinner?.start(
      `  [${waveIndex + 1}/${this.totalWaves}] ${label}...`,
    );
  }

  specCompleted(specLabel: string, lines: number, durationMs: number): void {
    // For multi-spec waves, log each completion below the spinner
    if (!this.quiet) {
      // Stop spinner temporarily to flush the line cleanly
      const wasSpinning = this.spinner?.isSpinning ?? false;
      if (wasSpinning) this.spinner?.stop();

      process.stdout.write(
        chalk.dim(
          `        ${specLabel} — ${lines} lines, ${(durationMs / 1000).toFixed(1)}s\n`,
        ),
      );

      if (wasSpinning) {
        const label = `  [${this.currentWave + 1}/${this.totalWaves}]`;
        this.spinner?.start(`${label} continuing...`);
      }
    }
  }

  waveCompleted(
    waveIndex: number,
    specLabels: string[],
    totalDurationMs: number,
  ): void {
    const label =
      specLabels.length === 1 ? specLabels[0] : `${specLabels.length} specs`;
    this.spinner?.succeed(
      chalk.green(`  [${waveIndex + 1}/${this.totalWaves}] ${label}`) +
        chalk.dim(` — ${(totalDurationMs / 1000).toFixed(1)}s`),
    );
  }

  waveFailed(waveIndex: number, error: string): void {
    this.spinner?.fail(
      chalk.red(`  [${waveIndex + 1}/${this.totalWaves}] ${error}`),
    );
  }
}
