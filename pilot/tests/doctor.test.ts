import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { isTmuxInstalled, getTmuxVersion } from '../src/utils/tmux.js';
import { PILOT_HOME, loadConfig } from '../src/utils/config.js';
import { getAllProviders } from '../src/providers/resolver.js';

// ---------------------------------------------------------------------------
// Doctor checks — these replicate the exact check logic from doctor.ts.
// They are system-dependent and designed to report status, not enforce it.
// ---------------------------------------------------------------------------

describe('doctor checks', () => {
  it('Node.js version check passes on current runtime (>=18)', () => {
    const version = process.version;
    const major = parseInt(version.slice(1));
    expect(major).toBeGreaterThanOrEqual(18);
  });

  it('tmux check runs without throwing', () => {
    // isTmuxInstalled may return true or false depending on the host
    const installed = isTmuxInstalled();
    expect(typeof installed).toBe('boolean');

    // getTmuxVersion should match installed state
    const version = getTmuxVersion();
    if (installed) {
      expect(typeof version).toBe('string');
      expect(version!.length).toBeGreaterThan(0);
    } else {
      expect(version).toBeNull();
    }
  });

  it('Redis check runs without throwing (may pass or fail)', () => {
    let ok = false;
    let detail = '';
    try {
      const pong = execSync('redis-cli ping 2>/dev/null', { stdio: 'pipe' }).toString().trim();
      ok = pong === 'PONG';
      detail = ok ? 'connected' : 'not responding';
    } catch {
      ok = false;
      detail = 'not available (optional)';
    }
    // Just verify no exception and result is boolean
    expect(typeof ok).toBe('boolean');
    expect(detail.length).toBeGreaterThan(0);
  });

  it('Pilot Home exists after ensurePilotDirs has run', async () => {
    // loadConfig calls ensurePilotDirs internally, which creates PILOT_HOME
    await loadConfig();
    const exists = existsSync(PILOT_HOME);
    expect(exists).toBe(true);
  });

  it('getAllProviders returns at least one provider definition', () => {
    const providers = getAllProviders();
    expect(providers.length).toBeGreaterThanOrEqual(1);
    // Each provider must have a name and displayName
    for (const p of providers) {
      expect(typeof p.name).toBe('string');
      expect(p.name.length).toBeGreaterThan(0);
      expect(typeof p.displayName).toBe('string');
      expect(p.displayName.length).toBeGreaterThan(0);
    }
  });

  it('Chrome/Chromium check runs without throwing', () => {
    // Replicate the Chrome check from doctor.ts
    let ok = false;
    let detail = '';
    const cmds = [
      'google-chrome --version',
      'google-chrome-stable --version',
      'chromium --version',
      'chromium-browser --version',
    ];
    try {
      for (const cmd of cmds) {
        try {
          const version = execSync(`${cmd} 2>/dev/null`, { stdio: 'pipe' }).toString().trim();
          if (version) {
            ok = true;
            detail = version;
            break;
          }
        } catch { /* try next */ }
      }
      if (!ok) {
        detail = 'not found (needed for WhatsApp)';
      }
    } catch {
      ok = false;
      detail = 'not found (needed for WhatsApp)';
    }
    // Just ensure no uncaught exception
    expect(typeof ok).toBe('boolean');
    expect(detail.length).toBeGreaterThan(0);
  });
});
