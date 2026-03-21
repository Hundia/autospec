import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  handlePermissionPrompt,
  respondToApproval,
  setNotifyCallback,
} from '../src/daemon/approval-engine.js';
import { createMockSession, createMockApproval, createMockConfig } from './helpers/test-utils.js';

// Mock dependencies
vi.mock('../src/utils/tmux.js', () => ({
  sendRawKey: vi.fn(),
  sessionExists: vi.fn(),
}));

vi.mock('../src/session/session-manager.js', () => ({
  createApproval: vi.fn(),
  resolveApproval: vi.fn(),
  updateSessionStatus: vi.fn(),
  getApproval: vi.fn(),
  findSession: vi.fn(),
  saveSession: vi.fn(),
}));

vi.mock('../src/session/session-parser.js', () => ({
  classifyRisk: vi.fn(() => 'medium'),
}));

vi.mock('../src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import * as tmux from '../src/utils/tmux.js';
import * as sessionManager from '../src/session/session-manager.js';
import { classifyRisk } from '../src/session/session-parser.js';

describe('handlePermissionPrompt', () => {
  const session = createMockSession();
  const config = createMockConfig();
  const mockApproval = createMockApproval();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(sessionManager.createApproval).mockResolvedValue(mockApproval);
    vi.mocked(sessionManager.resolveApproval).mockResolvedValue({ ...mockApproval, status: 'approved' });
    vi.mocked(sessionManager.updateSessionStatus).mockResolvedValue(null);
    setNotifyCallback(null as never);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('auto-approves when permissionMode=dontAsk', async () => {
    const dontAskSession = createMockSession({ permissionMode: 'dontAsk' });
    const result = await handlePermissionPrompt(dontAskSession, 'Bash', 'ls', 'Allow Bash: ls (Y/n)', config as never);
    expect(vi.mocked(tmux.sendRawKey)).toHaveBeenCalledWith(dontAskSession.tmuxSession, 'Y');
    expect(vi.mocked(sessionManager.resolveApproval)).toHaveBeenCalledWith(mockApproval.id, 'Y', 'auto');
    expect(result).toBe(mockApproval);
  });

  it('auto-approves when tool matches session autoApprovePatterns', async () => {
    const sessionWithPatterns = createMockSession({ autoApprovePatterns: ['Read'] });
    await handlePermissionPrompt(sessionWithPatterns, 'Read', 'src/index.ts', 'Allow Read: src/index.ts (Y/n)', config as never);
    expect(vi.mocked(tmux.sendRawKey)).toHaveBeenCalledWith(sessionWithPatterns.tmuxSession, 'Y');
    expect(vi.mocked(sessionManager.resolveApproval)).toHaveBeenCalledWith(mockApproval.id, 'Y', 'auto');
  });

  it('auto-approves when tool matches config autoApprovePatterns (case-insensitive)', async () => {
    const cfgWithPatterns = createMockConfig({ autoApprovePatterns: ['read'] });
    await handlePermissionPrompt(session, 'Read', 'src/index.ts', 'Allow Read: src/index.ts (Y/n)', cfgWithPatterns as never);
    expect(vi.mocked(tmux.sendRawKey)).toHaveBeenCalledWith(session.tmuxSession, 'Y');
    expect(vi.mocked(sessionManager.resolveApproval)).toHaveBeenCalledWith(mockApproval.id, 'Y', 'auto');
  });

  it('auto-approves low-risk when autoApproveLowRisk=true', async () => {
    const lowRiskConfig = createMockConfig({ autoApproveLowRisk: true });
    vi.mocked(classifyRisk).mockReturnValue('low');
    await handlePermissionPrompt(session, 'Read', 'src/index.ts', 'Allow Read: src/index.ts (Y/n)', lowRiskConfig as never);
    expect(vi.mocked(tmux.sendRawKey)).toHaveBeenCalledWith(session.tmuxSession, 'Y');
  });

  it('sends Y to tmux for auto-approved', async () => {
    const autoSession = createMockSession({ permissionMode: 'dontAsk' });
    await handlePermissionPrompt(autoSession, 'Bash', 'echo hi', 'Allow Bash: echo hi (Y/n)', config as never);
    expect(vi.mocked(tmux.sendRawKey)).toHaveBeenCalledWith(autoSession.tmuxSession, 'Y');
  });

  it('creates resolved approval for auto-approved', async () => {
    const autoSession = createMockSession({ permissionMode: 'dontAsk' });
    await handlePermissionPrompt(autoSession, 'Bash', 'echo hi', 'Allow Bash: echo hi (Y/n)', config as never);
    expect(vi.mocked(sessionManager.createApproval)).toHaveBeenCalledOnce();
    expect(vi.mocked(sessionManager.resolveApproval)).toHaveBeenCalledWith(mockApproval.id, 'Y', 'auto');
  });

  it('creates pending approval for non-auto-approved', async () => {
    await handlePermissionPrompt(session, 'Bash', 'npm install express', 'Allow Bash: npm install express (Y/n)', config as never);
    expect(vi.mocked(sessionManager.createApproval)).toHaveBeenCalledOnce();
    expect(vi.mocked(sessionManager.resolveApproval)).not.toHaveBeenCalled();
  });

  it('updates session to waiting_approval', async () => {
    await handlePermissionPrompt(session, 'Bash', 'npm install express', 'Allow Bash: npm install express (Y/n)', config as never);
    expect(vi.mocked(sessionManager.updateSessionStatus)).toHaveBeenCalledWith(session.id, 'waiting_approval');
  });

  it('calls notify callback', async () => {
    const notifyFn = vi.fn().mockResolvedValue(undefined);
    setNotifyCallback(notifyFn);
    await handlePermissionPrompt(session, 'Bash', 'npm install express', 'Allow Bash: npm install express (Y/n)', config as never);
    expect(notifyFn).toHaveBeenCalledWith(mockApproval, session);
  });

  it('handles notify callback errors', async () => {
    const failingNotify = vi.fn().mockRejectedValue(new Error('WhatsApp down'));
    setNotifyCallback(failingNotify);
    // Should not throw even if notifyFn throws
    await expect(
      handlePermissionPrompt(session, 'Bash', 'npm install', 'Allow Bash: npm install (Y/n)', config as never)
    ).resolves.not.toThrow();
  });
});

describe('respondToApproval', () => {
  const mockApproval = createMockApproval({ status: 'pending' });
  const session = createMockSession();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(sessionManager.getApproval).mockResolvedValue(mockApproval);
    vi.mocked(sessionManager.findSession).mockResolvedValue(session);
    vi.mocked(tmux.sessionExists).mockReturnValue(true);
    vi.mocked(sessionManager.resolveApproval).mockResolvedValue({ ...mockApproval, status: 'approved', response: 'Y' });
    vi.mocked(sessionManager.updateSessionStatus).mockResolvedValue(null);
    vi.mocked(sessionManager.saveSession).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sends Y for approve', async () => {
    await respondToApproval(mockApproval.id, 'Y', 'whatsapp');
    expect(vi.mocked(tmux.sendRawKey)).toHaveBeenCalledWith(session.tmuxSession, 'Y');
  });

  it('sends n for deny', async () => {
    await respondToApproval(mockApproval.id, 'N', 'whatsapp');
    expect(vi.mocked(tmux.sendRawKey)).toHaveBeenCalledWith(session.tmuxSession, 'n');
  });

  it('sends A for always', async () => {
    await respondToApproval(mockApproval.id, 'A', 'whatsapp');
    expect(vi.mocked(tmux.sendRawKey)).toHaveBeenCalledWith(session.tmuxSession, 'A');
  });

  it('adds tool to autoApprovePatterns on A', async () => {
    const freshSession = createMockSession({ autoApprovePatterns: [] });
    vi.mocked(sessionManager.findSession).mockResolvedValue(freshSession);
    await respondToApproval(mockApproval.id, 'A', 'whatsapp');
    expect(vi.mocked(sessionManager.saveSession)).toHaveBeenCalledWith(
      expect.objectContaining({ autoApprovePatterns: [mockApproval.tool] })
    );
  });

  it('returns null for already-resolved', async () => {
    vi.mocked(sessionManager.getApproval).mockResolvedValue({ ...mockApproval, status: 'approved' });
    const result = await respondToApproval(mockApproval.id, 'Y', 'whatsapp');
    expect(result).toBeNull();
  });

  it('returns null when approval not found', async () => {
    vi.mocked(sessionManager.getApproval).mockResolvedValue(null);
    const result = await respondToApproval('nonexistent-id', 'Y', 'whatsapp');
    expect(result).toBeNull();
  });

  it('uses lock to prevent double-respond', async () => {
    // Simulate a slow resolveApproval so second call runs during first
    let resolveFirst: () => void;
    const firstCallPromise = new Promise<void>(resolve => { resolveFirst = resolve; });

    vi.mocked(sessionManager.resolveApproval).mockImplementationOnce(async () => {
      await firstCallPromise;
      return { ...mockApproval, status: 'approved', response: 'Y' };
    });

    const first = respondToApproval(mockApproval.id, 'Y', 'whatsapp');
    // Second call while first is in progress — lock should return null
    const second = await respondToApproval(mockApproval.id, 'Y', 'whatsapp');
    expect(second).toBeNull();

    // Unblock first
    resolveFirst!();
    await first;
  });

  it('updates session back to running', async () => {
    await respondToApproval(mockApproval.id, 'Y', 'whatsapp');
    expect(vi.mocked(sessionManager.updateSessionStatus)).toHaveBeenCalledWith(session.id, 'running');
  });
});
