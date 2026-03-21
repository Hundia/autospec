/**
 * logger.test.ts
 *
 * Tests for the logger utility: level filtering, format, file writing,
 * setLogLevel, setLogFile.
 *
 * The logger uses PILOT_HOME from config.ts for the log file path.
 * We mock config.ts using vi.hoisted so the getter works correctly.
 *
 * Logger keeps module-level mutable state (currentLevel, logFilePath).
 * We reset state before each test via setLogLevel/setLogFile.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';

// ── Hoisted mutable ref ──────────────────────────────────────────────────────
const tempHome = vi.hoisted(() => ({ dir: '' }));

vi.mock('../src/utils/config.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/utils/config.js')>();
  return {
    ...actual,
    get PILOT_HOME() { return tempHome.dir; },
  };
});

import { logger, setLogLevel, setLogFile } from '../src/utils/logger.js';

// ─────────────────────────────────────────────────────────────────────────────

describe('logger', () => {
  let logDir: string;
  let logFile: string;

  beforeEach(async () => {
    // Create fresh temp directory for each test
    logDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pilot-logger-test-'));
    tempHome.dir = logDir;
    await fs.ensureDir(path.join(logDir, 'logs'));
    logFile = path.join(logDir, 'logs', 'test.log');

    // Reset logger state to known defaults
    setLogLevel('info');
    // Point log file to our temp dir (setLogFile joins PILOT_HOME/logs/<filename>)
    setLogFile('test.log');
  });

  afterEach(async () => {
    // Reset to info — avoid polluting other tests
    setLogLevel('info');
    await fs.remove(logDir);
  });

  // ── level filtering ────────────────────────────────────────────────────────

  it('writes info messages when level=info', async () => {
    logger.info('hello from info');
    const content = await fs.readFile(logFile, 'utf-8');
    expect(content).toContain('hello from info');
  });

  it('suppresses debug messages when level=info', async () => {
    logger.debug('this should be suppressed');
    const exists = await fs.pathExists(logFile);
    if (exists) {
      const content = await fs.readFile(logFile, 'utf-8');
      expect(content).not.toContain('this should be suppressed');
    }
    // If file doesn't exist at all, debug was correctly suppressed
  });

  it('writes debug when level=debug', async () => {
    setLogLevel('debug');
    logger.debug('debug message visible');
    const content = await fs.readFile(logFile, 'utf-8');
    expect(content).toContain('debug message visible');
  });

  it('writes warn messages when level=info', async () => {
    logger.warn('a warning');
    const content = await fs.readFile(logFile, 'utf-8');
    expect(content).toContain('a warning');
  });

  it('writes error messages when level=info', async () => {
    logger.error('an error occurred');
    const content = await fs.readFile(logFile, 'utf-8');
    expect(content).toContain('an error occurred');
  });

  it('writes all levels when level=debug', async () => {
    setLogLevel('debug');
    logger.debug('dbg');
    logger.info('inf');
    logger.warn('wrn');
    logger.error('err');

    const content = await fs.readFile(logFile, 'utf-8');
    expect(content).toContain('dbg');
    expect(content).toContain('inf');
    expect(content).toContain('wrn');
    expect(content).toContain('err');
  });

  // ── format ─────────────────────────────────────────────────────────────────

  it('format includes ISO timestamp', async () => {
    logger.info('timestamp test');
    const content = await fs.readFile(logFile, 'utf-8');
    // ISO 8601 format like [2026-03-21T...]
    expect(content).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it('format includes the log level in uppercase', async () => {
    logger.info('level label test');
    const content2a = await fs.readFile(logFile, 'utf-8');
    expect(content2a).toContain('[INFO');

    logger.warn('warn level label');
    const content2b = await fs.readFile(logFile, 'utf-8');
    expect(content2b).toContain('[WARN');
  });

  it('includes meta as JSON in the log line', async () => {
    logger.info('with meta', { key: 'value', count: 42 });
    const content = await fs.readFile(logFile, 'utf-8');
    expect(content).toContain('"key":"value"');
    expect(content).toContain('"count":42');
  });

  // ── setLogFile ─────────────────────────────────────────────────────────────

  it('setLogFile writes to the specified file', async () => {
    const customLog = path.join(logDir, 'logs', 'custom.log');
    setLogFile('custom.log');
    logger.info('custom log message');

    const content = await fs.readFile(customLog, 'utf-8');
    expect(content).toContain('custom log message');
  });

  // ── setLogLevel ────────────────────────────────────────────────────────────

  it('setLogLevel changes filtering — debug suppressed at info, visible at debug', async () => {
    // Start at info — debug suppressed
    setLogLevel('info');
    logger.debug('should not appear');

    // Switch to debug — should now appear
    setLogLevel('debug');
    logger.debug('should appear');

    const content = await fs.readFile(logFile, 'utf-8');
    expect(content).not.toContain('should not appear');
    expect(content).toContain('should appear');
  });

  it('setLogLevel to error suppresses info and warn', async () => {
    setLogLevel('error');
    logger.info('suppressed info');
    logger.warn('suppressed warn');
    logger.error('visible error');

    const content = await fs.readFile(logFile, 'utf-8');
    expect(content).not.toContain('suppressed info');
    expect(content).not.toContain('suppressed warn');
    expect(content).toContain('visible error');
  });
});
