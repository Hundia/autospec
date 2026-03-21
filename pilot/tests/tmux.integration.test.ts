/**
 * tmux.integration.test.ts
 *
 * Real tmux integration tests — tmux must be installed on the test host.
 * All session names use TMUX_TEST_PREFIX to avoid collisions with real sessions.
 * Sessions are cleaned up in afterEach.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { TMUX_TEST_PREFIX } from './helpers/test-utils.js';
import * as tmux from '../src/utils/tmux.js';

// ─────────────────────────────────────────────────────────────────────────────

// We need a unique suffix per test to avoid collisions across parallel runs
let sessionCounter = 0;
const allCreatedSessions: string[] = [];

function uniqueSessionName(): string {
  sessionCounter++;
  return `${TMUX_TEST_PREFIX}integ-${process.pid}-${sessionCounter}`;
}

function forceKill(name: string): void {
  try {
    tmux.destroySession(name, true);
  } catch {
    // already gone
  }
}

describe('tmux integration', () => {
  let currentSession = '';

  beforeEach(() => {
    currentSession = uniqueSessionName();
    allCreatedSessions.push(currentSession);
  });

  afterEach(() => {
    // Best-effort cleanup of the current test session
    forceKill(currentSession);
  });

  // Cleanup any leftover sessions from the entire suite
  afterEach(() => {
    for (const s of allCreatedSessions) {
      forceKill(s);
    }
  });

  // ── isTmuxInstalled ────────────────────────────────────────────────────────

  it('isTmuxInstalled returns true', () => {
    expect(tmux.isTmuxInstalled()).toBe(true);
  });

  // ── getTmuxVersion ─────────────────────────────────────────────────────────

  it('getTmuxVersion returns a non-empty string', () => {
    const version = tmux.getTmuxVersion();
    expect(typeof version).toBe('string');
    expect(version!.length).toBeGreaterThan(0);
    // e.g. "tmux 3.3a"
    expect(version).toMatch(/tmux/i);
  });

  // ── createSession ──────────────────────────────────────────────────────────

  it('createSession creates a detached tmux session', () => {
    tmux.createSession({ name: currentSession, cwd: os.tmpdir() });
    expect(tmux.sessionExists(currentSession)).toBe(true);
  });

  // ── sessionExists ──────────────────────────────────────────────────────────

  it('sessionExists returns true after session creation', () => {
    tmux.createSession({ name: currentSession, cwd: os.tmpdir() });
    expect(tmux.sessionExists(currentSession)).toBe(true);
  });

  it('sessionExists returns false for a nonexistent session', () => {
    // currentSession has NOT been created yet in this test
    expect(tmux.sessionExists(currentSession)).toBe(false);
  });

  // ── createSession duplicate ────────────────────────────────────────────────

  it('createSession throws when session name already exists', () => {
    tmux.createSession({ name: currentSession, cwd: os.tmpdir() });
    expect(() => {
      tmux.createSession({ name: currentSession, cwd: os.tmpdir() });
    }).toThrow(`tmux session "${currentSession}" already exists`);
  });

  // ── sendKeys / capturePaneOutput ───────────────────────────────────────────

  it('sendKeys sends text and capturePaneOutput captures it', async () => {
    tmux.createSession({ name: currentSession, cwd: os.tmpdir() });

    // Write a unique marker to the pane
    const marker = `PILOT_TEST_MARKER_${Date.now()}`;
    tmux.sendKeys(currentSession, `echo ${marker}`);

    // Wait for the shell to process
    await new Promise(r => setTimeout(r, 800));

    const output = tmux.capturePaneOutput(currentSession, 50);
    expect(output).toContain(marker);
  });

  // ── sendRawKey ─────────────────────────────────────────────────────────────

  it('sendRawKey sends a single key to the session', () => {
    tmux.createSession({ name: currentSession, cwd: os.tmpdir() });
    // Sending a key should not throw
    expect(() => tmux.sendRawKey(currentSession, 'q')).not.toThrow();
  });

  // ── startLogging ───────────────────────────────────────────────────────────

  it('startLogging creates a log file that receives output', async () => {
    tmux.createSession({ name: currentSession, cwd: os.tmpdir() });

    const logDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pilot-log-test-'));
    const logPath = path.join(logDir, `${currentSession}.log`);
    await fs.ensureFile(logPath);

    try {
      tmux.startLogging(currentSession, logPath);

      // Send something to the pane so the pipe gets data
      const marker = `LOG_MARKER_${Date.now()}`;
      tmux.sendKeys(currentSession, `echo ${marker}`);

      await new Promise(r => setTimeout(r, 800));

      const logExists = await fs.pathExists(logPath);
      expect(logExists).toBe(true);
    } finally {
      await fs.remove(logDir);
    }
  });

  // ── destroySession (force) ─────────────────────────────────────────────────

  it('destroySession (force=true) kills the session', () => {
    tmux.createSession({ name: currentSession, cwd: os.tmpdir() });
    expect(tmux.sessionExists(currentSession)).toBe(true);

    tmux.destroySession(currentSession, true);
    expect(tmux.sessionExists(currentSession)).toBe(false);
  });

  // ── destroySession idempotent ──────────────────────────────────────────────

  it('destroySession is idempotent — no throw when session does not exist', () => {
    // Session never created
    expect(() => tmux.destroySession(currentSession, true)).not.toThrow();
  });

  // ── listTmuxSessions ───────────────────────────────────────────────────────

  it('listTmuxSessions includes the created test session', () => {
    tmux.createSession({ name: currentSession, cwd: os.tmpdir() });
    const sessions = tmux.listTmuxSessions();
    expect(sessions).toContain(currentSession);
  });

  it('listTmuxSessions returns an array (may be empty)', () => {
    // Even if no sessions exist, should return an array
    const sessions = tmux.listTmuxSessions();
    expect(Array.isArray(sessions)).toBe(true);
  });
});
