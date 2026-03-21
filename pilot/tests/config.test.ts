import { describe, it, expect } from 'vitest';
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
