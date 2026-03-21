import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'path';
import { createTempPilotHome, UUID_REGEX, TMUX_TEST_PREFIX, createMockConfig } from './helpers/test-utils.js';

// Mock all dependencies with inline factories (no hoisted refs needed)
let _pilotHome = '';

vi.mock('../src/utils/config.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/utils/config.js')>();
  return {
    ...actual,
    get PILOT_HOME() { return _pilotHome; },
  };
});

vi.mock('../src/utils/logger.js', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('../src/utils/tmux.js', () => ({
  createSession: vi.fn(),
  sendKeys: vi.fn(),
  startLogging: vi.fn(),
  sessionExists: vi.fn().mockReturnValue(false),
  destroySession: vi.fn(),
}));

vi.mock('../src/session/session-manager.js', () => ({
  createSession: vi.fn(),
  saveSession: vi.fn(),
  updateSessionStatus: vi.fn(),
}));

vi.mock('../src/providers/resolver.js', () => ({
  resolveProvider: vi.fn(),
}));

// Import AFTER mocks
import { launchSession } from '../src/session/session-launcher.js';
import * as tmux from '../src/utils/tmux.js';
import * as sm from '../src/session/session-manager.js';
import { resolveProvider } from '../src/providers/resolver.js';

const baseConfig = createMockConfig({ tmuxSessionPrefix: TMUX_TEST_PREFIX });

describe('session-launcher', () => {
  let cleanup: (() => Promise<void>) | undefined;
  const mockBuildCommand = vi.fn();

  function makeFakeSession(name = 'test-name') {
    return {
      id: 'fakeid12',
      name,
      prompt: 'do work',
      cwd: '/tmp',
      tmuxSession: `${TMUX_TEST_PREFIX}${name}`,
      status: 'launching' as const,
      permissionMode: 'default' as const,
      autoApprovePatterns: [] as string[],
      createdAt: Date.now(),
      lastActivityAt: Date.now(),
      toolCallCount: 0,
      approvalCount: 0,
      errorCount: 0,
      lastOutput: '',
    };
  }

  beforeEach(async () => {
    const tmp = await createTempPilotHome();
    _pilotHome = tmp.dir;
    cleanup = tmp.cleanup;
    vi.clearAllMocks();

    mockBuildCommand.mockImplementation((opts: { prompt: string; sessionId: string; name: string; autoApprove?: boolean; skill?: string }) => {
      const args = ['claude', '--session-id', opts.sessionId, '--name', opts.name];
      if (opts.autoApprove) args.push('--dangerously-skip-permissions');
      if (opts.skill) {
        args.push('-p', `/${opts.skill} ${opts.prompt}`);
      } else {
        args.push('-p', opts.prompt);
      }
      return args;
    });

    const mockProvider = {
      name: 'claude',
      displayName: 'Claude Code',
      isAvailable: vi.fn().mockResolvedValue(true),
      buildCommand: mockBuildCommand,
      installInstructions: vi.fn().mockReturnValue(''),
    };

    vi.mocked(resolveProvider).mockResolvedValue(mockProvider);
    vi.mocked(sm.createSession).mockResolvedValue(makeFakeSession());
    vi.mocked(sm.saveSession).mockResolvedValue(undefined);
    vi.mocked(sm.updateSessionStatus).mockResolvedValue({ ...makeFakeSession(), status: 'running' } as never);
  });

  afterEach(async () => {
    await cleanup?.();
    _pilotHome = '';
  });

  it('creates tmux session with the prefix+name', async () => {
    await launchSession({ prompt: 'do work', name: 'my-sess', config: baseConfig as never });
    expect(tmux.createSession).toHaveBeenCalledOnce();
    const callArg = vi.mocked(tmux.createSession).mock.calls[0][0];
    expect(callArg.name).toBe(`${TMUX_TEST_PREFIX}my-sess`);
  });

  it('generates a valid UUID v4 for claudeSessionId passed to buildCommand', async () => {
    let capturedSessionId: string | undefined;
    mockBuildCommand.mockImplementation((opts: { sessionId: string; prompt: string; name: string }) => {
      capturedSessionId = opts.sessionId;
      return ['claude', '--session-id', opts.sessionId, '-p', opts.prompt];
    });
    await launchSession({ prompt: 'do work', name: 'uuid-test', config: baseConfig as never });
    expect(capturedSessionId).toMatch(UUID_REGEX);
  });

  it('calls resolveProvider with the provider override', async () => {
    await launchSession({ prompt: 'p', name: 'n', provider: 'claude', config: baseConfig as never });
    expect(resolveProvider).toHaveBeenCalledWith('claude', baseConfig);
  });

  it('sends the built command to tmux via sendKeys', async () => {
    await launchSession({ prompt: 'do stuff', name: 'snd', config: baseConfig as never });
    expect(tmux.sendKeys).toHaveBeenCalledOnce();
    const [sessionName, command] = vi.mocked(tmux.sendKeys).mock.calls[0];
    expect(sessionName).toBe(`${TMUX_TEST_PREFIX}snd`);
    expect(typeof command).toBe('string');
    expect(command.length).toBeGreaterThan(0);
  });

  it('starts logging under PILOT_HOME/logs/<name>.log', async () => {
    await launchSession({ prompt: 'p', name: 'log-test', config: baseConfig as never });
    expect(tmux.startLogging).toHaveBeenCalledOnce();
    const [, logPath] = vi.mocked(tmux.startLogging).mock.calls[0];
    expect(logPath).toBe(path.join(_pilotHome, 'logs', 'log-test.log'));
  });

  it('creates session record via sessionManager', async () => {
    await launchSession({ prompt: 'do work', name: 'cr', config: baseConfig as never });
    expect(sm.createSession).toHaveBeenCalledOnce();
    const opts = vi.mocked(sm.createSession).mock.calls[0][0];
    expect(opts.name).toBe('cr');
    expect(opts.prompt).toBe('do work');
    expect(opts.tmuxSession).toBe(`${TMUX_TEST_PREFIX}cr`);
  });

  it('updates session status to running after launch', async () => {
    await launchSession({ prompt: 'p', name: 'st', config: baseConfig as never });
    expect(sm.updateSessionStatus).toHaveBeenCalledWith(expect.any(String), 'running');
  });

  it('generates a session name when none is provided', async () => {
    await launchSession({ prompt: 'p', config: baseConfig as never });
    const opts = vi.mocked(sm.createSession).mock.calls[0][0];
    expect(opts.name).toMatch(/^session-/);
  });

  it('adds Read, Glob, Grep to autoApprovePatterns when approveReads=true', async () => {
    await launchSession({ prompt: 'p', name: 'r', approveReads: true, config: baseConfig as never });
    const opts = vi.mocked(sm.createSession).mock.calls[0][0];
    expect(opts.autoApprovePatterns).toContain('Read');
    expect(opts.autoApprovePatterns).toContain('Glob');
    expect(opts.autoApprovePatterns).toContain('Grep');
  });

  it('sets permissionMode to dontAsk when autoApprove=true', async () => {
    await launchSession({ prompt: 'p', name: 'aa', autoApprove: true, config: baseConfig as never });
    const opts = vi.mocked(sm.createSession).mock.calls[0][0];
    expect(opts.permissionMode).toBe('dontAsk');
  });

  it('prefixes prompt with /skill when skill is provided', async () => {
    await launchSession({ prompt: 'run sprint', name: 'sk', skill: 'sprint-run', config: baseConfig as never });
    const opts = vi.mocked(sm.createSession).mock.calls[0][0];
    expect(opts.prompt).toBe('/sprint-run run sprint');
  });
});
