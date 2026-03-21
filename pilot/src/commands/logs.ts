import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';
import { spawnSync } from 'child_process';
import { findSession } from '../session/session-manager.js';
import { PILOT_HOME } from '../utils/config.js';
import * as tmux from '../utils/tmux.js';

interface LogsOptions {
  follow?: boolean;
  tail?: number;
}

export async function runLogs(nameOrId: string, opts: LogsOptions): Promise<void> {
  const session = await findSession(nameOrId);

  if (!session) {
    console.log(chalk.red(`  Session not found: ${nameOrId}`));
    process.exit(1);
  }

  const logPath = path.join(PILOT_HOME, 'logs', `${session.name}.log`);

  // If session is still running, capture live from tmux
  if (tmux.sessionExists(session.tmuxSession) && opts.follow) {
    console.log(chalk.dim(`  Live output from ${session.name} (Ctrl-C to stop)\n`));

    // Use tail -f on the log file
    if (await fs.pathExists(logPath)) {
      spawnSync('tail', ['-f', '-n', String(opts.tail ?? 50), logPath], {
        stdio: 'inherit',
      });
    } else {
      // Fallback: capture from tmux directly
      const output = tmux.capturePaneOutput(session.tmuxSession, opts.tail ?? 50);
      console.log(output);
    }
    return;
  }

  // Static log display
  if (await fs.pathExists(logPath)) {
    const lines = opts.tail ?? 50;
    spawnSync('tail', ['-n', String(lines), logPath], { stdio: 'inherit' });
  } else {
    // Try tmux capture
    if (tmux.sessionExists(session.tmuxSession)) {
      const output = tmux.capturePaneOutput(session.tmuxSession, opts.tail ?? 50);
      console.log(output);
    } else {
      console.log(chalk.dim(`  No logs available for ${session.name}`));
    }
  }
}
