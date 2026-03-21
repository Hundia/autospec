/**
 * session-manager.test.ts
 *
 * Tests for createSession, saveSession, getSession, getSessionByName,
 * findSession, listSessions, updateSessionStatus, deleteSession,
 * createApproval, getApproval, listPendingApprovals, resolveApproval.
 *
 * Strategy: vi.hoisted captures a mutable ref BEFORE hoisting, so the getter
 * in vi.mock can safely close over it.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createTempPilotHome } from './helpers/test-utils.js';

// ── Hoisted mutable ref ──────────────────────────────────────────────────────
// vi.hoisted runs before vi.mock factories, so `tempHome` is initialized
// before the config getter is ever called.
const tempHome = vi.hoisted(() => ({ dir: '' }));

vi.mock('../src/utils/config.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/utils/config.js')>();
  return {
    ...actual,
    get PILOT_HOME() { return tempHome.dir; },
  };
});

vi.mock('../src/utils/logger.js', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

// Import session-manager AFTER mocks are declared.
import * as sm from '../src/session/session-manager.js';

// ─────────────────────────────────────────────────────────────────────────────

describe('session-manager', () => {
  let cleanup: (() => Promise<void>) | undefined;

  beforeEach(async () => {
    const tmp = await createTempPilotHome();
    tempHome.dir = tmp.dir;
    cleanup = tmp.cleanup;
  });

  afterEach(async () => {
    await cleanup?.();
    tempHome.dir = '';
  });

  // ── createSession ──────────────────────────────────────────────────────────

  it('createSession returns a proper PilotSession', async () => {
    const session = await sm.createSession({
      name: 'my-session',
      prompt: 'do something',
      cwd: '/tmp/work',
      tmuxSession: 'pilot-my-session',
    });

    expect(session.name).toBe('my-session');
    expect(session.prompt).toBe('do something');
    expect(session.cwd).toBe('/tmp/work');
    expect(session.tmuxSession).toBe('pilot-my-session');
    expect(session.status).toBe('launching');
    expect(session.permissionMode).toBe('default');
    expect(session.autoApprovePatterns).toEqual([]);
    expect(typeof session.id).toBe('string');
    expect(session.id.length).toBeGreaterThan(0);
    expect(session.createdAt).toBeGreaterThan(0);
    expect(session.toolCallCount).toBe(0);
    expect(session.approvalCount).toBe(0);
    expect(session.errorCount).toBe(0);
  });

  it('createSession stores permissionMode and autoApprovePatterns', async () => {
    const session = await sm.createSession({
      name: 's',
      prompt: 'p',
      cwd: '/tmp',
      tmuxSession: 't',
      permissionMode: 'dontAsk',
      autoApprovePatterns: ['Read', 'Glob'],
    });

    expect(session.permissionMode).toBe('dontAsk');
    expect(session.autoApprovePatterns).toEqual(['Read', 'Glob']);
  });

  // ── saveSession / getSession roundtrip ────────────────────────────────────

  it('saveSession then getSession returns the same data', async () => {
    const session = await sm.createSession({
      name: 'roundtrip',
      prompt: 'x',
      cwd: '/tmp',
      tmuxSession: 't',
    });

    session.lastOutput = 'hello world';
    await sm.saveSession(session);

    const loaded = await sm.getSession(session.id);
    expect(loaded).not.toBeNull();
    expect(loaded!.lastOutput).toBe('hello world');
    expect(loaded!.id).toBe(session.id);
    expect(loaded!.name).toBe('roundtrip');
  });

  // ── getSession — missing ──────────────────────────────────────────────────

  it('getSession returns null for a non-existent id', async () => {
    const result = await sm.getSession('nonexistent-id-xyz');
    expect(result).toBeNull();
  });

  // ── getSessionByName ──────────────────────────────────────────────────────

  it('getSessionByName finds session by name', async () => {
    const session = await sm.createSession({
      name: 'named-session',
      prompt: 'p',
      cwd: '/tmp',
      tmuxSession: 't',
    });

    const found = await sm.getSessionByName('named-session');
    expect(found).not.toBeNull();
    expect(found!.id).toBe(session.id);
  });

  it('getSessionByName returns null for unknown name', async () => {
    const result = await sm.getSessionByName('no-such-session');
    expect(result).toBeNull();
  });

  // ── findSession ───────────────────────────────────────────────────────────

  it('findSession resolves by id', async () => {
    const session = await sm.createSession({
      name: 'find-by-id',
      prompt: 'p',
      cwd: '/tmp',
      tmuxSession: 't',
    });

    const found = await sm.findSession(session.id);
    expect(found).not.toBeNull();
    expect(found!.id).toBe(session.id);
  });

  it('findSession falls back to name lookup', async () => {
    const session = await sm.createSession({
      name: 'find-by-name',
      prompt: 'p',
      cwd: '/tmp',
      tmuxSession: 't',
    });

    // pass the name, not the id
    const found = await sm.findSession('find-by-name');
    expect(found).not.toBeNull();
    expect(found!.id).toBe(session.id);
  });

  // ── listSessions ──────────────────────────────────────────────────────────

  it('listSessions excludes completed/killed/error by default', async () => {
    const running = await sm.createSession({ name: 'r', prompt: 'p', cwd: '/tmp', tmuxSession: 't' });
    const done = await sm.createSession({ name: 'd', prompt: 'p', cwd: '/tmp', tmuxSession: 't2' });
    await sm.updateSessionStatus(done.id, 'completed');

    const active = await sm.listSessions();
    const ids = active.map(s => s.id);
    expect(ids).toContain(running.id);
    expect(ids).not.toContain(done.id);
  });

  it('listSessions includes completed when includeCompleted=true', async () => {
    const s = await sm.createSession({ name: 's', prompt: 'p', cwd: '/tmp', tmuxSession: 't' });
    await sm.updateSessionStatus(s.id, 'completed');

    const all = await sm.listSessions(true);
    const ids = all.map(x => x.id);
    expect(ids).toContain(s.id);
  });

  it('listSessions sorts by createdAt descending', async () => {
    const a = await sm.createSession({ name: 'a', prompt: 'p', cwd: '/tmp', tmuxSession: 'ta' });
    // small delay to ensure different createdAt
    await new Promise(r => setTimeout(r, 5));
    const b = await sm.createSession({ name: 'b', prompt: 'p', cwd: '/tmp', tmuxSession: 'tb' });

    const sessions = await sm.listSessions();
    const ids = sessions.map(s => s.id);
    expect(ids.indexOf(b.id)).toBeLessThan(ids.indexOf(a.id));
  });

  // ── updateSessionStatus ───────────────────────────────────────────────────

  it('updateSessionStatus changes status and updates lastActivityAt', async () => {
    const session = await sm.createSession({ name: 's', prompt: 'p', cwd: '/tmp', tmuxSession: 't' });
    const before = session.lastActivityAt;

    await new Promise(r => setTimeout(r, 5));
    const updated = await sm.updateSessionStatus(session.id, 'running');

    expect(updated).not.toBeNull();
    expect(updated!.status).toBe('running');
    expect(updated!.lastActivityAt).toBeGreaterThanOrEqual(before);
  });

  it('updateSessionStatus sets startedAt when transitioning to running', async () => {
    const session = await sm.createSession({ name: 's', prompt: 'p', cwd: '/tmp', tmuxSession: 't' });
    expect(session.startedAt).toBeUndefined();

    const updated = await sm.updateSessionStatus(session.id, 'running');
    expect(updated!.startedAt).toBeGreaterThan(0);
  });

  it('updateSessionStatus sets completedAt for terminal states', async () => {
    const session = await sm.createSession({ name: 's', prompt: 'p', cwd: '/tmp', tmuxSession: 't' });

    const updated = await sm.updateSessionStatus(session.id, 'completed');
    expect(updated!.completedAt).toBeGreaterThan(0);
  });

  it('updateSessionStatus returns null for missing session', async () => {
    const result = await sm.updateSessionStatus('no-such-id', 'running');
    expect(result).toBeNull();
  });

  // ── deleteSession ─────────────────────────────────────────────────────────

  it('deleteSession removes the session file', async () => {
    const session = await sm.createSession({ name: 's', prompt: 'p', cwd: '/tmp', tmuxSession: 't' });

    // Verify it exists
    expect(await sm.getSession(session.id)).not.toBeNull();

    await sm.deleteSession(session.id);
    expect(await sm.getSession(session.id)).toBeNull();
  });

  // ── createApproval ────────────────────────────────────────────────────────

  it('createApproval returns an ApprovalRequest with apr- prefix id', async () => {
    const approval = await sm.createApproval({
      sessionId: 'sid123',
      sessionName: 'my-session',
      tool: 'Bash',
      description: 'npm install',
      fullPrompt: 'Allow Bash: npm install (Y/n)',
      riskLevel: 'medium',
      timeoutMs: 300_000,
    });

    expect(approval.id).toMatch(/^apr-/);
    expect(approval.sessionId).toBe('sid123');
    expect(approval.sessionName).toBe('my-session');
    expect(approval.tool).toBe('Bash');
    expect(approval.status).toBe('pending');
    expect(approval.riskLevel).toBe('medium');
    expect(approval.timeoutAt).toBeGreaterThan(approval.createdAt);
  });

  // ── getApproval ───────────────────────────────────────────────────────────

  it('getApproval retrieves a stored approval by id', async () => {
    const approval = await sm.createApproval({
      sessionId: 'sid',
      sessionName: 'sn',
      tool: 'Read',
      description: 'read file',
      fullPrompt: 'Allow Read: file (Y/n)',
      riskLevel: 'low',
      timeoutMs: 60_000,
    });

    const loaded = await sm.getApproval(approval.id);
    expect(loaded).not.toBeNull();
    expect(loaded!.id).toBe(approval.id);
    expect(loaded!.tool).toBe('Read');
  });

  it('getApproval returns null for unknown id', async () => {
    const result = await sm.getApproval('apr-doesnotexist');
    expect(result).toBeNull();
  });

  // ── listPendingApprovals ──────────────────────────────────────────────────

  it('listPendingApprovals returns only pending approvals', async () => {
    const pending = await sm.createApproval({
      sessionId: 'sid',
      sessionName: 'sn',
      tool: 'Bash',
      description: 'cmd',
      fullPrompt: 'p',
      riskLevel: 'high',
      timeoutMs: 60_000,
    });

    const resolved = await sm.createApproval({
      sessionId: 'sid',
      sessionName: 'sn',
      tool: 'Read',
      description: 'r',
      fullPrompt: 'p',
      riskLevel: 'low',
      timeoutMs: 60_000,
    });
    await sm.resolveApproval(resolved.id, 'Y', 'cli');

    const list = await sm.listPendingApprovals();
    const ids = list.map(a => a.id);
    expect(ids).toContain(pending.id);
    expect(ids).not.toContain(resolved.id);
  });

  // ── resolveApproval ───────────────────────────────────────────────────────

  it('resolveApproval with Y sets status to approved', async () => {
    const approval = await sm.createApproval({
      sessionId: 'sid',
      sessionName: 'sn',
      tool: 'Bash',
      description: 'd',
      fullPrompt: 'p',
      riskLevel: 'medium',
      timeoutMs: 60_000,
    });

    const resolved = await sm.resolveApproval(approval.id, 'Y', 'tui');
    expect(resolved).not.toBeNull();
    expect(resolved!.status).toBe('approved');
    expect(resolved!.response).toBe('Y');
    expect(resolved!.resolvedBy).toBe('tui');
    expect(resolved!.resolvedAt).toBeGreaterThan(0);
  });

  it('resolveApproval with N sets status to denied', async () => {
    const approval = await sm.createApproval({
      sessionId: 'sid',
      sessionName: 'sn',
      tool: 'Bash',
      description: 'd',
      fullPrompt: 'p',
      riskLevel: 'high',
      timeoutMs: 60_000,
    });

    const resolved = await sm.resolveApproval(approval.id, 'N', 'whatsapp');
    expect(resolved!.status).toBe('denied');
    expect(resolved!.response).toBe('N');
  });

  it('resolveApproval returns null for already-resolved approval', async () => {
    const approval = await sm.createApproval({
      sessionId: 'sid',
      sessionName: 'sn',
      tool: 'Bash',
      description: 'd',
      fullPrompt: 'p',
      riskLevel: 'low',
      timeoutMs: 60_000,
    });

    await sm.resolveApproval(approval.id, 'Y', 'cli');
    // Second resolve on same approval should return null
    const second = await sm.resolveApproval(approval.id, 'N', 'tui');
    expect(second).toBeNull();
  });
});
