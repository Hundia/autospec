import type { ChildProcess } from 'child_process';
import { logger } from './logger.js';

let activeChildren: ChildProcess[] = [];
let cleanupCallbacks: (() => Promise<void>)[] = [];

export function registerChildProcess(child: ChildProcess): void {
  activeChildren.push(child);
}

export function unregisterChildProcess(child: ChildProcess): void {
  activeChildren = activeChildren.filter(c => c !== child);
}

export function registerCleanup(callback: () => Promise<void>): void {
  cleanupCallbacks.push(callback);
}

export function setupSignalHandlers(): void {
  const handler = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down...`);

    for (const child of activeChildren) {
      try {
        child.kill('SIGTERM');
      } catch {
        // Process may already be dead
      }
    }

    for (const cleanup of cleanupCallbacks) {
      try {
        await cleanup();
      } catch {
        // Best effort
      }
    }

    process.exit(0);
  };

  process.on('SIGINT', () => handler('SIGINT'));
  process.on('SIGTERM', () => handler('SIGTERM'));
  process.on('SIGHUP', () => handler('SIGHUP'));
}
