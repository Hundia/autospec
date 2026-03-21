import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { PILOT_HOME } from '../utils/config.js';

const PID_FILE = path.join(PILOT_HOME, 'daemon.pid');

export async function runDaemon(action: string): Promise<void> {
  switch (action) {
    case 'start': {
      const { startDaemon } = await import('../daemon/daemon-server.js');
      await startDaemon(true); // foreground mode from CLI
      // Keep process alive
      await new Promise(() => {}); // Never resolves — daemon runs until killed
      break;
    }

    case 'stop':
      if (await fs.pathExists(PID_FILE)) {
        const pid = parseInt(await fs.readFile(PID_FILE, 'utf-8'));
        try {
          process.kill(pid, 'SIGTERM');
          await fs.remove(PID_FILE);
          console.log(chalk.green(`  Daemon stopped (PID ${pid}).`));
        } catch {
          await fs.remove(PID_FILE);
          console.log(chalk.yellow('  Daemon was not running. Cleaned up PID file.'));
        }
      } else {
        console.log(chalk.dim('  Daemon is not running.'));
      }
      break;

    case 'status':
      if (await fs.pathExists(PID_FILE)) {
        const pid = parseInt(await fs.readFile(PID_FILE, 'utf-8'));
        try {
          process.kill(pid, 0); // Check if alive
          console.log(chalk.green(`  Daemon running (PID ${pid}).`));
        } catch {
          await fs.remove(PID_FILE);
          console.log(chalk.dim('  Daemon is not running (stale PID file cleaned).'));
        }
      } else {
        console.log(chalk.dim('  Daemon is not running.'));
      }
      break;

    case 'logs':
      const logPath = path.join(PILOT_HOME, 'logs', 'daemon.log');
      if (await fs.pathExists(logPath)) {
        const { spawnSync } = await import('child_process');
        spawnSync('tail', ['-f', '-n', '50', logPath], { stdio: 'inherit' });
      } else {
        console.log(chalk.dim('  No daemon logs found.'));
      }
      break;

    default:
      console.log(chalk.red(`  Unknown daemon action: ${action}`));
      console.log(chalk.dim('  Usage: pilot daemon start|stop|status|logs'));
  }
}
