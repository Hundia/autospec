import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClaudeCodeProvider } from '../src/providers/claude-code.provider.js';
import { GeminiCliProvider } from '../src/providers/gemini-cli.provider.js';
import { CopilotProvider } from '../src/providers/copilot.provider.js';
import { getAllProviders, resolveProvider } from '../src/providers/resolver.js';

// ---------------------------------------------------------------------------
// ClaudeCodeProvider — buildCommand
// ---------------------------------------------------------------------------

describe('ClaudeCodeProvider.buildCommand', () => {
  const provider = new ClaudeCodeProvider();

  it('builds minimal command', () => {
    const cmd = provider.buildCommand({
      prompt: 'fix the bug',
      sessionId: 'abc123',
      name: 'my-session',
    });
    expect(cmd).toEqual(['claude', '--session-id', 'abc123', '--name', 'my-session', '-p', 'fix the bug']);
  });

  it('adds --dangerously-skip-permissions when autoApprove', () => {
    const cmd = provider.buildCommand({
      prompt: 'do stuff',
      sessionId: 'sid',
      name: 'n',
      autoApprove: true,
    });
    expect(cmd).toContain('--dangerously-skip-permissions');
  });

  it('adds --model when provided', () => {
    const cmd = provider.buildCommand({
      prompt: 'p',
      sessionId: 's',
      name: 'n',
      model: 'claude-opus-4',
    });
    expect(cmd).toContain('--model');
    expect(cmd).toContain('claude-opus-4');
  });

  it('adds --fallback-model when provided', () => {
    const cmd = provider.buildCommand({
      prompt: 'p',
      sessionId: 's',
      name: 'n',
      fallbackModel: 'claude-haiku-3',
    });
    expect(cmd).toContain('--fallback-model');
    expect(cmd).toContain('claude-haiku-3');
  });

  it('adds --resume flag and skips -p prompt', () => {
    const cmd = provider.buildCommand({
      prompt: 'irrelevant',
      sessionId: 's',
      name: 'n',
      resume: 'prev-session-id',
    });
    expect(cmd).toContain('--resume');
    expect(cmd).toContain('prev-session-id');
    expect(cmd).not.toContain('-p');
  });

  it('prefixes skill in prompt', () => {
    const cmd = provider.buildCommand({
      prompt: 'run the sprint',
      sessionId: 's',
      name: 'n',
      skill: 'sprint-run',
    });
    expect(cmd).toContain('-p');
    expect(cmd).toContain('/sprint-run run the sprint');
  });

  it('uses custom claudePath', () => {
    const custom = new ClaudeCodeProvider('/usr/local/bin/claude');
    const cmd = custom.buildCommand({ prompt: 'p', sessionId: 's', name: 'n' });
    expect(cmd[0]).toBe('/usr/local/bin/claude');
  });
});

// ---------------------------------------------------------------------------
// GeminiCliProvider — buildCommand
// ---------------------------------------------------------------------------

describe('GeminiCliProvider.buildCommand', () => {
  const provider = new GeminiCliProvider();

  it('builds minimal command', () => {
    const cmd = provider.buildCommand({ prompt: 'hello', sessionId: 's', name: 'n' });
    expect(cmd).toEqual(['gemini', 'hello']);
  });

  it('embeds skill as prompt prefix', () => {
    const cmd = provider.buildCommand({ prompt: 'do work', sessionId: 's', name: 'n', skill: 'analyze' });
    expect(cmd).toEqual(['gemini', '/analyze do work']);
  });

  it('does not include --session-id or --dangerously-skip-permissions', () => {
    const cmd = provider.buildCommand({ prompt: 'p', sessionId: 's', name: 'n', autoApprove: true });
    expect(cmd.join(' ')).not.toContain('--session-id');
    expect(cmd.join(' ')).not.toContain('--dangerously-skip-permissions');
  });
});

// ---------------------------------------------------------------------------
// CopilotProvider — buildCommand
// ---------------------------------------------------------------------------

describe('CopilotProvider.buildCommand', () => {
  const provider = new CopilotProvider();

  it('builds minimal command', () => {
    const cmd = provider.buildCommand({ prompt: 'list files', sessionId: 's', name: 'n' });
    expect(cmd).toEqual(['gh', 'copilot', 'suggest', '-t', 'shell', 'list files']);
  });

  it('embeds skill in prompt', () => {
    const cmd = provider.buildCommand({ prompt: 'do it', sessionId: 's', name: 'n', skill: 'run' });
    expect(cmd).toContain('/run do it');
  });

  it('has experimental displayName', () => {
    expect(provider.displayName).toContain('experimental');
  });
});

// ---------------------------------------------------------------------------
// getAllProviders
// ---------------------------------------------------------------------------

describe('getAllProviders', () => {
  it('returns 3 providers', () => {
    const all = getAllProviders();
    expect(all).toHaveLength(3);
  });

  it('lists providers by name', () => {
    const names = getAllProviders().map(p => p.name);
    expect(names).toContain('claude');
    expect(names).toContain('gemini');
    expect(names).toContain('copilot');
  });

  it('respects custom claudePath from config', () => {
    const all = getAllProviders({ provider: { default: '', claudePath: '/opt/claude', geminiPath: 'gemini' } } as never);
    const claude = all.find(p => p.name === 'claude')!;
    const cmd = claude.buildCommand({ prompt: 'p', sessionId: 's', name: 'n' });
    expect(cmd[0]).toBe('/opt/claude');
  });
});

// ---------------------------------------------------------------------------
// resolveProvider
// ---------------------------------------------------------------------------

describe('resolveProvider', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns requested provider when available', async () => {
    // Mock ClaudeCodeProvider.isAvailable to return true
    vi.spyOn(ClaudeCodeProvider.prototype, 'isAvailable').mockResolvedValue(true);

    const provider = await resolveProvider('claude');
    expect(provider.name).toBe('claude');
  });

  it('throws when requested provider is unknown', async () => {
    await expect(resolveProvider('openai')).rejects.toThrow('Unknown provider');
  });

  it('throws when requested provider is not available', async () => {
    vi.spyOn(ClaudeCodeProvider.prototype, 'isAvailable').mockResolvedValue(false);
    vi.spyOn(GeminiCliProvider.prototype, 'isAvailable').mockResolvedValue(false);
    vi.spyOn(CopilotProvider.prototype, 'isAvailable').mockResolvedValue(false);

    await expect(resolveProvider('claude')).rejects.toThrow('not available');
  });

  it('auto-detects first available provider', async () => {
    vi.spyOn(ClaudeCodeProvider.prototype, 'isAvailable').mockResolvedValue(false);
    vi.spyOn(GeminiCliProvider.prototype, 'isAvailable').mockResolvedValue(true);
    vi.spyOn(CopilotProvider.prototype, 'isAvailable').mockResolvedValue(false);

    const provider = await resolveProvider();
    expect(provider.name).toBe('gemini');
  });

  it('throws when no provider available', async () => {
    vi.spyOn(ClaudeCodeProvider.prototype, 'isAvailable').mockResolvedValue(false);
    vi.spyOn(GeminiCliProvider.prototype, 'isAvailable').mockResolvedValue(false);
    vi.spyOn(CopilotProvider.prototype, 'isAvailable').mockResolvedValue(false);

    await expect(resolveProvider()).rejects.toThrow('No LLM provider found');
  });

  it('uses config.provider.default when no override given', async () => {
    vi.spyOn(GeminiCliProvider.prototype, 'isAvailable').mockResolvedValue(true);

    const provider = await resolveProvider(undefined, {
      provider: { default: 'gemini', claudePath: 'claude', geminiPath: 'gemini' },
    } as never);
    expect(provider.name).toBe('gemini');
  });
});
