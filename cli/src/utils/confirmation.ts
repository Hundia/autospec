import chalk from 'chalk';
import { confirm } from '@inquirer/prompts';

export interface ConfirmationOptions {
  srsPath: string;
  wordCount: number;
  providerName: string;
  modelName: string;
  specCount: number;
  skippedCount: number;
  estimatedCostRange: [number, number];  // [min, max] in USD
  estimatedTimeSeconds: [number, number]; // [min, max]
  maxBudgetUsd?: number;
  yes?: boolean;
  quiet?: boolean;
}

export async function showConfirmation(options: ConfirmationOptions): Promise<boolean> {
  if (options.yes || options.quiet) return true;

  const generateCount = options.specCount - options.skippedCount;

  console.log(chalk.bold('\n  autospec generate — Pre-flight Summary\n'));
  console.log(`  SRS:       ${options.srsPath} (${options.wordCount.toLocaleString()} words)`);
  console.log(`  Provider:  ${options.providerName} — ${options.modelName}`);
  console.log(`  Specs:     ${generateCount} to generate` + (options.skippedCount > 0 ? ` (${options.skippedCount} skipped — up to date)` : ` (${options.specCount} total)`));
  console.log(`  Est. cost: $${options.estimatedCostRange[0].toFixed(2)}–$${options.estimatedCostRange[1].toFixed(2)}`);
  console.log(`  Est. time: ~${Math.round(options.estimatedTimeSeconds[0])}–${Math.round(options.estimatedTimeSeconds[1])}s`);

  if (options.maxBudgetUsd) {
    const budgetStr = `$${options.maxBudgetUsd.toFixed(2)}`;
    if (options.maxBudgetUsd < options.estimatedCostRange[1]) {
      console.log(chalk.yellow(`  Budget:    ${budgetStr} (may halt mid-run if estimate exceeds budget)`));
    } else {
      console.log(`  Budget:    ${budgetStr}`);
    }
  }

  // Resume celebration
  if (options.skippedCount > 0) {
    const savedMin = (options.estimatedCostRange[0] * options.skippedCount / options.specCount).toFixed(2);
    const savedMax = (options.estimatedCostRange[1] * options.skippedCount / options.specCount).toFixed(2);
    console.log(chalk.green(`\n  Resuming: ${options.skippedCount} specs already up-to-date (saved ~$${savedMin}–$${savedMax})`));
  }

  console.log('');
  return confirm({ message: 'Proceed?', default: true });
}
