import chalk from 'chalk';
import { spawnSync } from 'child_process';
import { findSession } from '../session/session-manager.js';
import * as tmux from '../utils/tmux.js';

export async function runAttach(nameOrId: string): Promise<void> {
  const session = await findSession(nameOrId);

  if (!session) {
    console.log(chalk.red(`  Session not found: ${nameOrId}`));
    console.log(chalk.dim('  Run "pilot list" to see active sessions.'));
    process.exit(1);
  }

  if (!tmux.sessionExists(session.tmuxSession)) {
    console.log(chalk.red(`  tmux session "${session.tmuxSession}" no longer exists.`));
    console.log(chalk.dim(`  The session may have ended. Check: pilot logs ${session.name}`));
    process.exit(1);
  }

  console.log(chalk.dim(`  Attaching to ${session.name} (${session.tmuxSession})...`));
  console.log(chalk.dim('  Detach with: Ctrl-B then D\n'));

  spawnSync('tmux', ['attach-session', '-t', session.tmuxSession], {
    stdio: 'inherit',
  });
}
