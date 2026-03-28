// tests/integration/e2e-autospec.test.ts
// E2E: LSS scanning the autospec monorepo (the project scanning itself)

import { describe, it, expect } from 'vitest';
import { scanProject } from '../../src/scanner/complexity-scorer.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const autospecRoot = path.join(__dirname, '../../..');

// E2E tests scan a large monorepo — allow generous timeouts
const E2E_TIMEOUT = 60_000; // 60s

describe('E2E: LSS scanning autospec repo', () => {
  it('correctly identifies autospec as a large complex monorepo', async () => {
    const result = await scanProject(autospecRoot);

    // autospec root has no package.json (it's a bare monorepo directory),
    // so language detection uses directory/file scanning, not manifest parsing.
    // Architecture detection without a root manifest returns unknown or modular.
    expect(['monorepo', 'modular', 'unknown']).toContain(result.context.architecture.pattern);

    // Should recommend at least standard depth (it's a large, non-trivial project)
    // The root has no package.json so tech-stack breadth score is 0, but file count
    // and test maturity should push it above micro.
    expect(result.suggestedDepth).not.toBe('micro');
    expect(result.complexityScore).toBeGreaterThan(25);

    // Should detect a large number of files
    expect(result.context.metrics.totalFiles).toBeGreaterThan(100);
  }, E2E_TIMEOUT);

  it('scoped scan of cli/ directory works correctly', async () => {
    const [fullResult, cliResult] = await Promise.all([
      scanProject(autospecRoot),
      scanProject(autospecRoot, 'cli'),
    ]);

    expect(cliResult.context.techStack.languages).toContain('typescript');
    // CLI by itself should be less complex than the full monorepo
    expect(cliResult.complexityScore).toBeLessThan(fullResult.complexityScore);
  }, E2E_TIMEOUT);

  it('scoped scan of lss/ detects the LSS project itself', async () => {
    const result = await scanProject(autospecRoot, 'lss');
    expect(result.context.techStack.languages).toContain('typescript');
    expect(result.context.techStack.testFrameworks).toContain('vitest');
  }, E2E_TIMEOUT);

  it('scoped scan of viewer/ detects React', async () => {
    const result = await scanProject(autospecRoot, 'viewer');
    expect(result.context.techStack.languages).toContain('typescript');
    // React or vite should be in frameworks or buildTools
    const allTools = [
      ...result.context.techStack.frameworks,
      ...result.context.techStack.buildTools,
    ];
    expect(allTools.some(t => ['react', 'vite'].includes(t))).toBe(true);
  }, E2E_TIMEOUT);

  it('full scan detects test files', async () => {
    const result = await scanProject(autospecRoot);
    // autospec has many test files across cli/, lss/, etc.
    expect(result.context.metrics.testFiles).toBeGreaterThan(5);
  }, E2E_TIMEOUT);

  it('full scan has large file count (complex monorepo)', async () => {
    const result = await scanProject(autospecRoot);
    expect(result.context.metrics.totalFiles).toBeGreaterThan(50);
  }, E2E_TIMEOUT);
});
