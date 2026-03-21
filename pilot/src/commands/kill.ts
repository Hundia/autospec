import chalk from 'chalk';
import { findSession, updateSessionStatus } from '../session/session-manager.js';
import * as tmux from '../utils/tmux.js';

interface KillOptions {
  force?: boolean;
}

export async function runKill(nameOrId: string, opts: KillOptions): Promise<void> {
  const session = await findSession(nameOrId);

  if (!session) {
    console.log(chalk.red(`  Session not found: ${nameOrId}`));
    process.exit(1);
  }

  if (tmux.sessionExists(session.tmuxSession)) {
    tmux.destroySession(session.tmuxSession, opts.force);
  }

  await updateSessionStatus(session.id, 'killed');

  console.log(chalk.yellow(`  Session killed: ${session.name}`));
}
