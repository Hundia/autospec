/**
 * Integration tests for parallel generation pipeline
 * Uses a mock provider — no real LLM calls.
 * Sprint 36 ticket 36.8
 */

import { describe, it, expect, afterAll } from 'vitest';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import { generateSpecs, SPEC_ROLES } from '../../src/pipeline/generate-specs.js';
import { LLMProvider, GenerateOptions } from '../../src/providers/interface.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fixtures are at cli/tests/fixtures/
const SRS_SIMPLE = path.resolve(__dirname, '..', 'fixtures', 'srs-simple.md');

// Canned spec content generator — returns minimal valid content per spec
function makeSpecContent(specLabel: string): string {
  const lines: string[] = [
    `# ${specLabel} Specification`,
    '',
    '## Overview',
    `This is the ${specLabel} specification for the test project.`,
    '',
  ];
  // Pad to exceed the smallest minLines threshold (100 for backlog)
  for (let i = 0; i < 110; i++) {
    lines.push(`Line ${i + 1}: Detailed specification content for testing purposes.`);
  }
  return lines.join('\n');
}

// Minimal valid project metadata JSON (for extractMetadata step)
const MOCK_METADATA_JSON = JSON.stringify({
  projectName: 'TaskFlow Test',
  projectType: 'web',
  domain: 'productivity',
  techStack: {
    frontend: 'React',
    backend: 'Node.js',
    database: 'PostgreSQL',
    language: 'TypeScript',
  },
  targetUsers: ['individual professionals', 'students'],
  coreFeatures: ['task creation', 'categories', 'due dates'],
  constraints: ['single user', 'web only'],
});

/**
 * Detect whether a generate() call is for metadata extraction (JSON) vs spec generation (markdown).
 * extract-metadata passes NO systemPrompt — it embeds everything in the user prompt.
 * All role spec calls set options.systemPrompt to the Handlebars-rendered template.
 */
function isMetadataCall(options: GenerateOptions): boolean {
  return !options?.systemPrompt;
}

/**
 * Smart mock provider.
 * - Detects metadata extraction calls (no systemPrompt) → returns JSON
 * - All other calls (spec generation, systemPrompt present) → returns markdown content
 */
const mockProvider: LLMProvider = {
  name: 'mock',
  requiresApiKey: false,
  timeoutMs: 10_000,
  isAvailable: async () => true,
  generate: async function* (prompt: string, options: GenerateOptions) {
    if (isMetadataCall(options)) {
      yield MOCK_METADATA_JSON;
      return;
    }
    // Spec generation
    const match = prompt.match(/Generate the (.+?) specification/);
    const label = match?.[1] ?? 'Test Spec';
    yield makeSpecContent(label);
  },
  parseError: (err: unknown) => ({
    type: 'unknown' as const,
    message: String(err),
    retryable: false,
  }),
};

// Mock provider that fails on a specific spec label during generation
function makePartiallyFailingProvider(failSpecLabel: string): LLMProvider {
  return {
    ...mockProvider,
    generate: async function* (prompt: string, options: GenerateOptions) {
      if (isMetadataCall(options)) {
        yield MOCK_METADATA_JSON;
        return;
      }
      const match = prompt.match(/Generate the (.+?) specification/);
      const label = match?.[1] ?? 'Test Spec';
      if (label === failSpecLabel) {
        throw new Error(`Simulated failure for ${failSpecLabel}`);
      }
      yield makeSpecContent(label);
    },
    parseError: () => ({
      type: 'unknown' as const,
      message: 'Simulated failure',
      retryable: false,
    }),
  };
}

const TMP_BASE = '/tmp/autospec-test-parallel';

// Cleanup all temp dirs created in tests
const tmpDirs: string[] = [];
afterAll(async () => {
  for (const dir of tmpDirs) {
    await fs.remove(dir).catch(() => {/* ignore */});
  }
});

function makeTmpDir(): string {
  const dir = `${TMP_BASE}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  tmpDirs.push(dir);
  return dir;
}

describe('parallel generation (--parallel)', () => {
  it('produces all 11 spec files', async () => {
    const tmpDir = makeTmpDir();
    const result = await generateSpecs({
      srsPath: SRS_SIMPLE,
      outputDir: tmpDir,
      provider: mockProvider,
      parallel: true,
      quiet: true,
    });

    expect(result.specs).toHaveLength(SPEC_ROLES.length);
    expect(result.specs.every(s => !s.failed)).toBe(true);

    // Verify all files exist on disk
    for (const spec of SPEC_ROLES) {
      const filePath = path.join(tmpDir, spec.file);
      const exists = await fs.pathExists(filePath);
      expect(exists, `Expected ${spec.file} to exist`).toBe(true);
    }
  }, 30_000);

  it('all generated specs have valid YAML frontmatter', async () => {
    const tmpDir = makeTmpDir();
    await generateSpecs({
      srsPath: SRS_SIMPLE,
      outputDir: tmpDir,
      provider: mockProvider,
      parallel: true,
      quiet: true,
    });

    for (const spec of SPEC_ROLES) {
      const content = await fs.readFile(path.join(tmpDir, spec.file), 'utf-8');
      expect(content, `${spec.file} should have frontmatter`).toMatch(/^---\n/);
      expect(content).toMatch(/role: /);
      expect(content).toMatch(/source_hash: /);
    }
  }, 30_000);

  it('returns non-zero totalDurationMs', async () => {
    const tmpDir = makeTmpDir();
    const result = await generateSpecs({
      srsPath: SRS_SIMPLE,
      outputDir: tmpDir,
      provider: mockProvider,
      parallel: true,
      quiet: true,
    });
    expect(result.totalDurationMs).toBeGreaterThan(0);
  }, 30_000);
});

describe('sequential generation (--no-parallel)', () => {
  it('produces all 11 spec files', async () => {
    const tmpDir = makeTmpDir();
    const result = await generateSpecs({
      srsPath: SRS_SIMPLE,
      outputDir: tmpDir,
      provider: mockProvider,
      parallel: false,
      quiet: true,
    });

    expect(result.specs).toHaveLength(SPEC_ROLES.length);
    expect(result.specs.every(s => !s.failed)).toBe(true);
  }, 30_000);
});

describe('parallel vs sequential file output', () => {
  it('produces the same set of spec files in both modes', async () => {
    const parallelDir = makeTmpDir();
    const sequentialDir = makeTmpDir();

    await generateSpecs({
      srsPath: SRS_SIMPLE,
      outputDir: parallelDir,
      provider: mockProvider,
      parallel: true,
      quiet: true,
    });

    await generateSpecs({
      srsPath: SRS_SIMPLE,
      outputDir: sequentialDir,
      provider: mockProvider,
      parallel: false,
      quiet: true,
    });

    // Both should have the same files
    for (const spec of SPEC_ROLES) {
      const parallelExists = await fs.pathExists(path.join(parallelDir, spec.file));
      const sequentialExists = await fs.pathExists(path.join(sequentialDir, spec.file));
      expect(parallelExists, `parallel: ${spec.file} missing`).toBe(true);
      expect(sequentialExists, `sequential: ${spec.file} missing`).toBe(true);
    }
  }, 60_000);
});

describe('error handling in parallel mode', () => {
  it('marks failed specs and continues — does not throw', async () => {
    const tmpDir = makeTmpDir();

    // The mock provider will fail on 'Product Manager' generation
    // This means PM fails → all downstream specs get blocked
    const failingProvider = makePartiallyFailingProvider('Product Manager');

    // generateSpecs will process.exit on sequential failure
    // In parallel mode, it isolates failures
    // For this test, we test that a non-critical spec failure still produces partial output
    // We use a provider that fails a leaf spec (backlog) to avoid cascade
    const backlogFailProvider: LLMProvider = {
      ...mockProvider,
      generate: async function* (prompt: string, options: GenerateOptions) {
        if (isMetadataCall(options)) {
          yield MOCK_METADATA_JSON;
          return;
        }
        const match = prompt.match(/Generate the (.+?) specification/);
        const label = match?.[1] ?? 'Test Spec';
        if (label === 'Sprint Planner') {
          throw new Error('Simulated backlog failure');
        }
        yield makeSpecContent(label);
      },
      parseError: () => ({
        type: 'unknown' as const,
        message: 'Simulated backlog failure',
        retryable: false,
      }),
    };

    const result = await generateSpecs({
      srsPath: SRS_SIMPLE,
      outputDir: tmpDir,
      provider: backlogFailProvider,
      parallel: true,
      quiet: true,
    });

    // Should have 11 results — 10 succeeded, 1 failed
    expect(result.specs).toHaveLength(SPEC_ROLES.length);
    const failed = result.specs.filter(s => s.failed);
    expect(failed).toHaveLength(1);
    expect(failed[0].id).toBe('backlog');
  }, 30_000);
});

describe('resume behavior', () => {
  it('skips specs that are already up to date', async () => {
    const tmpDir = makeTmpDir();

    // First run — generate all
    await generateSpecs({
      srsPath: SRS_SIMPLE,
      outputDir: tmpDir,
      provider: mockProvider,
      parallel: true,
      quiet: true,
    });

    // Second run — all should be skipped (same SRS hash)
    const result = await generateSpecs({
      srsPath: SRS_SIMPLE,
      outputDir: tmpDir,
      provider: mockProvider,
      parallel: true,
      quiet: true,
    });

    expect(result.skippedCount).toBe(SPEC_ROLES.length);
    expect(result.specs.every(s => s.skipped)).toBe(true);
  }, 60_000);

  it('--force regenerates all specs even if up to date', async () => {
    const tmpDir = makeTmpDir();

    // First run
    await generateSpecs({
      srsPath: SRS_SIMPLE,
      outputDir: tmpDir,
      provider: mockProvider,
      parallel: true,
      quiet: true,
    });

    // Second run with force
    const result = await generateSpecs({
      srsPath: SRS_SIMPLE,
      outputDir: tmpDir,
      provider: mockProvider,
      parallel: true,
      force: true,
      quiet: true,
    });

    expect(result.skippedCount).toBe(0);
    expect(result.specs.every(s => !s.skipped)).toBe(true);
  }, 60_000);
});
