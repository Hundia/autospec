import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { startMonitoring, stopMonitoring } from '../src/session/session-monitor.js';
import { createMockSession, createMockApproval, createMockConfig } from './helpers/test-utils.js';

// Mock dependencies before importing module
vi.mock('../src/utils/tmux.js', () => ({
  sessionExists: vi.fn(),
  capturePaneOutput: vi.fn(),
  sendRawKey: vi.fn(),
}));

vi.mock('./session-manager.js', () => ({
  listSessions: vi.fn(),
  updateSessionStatus: vi.fn(),
  createApproval: vi.fn(),
  resolveApproval: vi.fn(),
  getApproval: vi.fn(),
}));

vi.mock('./session-parser.js', () => ({
  parseOutput: vi.fn(),
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
// The monitor imports from relative paths — we need to mock those module paths as well
// because session-monitor.ts imports './session-manager.js' and './session-parser.js'
vi.mock('../src/session/session-manager.js', () => ({
  listSessions: vi.fn(),
  updateSessionStatus: vi.fn(),
  createApproval: vi.fn(),
  resolveApproval: vi.fn(),
  getApproval: vi.fn(),
}));

vi.mock('../src/session/session-parser.js', () => ({
  parseOutput: vi.fn(),
  classifyRisk: vi.fn(() => 'medium'),
}));

import * as sessionManager from '../src/session/session-manager.js';
import { parseOutput } from '../src/session/session-parser.js';

describe('session-monitor', () => {
  const session = createMockSession({ status: 'running' });
  const config = createMockConfig();
  let onApprovalNeeded: ReturnType<typeof vi.fn>;
  let onSessionEvent: ReturnType<typeof vi.fn>;
  let opts: Parameters<typeof startMonitoring>[0];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    onApprovalNeeded = vi.fn().mockResolvedValue(undefined);
    onSessionEvent = vi.fn().mockResolvedValue(undefined);
    opts = {
      config: config as never,
      onApprovalNeeded,
      onSessionEvent,
    };

    vi.mocked(sessionManager.listSessions).mockResolvedValue([session]);
    vi.mocked(tmux.sessionExists).mockReturnValue(true);
    vi.mocked(tmux.capturePaneOutput).mockReturnValue('doing stuff\n');
    vi.mocked(parseOutput).mockReturnValue({ type: 'running', lastLine: 'doing stuff' });
    vi.mocked(sessionManager.updateSessionStatus).mockResolvedValue(null);
    vi.mocked(sessionManager.createApproval).mockResolvedValue(createMockApproval());
    vi.mocked(sessionManager.resolveApproval).mockResolvedValue(null);
    vi.mocked(sessionManager.getApproval).mockResolvedValue(createMockApproval({ status: 'pending' }));

    // Ensure stopped before each test
    stopMonitoring();
  });

  afterEach(() => {
    stopMonitoring();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('startMonitoring begins polling', async () => {
    startMonitoring(opts);
    await vi.advanceTimersByTimeAsync(config.tui.refreshIntervalMs + 100);
    expect(vi.mocked(sessionManager.listSessions)).toHaveBeenCalled();
  });

  it('does not start twice', async () => {
    startMonitoring(opts);
    startMonitoring(opts); // second call should be ignored
    await vi.advanceTimersByTimeAsync(config.tui.refreshIntervalMs + 100);
    // listSessions should only be called once (not twice per interval)
    expect(vi.mocked(sessionManager.listSessions)).toHaveBeenCalledTimes(1);
  });

  it('stopMonitoring clears interval', async () => {
    startMonitoring(opts);
    await vi.advanceTimersByTimeAsync(config.tui.refreshIntervalMs + 100);
    const callCount = vi.mocked(sessionManager.listSessions).mock.calls.length;
    stopMonitoring();
    await vi.advanceTimersByTimeAsync(config.tui.refreshIntervalMs * 3);
    // No more calls after stop
    expect(vi.mocked(sessionManager.listSessions).mock.calls.length).toBe(callCount);
  });

  it('marks session completed when tmux gone', async () => {
    vi.mocked(tmux.sessionExists).mockReturnValue(false);
    startMonitoring(opts);
    await vi.advanceTimersByTimeAsync(config.tui.refreshIntervalMs + 100);
    expect(vi.mocked(sessionManager.updateSessionStatus)).toHaveBeenCalledWith(session.id, 'completed');
  });

  it('fires onSessionEvent callback when tmux gone', async () => {
    vi.mocked(tmux.sessionExists).mockReturnValue(false);
    startMonitoring(opts);
    await vi.advanceTimersByTimeAsync(config.tui.refreshIntervalMs + 100);
    expect(onSessionEvent).toHaveBeenCalledWith('completed', session);
  });

  it('detects permission_prompt from output', async () => {
    const approval = createMockApproval();
    vi.mocked(parseOutput).mockReturnValue({
      type: 'permission_prompt',
      permission: {
        tool: 'Bash',
        description: 'npm install',
        fullPrompt: 'Allow Bash: npm install (Y/n)',
      },
    });
    vi.mocked(sessionManager.createApproval).mockResolvedValue(approval);

    startMonitoring(opts);
    await vi.advanceTimersByTimeAsync(config.tui.refreshIntervalMs + 100);

    expect(vi.mocked(sessionManager.createApproval)).toHaveBeenCalled();
  });

  it('deduplicates identical prompts', async () => {
    const approval = createMockApproval();
    vi.mocked(parseOutput).mockReturnValue({
      type: 'permission_prompt',
      permission: {
        tool: 'Bash',
        description: 'npm install',
        fullPrompt: 'Allow Bash: npm install (Y/n)',
      },
    });
    vi.mocked(sessionManager.createApproval).mockResolvedValue(approval);

    startMonitoring(opts);
    // Advance two full intervals — same prompt should not fire twice
    await vi.advanceTimersByTimeAsync(config.tui.refreshIntervalMs + 100);
    await vi.advanceTimersByTimeAsync(config.tui.refreshIntervalMs + 100);

    // createApproval should only be called once despite two poll cycles
    expect(vi.mocked(sessionManager.createApproval)).toHaveBeenCalledTimes(1);
  });

  it('processes new prompt after first (different fullPrompt)', async () => {
    const approval = createMockApproval();
    vi.mocked(sessionManager.createApproval).mockResolvedValue(approval);

    vi.mocked(parseOutput)
      .mockReturnValueOnce({
        type: 'permission_prompt',
        permission: { tool: 'Bash', description: 'npm install', fullPrompt: 'prompt-1' },
      })
      .mockReturnValueOnce({
        type: 'permission_prompt',
        permission: { tool: 'Write', description: 'new-file.ts', fullPrompt: 'prompt-2' },
      });

    startMonitoring(opts);
    await vi.advanceTimersByTimeAsync(config.tui.refreshIntervalMs + 100);
    await vi.advanceTimersByTimeAsync(config.tui.refreshIntervalMs + 100);

    expect(vi.mocked(sessionManager.createApproval)).toHaveBeenCalledTimes(2);
  });

  it('calls onApprovalNeeded for non-auto-approved', async () => {
    const approval = createMockApproval();
    vi.mocked(parseOutput).mockReturnValue({
      type: 'permission_prompt',
      permission: {
        tool: 'Bash',
        description: 'npm install',
        fullPrompt: 'Allow Bash: npm install (Y/n)',
      },
    });
    vi.mocked(sessionManager.createApproval).mockResolvedValue(approval);

    startMonitoring(opts);
    await vi.advanceTimersByTimeAsync(config.tui.refreshIntervalMs + 100);

    expect(onApprovalNeeded).toHaveBeenCalledWith(approval, session);
  });

  it('updates lastOutput on running state', async () => {
    const freshSession = createMockSession({ status: 'running', lastOutput: 'old output' });
    vi.mocked(sessionManager.listSessions).mockResolvedValue([freshSession]);
    vi.mocked(parseOutput).mockReturnValue({ type: 'running', lastLine: 'new output line' });

    startMonitoring(opts);
    await vi.advanceTimersByTimeAsync(config.tui.refreshIntervalMs + 100);

    expect(vi.mocked(sessionManager.updateSessionStatus)).toHaveBeenCalledWith(
      freshSession.id,
      'running',
      expect.objectContaining({ lastOutput: 'new output line' })
    );
  });

  it('skips sessions not in running/waiting_approval', async () => {
    const completedSession = createMockSession({ status: 'completed' });
    vi.mocked(sessionManager.listSessions).mockResolvedValue([completedSession]);

    startMonitoring(opts);
    await vi.advanceTimersByTimeAsync(config.tui.refreshIntervalMs + 100);

    // Should not check tmux for completed sessions
    expect(vi.mocked(tmux.sessionExists)).not.toHaveBeenCalled();
  });
});
