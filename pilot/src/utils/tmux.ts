import { execSync, exec } from 'child_process';
import { logger } from './logger.js';

export function isTmuxInstalled(): boolean {
  try {
    execSync('which tmux', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

export function getTmuxVersion(): string | null {
  try {
    return execSync('tmux -V', { stdio: 'pipe' }).toString().trim();
  } catch {
    return null;
  }
}

export function listTmuxSessions(): string[] {
  try {
    const output = execSync('tmux list-sessions -F "#{session_name}"', { stdio: 'pipe' })
      .toString()
      .trim();
    if (!output) return [];
    return output.split('\n');
  } catch {
    return [];
  }
}

export function sessionExists(sessionName: string): boolean {
  try {
    execSync(`tmux has-session -t "${sessionName}"`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

export interface CreateSessionOptions {
  name: string;
  cwd: string;
  command?: string;
  scrollbackLimit?: number;
}

export function createSession(opts: CreateSessionOptions): void {
  const { name, cwd, scrollbackLimit = 100_000 } = opts;

  if (sessionExists(name)) {
    throw new Error(`tmux session "${name}" already exists`);
  }

  // Create detached session with scrollback
  execSync(
    `tmux new-session -d -s "${name}" -c "${cwd}" \\; set-option -t "${name}" history-limit ${scrollbackLimit}`,
    { stdio: 'pipe' }
  );

  logger.info(`Created tmux session: ${name}`, { cwd, scrollbackLimit });

  // Send command if provided
  if (opts.command) {
    sendKeys(name, opts.command);
  }
}

export function destroySession(sessionName: string, force = false): void {
  if (!sessionExists(sessionName)) {
    return;
  }

  if (force) {
    execSync(`tmux kill-session -t "${sessionName}"`, { stdio: 'pipe' });
  } else {
    // Send Ctrl-C first, then kill
    try {
      execSync(`tmux send-keys -t "${sessionName}" C-c`, { stdio: 'pipe' });
    } catch {
      // ignore
    }
    setTimeout(() => {
      try {
        execSync(`tmux kill-session -t "${sessionName}"`, { stdio: 'pipe' });
      } catch {
        // Already dead
      }
    }, 2000);
  }

  logger.info(`Destroyed tmux session: ${sessionName}`);
}

export function sendKeys(sessionName: string, keys: string): void {
  execSync(`tmux send-keys -t "${sessionName}" ${JSON.stringify(keys)} Enter`, { stdio: 'pipe' });
}

export function sendRawKey(sessionName: string, key: string): void {
  execSync(`tmux send-keys -t "${sessionName}" "${key}"`, { stdio: 'pipe' });
}

export function capturePaneOutput(sessionName: string, lines = 100): string {
  try {
    return execSync(
      `tmux capture-pane -p -t "${sessionName}" -S -${lines}`,
      { stdio: 'pipe' }
    ).toString();
  } catch {
    return '';
  }
}

export function startLogging(sessionName: string, logPath: string): void {
  execSync(
    `tmux pipe-pane -o -t "${sessionName}" "cat >> '${logPath}'"`,
    { stdio: 'pipe' }
  );
  logger.info(`Started logging for ${sessionName}`, { logPath });
}

export function stopLogging(sessionName: string): void {
  try {
    execSync(`tmux pipe-pane -t "${sessionName}"`, { stdio: 'pipe' });
  } catch {
    // ignore
  }
}

export function attachSession(sessionName: string): void {
  // This must be called from a terminal — it replaces the current process
  const { status } = require('child_process').spawnSync('tmux', ['attach-session', '-t', sessionName], {
    stdio: 'inherit',
  });
  if (status !== 0) {
    throw new Error(`Failed to attach to tmux session "${sessionName}"`);
  }
}

export function attachSessionExec(sessionName: string): void {
  // Use exec to replace current process with tmux attach
  exec(`tmux attach-session -t "${sessionName}"`, { stdio: 'inherit' } as Parameters<typeof exec>[1]);
}

export function getSessionInfo(sessionName: string): { created: string; activity: string; windows: string } | null {
  try {
    const output = execSync(
      `tmux display-message -t "${sessionName}" -p "#{session_created}|#{session_activity}|#{session_windows}"`,
      { stdio: 'pipe' }
    ).toString().trim();
    const [created, activity, windows] = output.split('|');
    return { created, activity, windows };
  } catch {
    return null;
  }
}
