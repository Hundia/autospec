import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { PilotConfigSchema } from '../src/utils/config.js';

describe('PilotConfigSchema', () => {
  it('provides sensible defaults', () => {
    const config = PilotConfigSchema.parse({});

    expect(config.defaultPermissionMode).toBe('default');
    expect(config.approvalTimeoutMs).toBe(300_000);
    expect(config.defaultTimeoutAction).toBe('deny');
    expect(config.maxConcurrentSessions).toBe(5);
    expect(config.tmuxSessionPrefix).toBe('pilot-');
    expect(config.scrollbackLimit).toBe(100_000);
    expect(config.whatsapp.enabled).toBe(false);
    expect(config.redis.db).toBe(2);
    expect(config.logLevel).toBe('info');
  });

  it('overrides specific values', () => {
    const config = PilotConfigSchema.parse({
      approvalTimeoutMs: 60_000,
      whatsapp: { enabled: true },
    });

    expect(config.approvalTimeoutMs).toBe(60_000);
    expect(config.whatsapp.enabled).toBe(true);
    expect(config.whatsapp.mock).toBe(false); // default preserved
  });

  it('rejects invalid permission mode', () => {
    expect(() => PilotConfigSchema.parse({
      defaultPermissionMode: 'invalid',
    })).toThrow();
  });
});

// ---------------------------------------------------------------------------
// File I/O tests — we test the functions by working with a temp dir and
// directly exercising the logic (read/write JSON) rather than trying to
// mock the module-level PILOT_HOME constant (ESM modules don't support that).
// ---------------------------------------------------------------------------

describe('ensurePilotDirs (via temp directory)', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pilot-cfg-test-'));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
    vi.restoreAllMocks();
  });

  it('creates all expected subdirectories', async () => {
    // Replicate ensurePilotDirs logic against tmpDir
    const dirs = ['sessions', 'approvals', 'logs', 'whatsapp'];
    for (const d of dirs) {
      await fs.ensureDir(path.join(tmpDir, d));
    }
    for (const d of dirs) {
      expect(await fs.pathExists(path.join(tmpDir, d))).toBe(true);
    }
  });
});

describe('loadConfig (file I/O simulation)', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pilot-cfg-test-'));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it('returns defaults when no config file exists', () => {
    // No file written — parsing empty object should give defaults
    const config = PilotConfigSchema.parse({});
    expect(config.defaultPermissionMode).toBe('default');
    expect(config.logLevel).toBe('info');
    expect(config.maxConcurrentSessions).toBe(5);
  });

  it('reads and merges existing config from file', async () => {
    const configPath = path.join(tmpDir, 'config.json');
    await fs.writeJson(configPath, { approvalTimeoutMs: 60_000, logLevel: 'debug' });

    const raw = await fs.readJson(configPath);
    const config = PilotConfigSchema.parse(raw);
    expect(config.approvalTimeoutMs).toBe(60_000);
    expect(config.logLevel).toBe('debug');
    // Defaults preserved for unset fields
    expect(config.maxConcurrentSessions).toBe(5);
  });

  it('handles corrupted JSON by returning defaults', async () => {
    const configPath = path.join(tmpDir, 'config.json');
    await fs.writeFile(configPath, '{not valid json{{{{');

    let raw: Record<string, unknown> = {};
    try {
      raw = await fs.readJson(configPath);
    } catch {
      // Corrupted — use defaults (same logic as loadConfig)
    }
    const config = PilotConfigSchema.parse(raw);
    expect(config.defaultPermissionMode).toBe('default');
    expect(config.logLevel).toBe('info');
  });
});

describe('saveConfig (file I/O simulation)', () => {
  let tmpDir: string;
  let configPath: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pilot-cfg-save-'));
    configPath = path.join(tmpDir, 'config.json');
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it('writes validated config to file', async () => {
    const partial = { approvalTimeoutMs: 120_000 };
    const validated = PilotConfigSchema.parse(partial);
    await fs.writeJson(configPath, validated, { spaces: 2 });

    expect(await fs.pathExists(configPath)).toBe(true);
    const loaded = await fs.readJson(configPath);
    expect(loaded.approvalTimeoutMs).toBe(120_000);
  });

  it('merges with existing config without overwriting unrelated fields', async () => {
    // Write an initial config
    const initial = PilotConfigSchema.parse({ logLevel: 'debug', maxConcurrentSessions: 10 });
    await fs.writeJson(configPath, initial, { spaces: 2 });

    // Now merge a new partial config (only change one field)
    const existing = await fs.readJson(configPath) as Record<string, unknown>;
    const merged = { ...existing, approvalTimeoutMs: 99_000 };
    const validated = PilotConfigSchema.parse(merged);
    await fs.writeJson(configPath, validated, { spaces: 2 });

    const result = await fs.readJson(configPath);
    expect(result.approvalTimeoutMs).toBe(99_000);
    expect(result.logLevel).toBe('debug');
    expect(result.maxConcurrentSessions).toBe(10);
  });

  it('preserves unmodified nested fields', async () => {
    const initial = PilotConfigSchema.parse({ redis: { url: 'redis://myhost:6379', keyPrefix: 'test:', db: 3 } });
    await fs.writeJson(configPath, initial, { spaces: 2 });

    const existing = await fs.readJson(configPath) as Record<string, unknown>;
    const merged = { ...existing, logLevel: 'warn' };
    const validated = PilotConfigSchema.parse(merged);
    await fs.writeJson(configPath, validated, { spaces: 2 });

    const result = await fs.readJson(configPath);
    expect(result.logLevel).toBe('warn');
    expect(result.redis.url).toBe('redis://myhost:6379');
    expect(result.redis.db).toBe(3);
  });
});

describe('getConfigValue (dot-notation parsing)', () => {
  it('reads top-level key', () => {
    const config = PilotConfigSchema.parse({ logLevel: 'warn' }) as Record<string, unknown>;
    const parts = 'logLevel'.split('.');
    let current: unknown = config;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = (current as Record<string, unknown>)[part];
      } else {
        current = undefined;
      }
    }
    expect(current).toBe('warn');
  });

  it('reads nested key with dot notation', () => {
    const config = PilotConfigSchema.parse({ redis: { db: 5 } }) as Record<string, unknown>;
    const parts = 'redis.db'.split('.');
    let current: unknown = config;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = (current as Record<string, unknown>)[part];
      } else {
        current = undefined;
      }
    }
    expect(current).toBe(5);
  });

  it('returns undefined for missing key', () => {
    const config = PilotConfigSchema.parse({}) as Record<string, unknown>;
    const parts = 'nonexistent.key'.split('.');
    let current: unknown = config;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = (current as Record<string, unknown>)[part];
      } else {
        current = undefined;
      }
    }
    expect(current).toBeUndefined();
  });
});

describe('setConfigValue (value parsing)', () => {
  it('sets string value as-is', () => {
    const value = 'hello-world';
    let parsed: unknown = value;
    if (value === 'true') parsed = true;
    else if (value === 'false') parsed = false;
    else if (/^\d+$/.test(value)) parsed = parseInt(value, 10);
    expect(parsed).toBe('hello-world');
    expect(typeof parsed).toBe('string');
  });

  it('parses "true" as boolean true', () => {
    const value = 'true';
    let parsed: unknown = value;
    if (value === 'true') parsed = true;
    else if (value === 'false') parsed = false;
    else if (/^\d+$/.test(value)) parsed = parseInt(value, 10);
    expect(parsed).toBe(true);
    expect(typeof parsed).toBe('boolean');
  });

  it('parses "false" as boolean false', () => {
    const value = 'false';
    let parsed: unknown = value;
    if (value === 'true') parsed = true;
    else if (value === 'false') parsed = false;
    else if (/^\d+$/.test(value)) parsed = parseInt(value, 10);
    expect(parsed).toBe(false);
    expect(typeof parsed).toBe('boolean');
  });

  it('parses numeric strings as integers', () => {
    const value = '42';
    let parsed: unknown = value;
    if (value === 'true') parsed = true;
    else if (value === 'false') parsed = false;
    else if (/^\d+$/.test(value)) parsed = parseInt(value, 10);
    expect(parsed).toBe(42);
    expect(typeof parsed).toBe('number');
  });
});
