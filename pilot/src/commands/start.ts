import chalk from 'chalk';
import ora from 'ora';
import { loadConfig } from '../utils/config.js';
import { launchSession } from '../session/session-launcher.js';
import * as tmux from '../utils/tmux.js';
import { spawnSync } from 'child_process';

interface StartOptions {
  name?: string;
  cwd?: string;
  autoApprove?: boolean;
  approveReads?: boolean;
  skill?: string;
  resume?: string;
  model?: string;
  attach?: boolean;
  timeout?: number;
}

export async function runStart(prompt: string, opts: StartOptions): Promise<void> {
  const config = await loadConfig();

  if (!tmux.isTmuxInstalled()) {
    console.log(chalk.red('  tmux is not installed. Run: apt-get install tmux'));
    process.exit(1);
  }

  const spinner = ora('Launching session...').start();

  try {
    const session = await launchSession({
      prompt,
      name: opts.name,
      cwd: opts.cwd,
      autoApprove: opts.autoApprove,
      approveReads: opts.approveReads,
      skill: opts.skill,
      resume: opts.resume,
      model: opts.model,
      config,
    });

    spinner.succeed(`Session started: ${chalk.bold(session.name)}`);
    console.log(chalk.dim(`  ID: ${session.id}`));
    console.log(chalk.dim(`  tmux: ${session.tmuxSession}`));
    console.log();
    console.log(`  Attach: ${chalk.cyan(`pilot attach ${session.name}`)}`);
    console.log(`  Logs:   ${chalk.cyan(`pilot logs ${session.name} -f`)}`);
    console.log(`  Kill:   ${chalk.cyan(`pilot kill ${session.name}`)}`);
    console.log();

    if (opts.attach) {
      console.log(chalk.dim('  Attaching to session...\n'));
      spawnSync('tmux', ['attach-session', '-t', session.tmuxSession], {
        stdio: 'inherit',
      });
    }
  } catch (err) {
    spinner.fail(`Failed to start session: ${(err as Error).message}`);
    process.exit(1);
  }
}
