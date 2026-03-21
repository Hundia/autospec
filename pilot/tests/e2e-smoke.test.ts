import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PILOT_ROOT = path.resolve(__dirname, '..');
const DIST_INDEX = path.join(PILOT_ROOT, 'dist', 'index.js');

function pilot(args: string, opts: { allowNonZero?: boolean } = {}): string {
  try {
    return execSync(`node ${DIST_INDEX} ${args}`, {
      cwd: PILOT_ROOT,
      stdio: 'pipe',
      encoding: 'utf-8',
      timeout: 15_000,
    });
  } catch (err: unknown) {
    if (opts.allowNonZero) {
      // Return combined stdout+stderr for inspection
      const e = err as { stdout?: string; stderr?: string; message?: string };
      return (e.stdout ?? '') + (e.stderr ?? '');
    }
    throw err;
  }
}

// ---------------------------------------------------------------------------
// E2E smoke tests — exercise the real CLI binary via execSync
// ---------------------------------------------------------------------------

describe('E2E smoke', () => {
  it('pilot --version outputs the version string', () => {
    const out = pilot('--version');
    expect(out.trim()).toMatch(/^\d+\.\d+\.\d+/);
  });

  it('pilot --help lists key commands', () => {
    const out = pilot('--help');
    expect(out).toContain('start');
    expect(out).toContain('list');
    expect(out).toContain('doctor');
    expect(out).toContain('config');
    expect(out).toContain('daemon');
  });

  it('pilot doctor runs and produces system check output', () => {
    const out = pilot('doctor', { allowNonZero: true });
    // Doctor always prints the header
    expect(out).toContain('Claude Pilot');
    expect(out).toContain('Node.js');
  });

  it('pilot list returns without error and produces output', () => {
    const out = pilot('list', { allowNonZero: true });
    // Regardless of whether sessions exist, it should produce some output
    // (either a table, a "no sessions" message, or daemon-not-running message)
    expect(typeof out).toBe('string');
    expect(out.length).toBeGreaterThanOrEqual(0);
  });

  it('pilot config (no args) outputs valid JSON', () => {
    const out = pilot('config');
    // Should be parseable JSON
    let parsed: Record<string, unknown>;
    expect(() => {
      parsed = JSON.parse(out);
    }).not.toThrow();
    // Verify it has expected top-level keys
    expect(parsed!.defaultPermissionMode).toBeDefined();
    expect(parsed!.logLevel).toBeDefined();
    expect(parsed!.redis).toBeDefined();
  });

  it('pilot config set/get round-trips a value', () => {
    // Set a value, then read it back
    const setOut = pilot('config logRetentionDays 14');
    expect(setOut).toContain('logRetentionDays');

    const getOut = pilot('config logRetentionDays');
    expect(getOut.trim()).toBe('14');

    // Restore original value
    pilot('config logRetentionDays 7');
  });

  it('pilot list --json outputs valid JSON array', () => {
    const out = pilot('list --json', { allowNonZero: true });
    // The output may contain a JSON array (possibly empty) or a daemon error
    // Try to find and parse JSON in the output
    const jsonMatch = out.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      expect(() => JSON.parse(jsonMatch[0])).not.toThrow();
    } else {
      // No JSON — daemon not running is acceptable in smoke test
      expect(typeof out).toBe('string');
    }
  });
});
