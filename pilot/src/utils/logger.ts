import fs from 'fs-extra';
import path from 'path';
import { PILOT_HOME } from './config.js';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

let currentLevel: LogLevel = 'info';
let logFilePath: string | null = null;

export function setLogLevel(level: LogLevel): void {
  currentLevel = level;
}

export function setLogFile(filename: string): void {
  logFilePath = path.join(PILOT_HOME, 'logs', filename);
  fs.ensureDirSync(path.dirname(logFilePath));
}

function formatMessage(level: LogLevel, message: string, meta?: Record<string, unknown>): string {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase().padEnd(5)}] ${message}${metaStr}`;
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[currentLevel];
}

function writeLog(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
  if (!shouldLog(level)) return;

  const formatted = formatMessage(level, message, meta);

  if (logFilePath) {
    try {
      fs.appendFileSync(logFilePath, formatted + '\n');
    } catch {
      // Best effort
    }
  }
}

export const logger = {
  debug(message: string, meta?: Record<string, unknown>): void {
    writeLog('debug', message, meta);
  },

  info(message: string, meta?: Record<string, unknown>): void {
    writeLog('info', message, meta);
  },

  warn(message: string, meta?: Record<string, unknown>): void {
    writeLog('warn', message, meta);
  },

  error(message: string, meta?: Record<string, unknown>): void {
    writeLog('error', message, meta);
  },
};
