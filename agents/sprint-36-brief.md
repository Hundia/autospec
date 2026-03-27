# Sprint 36 Brief: Wave-Based Parallel Generation

**Date:** 2026-03-27
**Theme:** Dependency graph + wave scheduler for 2.2x speedup
**Design doc:** `docs/cli/05_wave_parallel_generation.md`

---

## Context

The `autospec generate` pipeline runs 11 LLM calls strictly sequentially. Each spec N receives ALL prior summaries (1 through N-1), creating a false dependency chain. Analysis shows each spec only needs 0-4 prior summaries. By grouping independent specs into waves and running them in parallel, we achieve ~2.2x speedup.

## Dependency Graph (hardcoded)

```typescript
const DEPENDENCY_GRAPH: Record<string, string[]> = {
  '01_product_manager': [],
  '02_backend_lead':    ['01_product_manager'],
  '03_frontend_lead':   ['01_product_manager', '02_backend_lead'],
  '04_db_architect':    ['01_product_manager', '02_backend_lead'],
  '05_qa_lead':         ['01_product_manager', '02_backend_lead', '03_frontend_lead'],
  '06_devops_lead':     ['02_backend_lead', '04_db_architect'],
  '07_marketing_lead':  ['01_product_manager'],
  '08_finance_lead':    ['01_product_manager', '07_marketing_lead'],
  '09_business_lead':   ['01_product_manager', '07_marketing_lead'],
  '10_ui_designer':     ['01_product_manager', '03_frontend_lead'],
  'backlog':            ['01_product_manager', '02_backend_lead', '03_frontend_lead', '04_db_architect'],
};
```

Results in 6 waves (0-5):
- **Wave 0:** metadata extraction (already separate step)
- **Wave 1:** `[01_product_manager]`
- **Wave 2:** `[02_backend_lead, 07_marketing_lead]`
- **Wave 3:** `[03_frontend_lead, 04_db_architect, 08_finance_lead, 09_business_lead]`
- **Wave 4:** `[05_qa_lead, 06_devops_lead, 10_ui_designer]`
- **Wave 5:** `[backlog]`

---

## Tickets

### 36.1 — Dependency graph + wave scheduler module

**Create:** `cli/src/pipeline/wave-scheduler.ts`

```typescript
import { SPEC_ROLES } from './generate-specs.js';  // You'll need to export SPEC_ROLES

export interface SpecDependency {
  specId: string;
  dependsOn: string[];
}

export interface Wave {
  index: number;
  specs: typeof SPEC_ROLES[number][];  // Full spec config objects, not just IDs
  dependencies: Record<string, string[]>;  // specId → dependency IDs for selective summaries
}

// Static dependency graph
export const DEPENDENCY_GRAPH: Record<string, string[]> = {
  '01_product_manager': [],
  '02_backend_lead':    ['01_product_manager'],
  '03_frontend_lead':   ['01_product_manager', '02_backend_lead'],
  '04_db_architect':    ['01_product_manager', '02_backend_lead'],
  '05_qa_lead':         ['01_product_manager', '02_backend_lead', '03_frontend_lead'],
  '06_devops_lead':     ['02_backend_lead', '04_db_architect'],
  '07_marketing_lead':  ['01_product_manager'],
  '08_finance_lead':    ['01_product_manager', '07_marketing_lead'],
  '09_business_lead':   ['01_product_manager', '07_marketing_lead'],
  '10_ui_designer':     ['01_product_manager', '03_frontend_lead'],
  'backlog':            ['01_product_manager', '02_backend_lead', '03_frontend_lead', '04_db_architect'],
};

/**
 * Compute generation waves from the dependency graph.
 * Topological sort: a spec goes in the earliest wave where all its dependencies are satisfied.
 */
export function computeWaves(specRoles: typeof SPEC_ROLES): Wave[] {
  // Implementation: Kahn's algorithm / topological grouping
  // For each spec, its wave = max(wave of each dependency) + 1
  // Specs with no dependencies → wave 0 (but wave 0 is metadata, so PM → wave 1)
}

/**
 * Filter summaries to only those a given spec needs.
 */
export function selectSummaries(
  allSummaries: Record<string, string>,
  specId: string,
): Record<string, string> {
  const deps = DEPENDENCY_GRAPH[specId] ?? [];
  const selected: Record<string, string> = {};
  for (const dep of deps) {
    if (allSummaries[dep]) {
      selected[dep] = allSummaries[dep];
    }
  }
  return selected;
}
```

**Key design decisions:**
- `computeWaves` returns `Wave[]` where each wave has the full spec config objects (not just IDs), so the orchestrator can use them directly
- `selectSummaries` is a pure function — easy to unit test
- Export `DEPENDENCY_GRAPH` as a const for testability
- If `--no-parallel` is set, return one wave per spec (sequential fallback)

---

### 36.2 — Selective summaries

**Modify:** `cli/src/pipeline/generate-specs.ts`

Change the summary injection from "all prior" to "only dependencies":

**Current code (lines 352-355):**
```typescript
const priorSummariesText = Object.entries(summaries)
  .map(([id, summary]) => `### ${id}\n${summary}`)
  .join('\n\n---\n\n');
```

**New code:**
```typescript
import { selectSummaries } from './wave-scheduler.js';

// Inside the per-spec generation loop:
const selectedSummaries = selectSummaries(summaries, spec.id);
const priorSummariesText = Object.entries(selectedSummaries)
  .map(([id, summary]) => `### ${id}\n${summary}`)
  .join('\n\n---\n\n');
```

This is a **standalone change** that works even without parallelism. It reduces context size immediately in sequential mode too.

---

### 36.3 — Parallel wave execution engine

**Modify:** `cli/src/pipeline/generate-specs.ts`

This is the core change. Replace the `for` loop (lines 300-449) with a wave-based executor.

**New architecture:**

```typescript
export async function generateSpecs(options: GenerateSpecsOptions): Promise<GenerateSpecsResult> {
  // ... existing pre-flight (lines 228-267) — UNCHANGED

  // Step 1: Extract metadata — UNCHANGED

  // Steps 2-12: REPLACE sequential loop with wave execution
  const waves = options.parallel !== false
    ? computeWaves(SPEC_ROLES)
    : SPEC_ROLES.map((spec, i) => ({ index: i, specs: [spec], dependencies: { [spec.id]: DEPENDENCY_GRAPH[spec.id] ?? [] } }));

  const maxConcurrency = options.concurrency ?? getDefaultConcurrency(provider);

  for (const wave of waves) {
    // Skip wave if all specs in it are already up to date (resume)
    // For each spec in wave: check resume, if skip → load existing summary

    // Filter to specs that need generation
    const toGenerate = []; // specs not skipped
    for (const spec of wave.specs) {
      const shouldSkip = await shouldResumeSpec(specPath, srsHash, force);
      if (shouldSkip) {
        // load summary, add to results, continue
      } else {
        toGenerate.push(spec);
      }
    }

    if (toGenerate.length === 0) continue; // entire wave skipped

    // Generate specs in parallel (limited by concurrency)
    const promises = toGenerate.map(spec => generateOneSpecInWave(spec, summaries, metadata, srsContent, ...));

    // Use a concurrency limiter (simple semaphore) for maxConcurrency
    const results = await executeWithConcurrency(promises, maxConcurrency);

    // Collect results: extract summaries, update summaries map
    for (const result of results) {
      summaries[result.id] = summarizeSpec(result.content);
      // ... add to results array
    }
  }

  // Steps 13-14: validate + meta.json — UNCHANGED
}

function getDefaultConcurrency(provider: LLMProvider): number {
  switch (provider.name) {
    case 'anthropic-api': return 5;
    case 'claude-code': return 3;
    case 'gemini-cli': return 3;
    default: return 3;
  }
}
```

**Concurrency limiter pattern** (no new dependency needed):
```typescript
async function executeWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  maxConcurrency: number,
): Promise<PromiseSettledResult<T>[]> {
  const results: PromiseSettledResult<T>[] = [];
  const executing = new Set<Promise<void>>();

  for (const task of tasks) {
    const p = task().then(
      value => { results.push({ status: 'fulfilled', value }); },
      reason => { results.push({ status: 'rejected', reason }); },
    ).finally(() => executing.delete(p));

    executing.add(p);

    if (executing.size >= maxConcurrency) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}
```

**CRITICAL: Each parallel spec generation must be self-contained.** The function that generates one spec in a wave receives:
- The spec config
- A **snapshot** of the summaries map (read-only, already populated from previous waves)
- Metadata, SRS content, provider, options

No shared mutable state between parallel specs within the same wave.

---

### 36.4 — CLI flags

**Modify:** `cli/src/index.ts` (around line 147)

Add after `--verbose`:
```typescript
  .option('--parallel', 'Enable wave-based parallel generation (default: true)')
  .option('--no-parallel', 'Force sequential generation (v0.2.0 behavior)')
  .option('--concurrency <n>', 'Max parallel specs per wave', parseInt)
```

**Modify:** `cli/src/commands/generate.ts`

Add to `GenerateCommandOptions`:
```typescript
  parallel?: boolean;
  concurrency?: number;
```

Pass through to `generateSpecs()`:
```typescript
const result = await generateSpecs({
  srsPath: srsPath!,
  outputDir: options.output || './specs',
  provider,
  model: options.model,
  force: options.force,
  verbose: options.verbose,
  quiet: options.quiet,
  maxBudgetUsd: options.maxBudget ? parseFloat(options.maxBudget) : undefined,
  parallel: options.parallel,
  concurrency: options.concurrency,
});
```

**Modify:** `GenerateSpecsOptions` in `generate-specs.ts`:
```typescript
export interface GenerateSpecsOptions {
  // ... existing fields
  parallel?: boolean;     // default: true
  concurrency?: number;   // default: auto-detect from provider
}
```

---

### 36.5 — Wave-aware progress display

**Create:** `cli/src/utils/wave-progress.ts`

Use `ora` spinners per-wave (not per-spec within a wave). When a wave has multiple specs, show them as a group:

```typescript
import ora, { Ora } from 'ora';
import chalk from 'chalk';

export class WaveProgress {
  private currentWave: number = 0;
  private totalWaves: number;
  private spinner: Ora | null;
  private quiet: boolean;

  constructor(totalWaves: number, quiet: boolean) {
    this.totalWaves = totalWaves;
    this.quiet = quiet;
    this.spinner = quiet ? null : ora();
  }

  startWave(waveIndex: number, specLabels: string[]): void {
    this.currentWave = waveIndex;
    const label = specLabels.length === 1
      ? specLabels[0]
      : specLabels.join(', ');
    this.spinner?.start(`  [${waveIndex + 1}/${this.totalWaves}] ${label}...`);
  }

  specCompleted(specLabel: string, lines: number, durationMs: number): void {
    // For multi-spec waves, log each completion below the spinner
    if (!this.quiet) {
      console.log(chalk.dim(`        ${specLabel} — ${lines} lines, ${(durationMs / 1000).toFixed(1)}s`));
    }
  }

  waveCompleted(waveIndex: number, specLabels: string[], totalDurationMs: number): void {
    const label = specLabels.length === 1
      ? specLabels[0]
      : `${specLabels.length} specs`;
    this.spinner?.succeed(
      chalk.green(`  [${waveIndex + 1}/${this.totalWaves}] ${label}`) +
      chalk.dim(` — ${(totalDurationMs / 1000).toFixed(1)}s`),
    );
  }

  waveFailed(waveIndex: number, error: string): void {
    this.spinner?.fail(chalk.red(`  [${waveIndex + 1}/${this.totalWaves}] ${error}`));
  }
}
```

---

### 36.6 — Error handling: per-spec failure isolation

**Key rules:**
1. Within a wave, use `Promise.allSettled()` (not `Promise.all()`) — never abort siblings
2. If a spec fails all retries, mark it as `failed` in results
3. Before starting a wave, check if any required dependency is `failed` — if so, skip that spec with a warning
4. Remaining specs with satisfied dependencies still run
5. At the end, if any specs failed, exit with appropriate code and show resume instructions

**Implementation pattern in generate-specs.ts:**

```typescript
const failedSpecs = new Set<string>();

for (const wave of waves) {
  const toGenerate = [];
  for (const spec of wave.specs) {
    // Check if any dependency failed
    const deps = DEPENDENCY_GRAPH[spec.id] ?? [];
    const blockedBy = deps.filter(d => failedSpecs.has(d));
    if (blockedBy.length > 0) {
      log(chalk.yellow(`  Skipping ${spec.label} — blocked by failed: ${blockedBy.join(', ')}`));
      failedSpecs.add(spec.id);
      continue;
    }
    toGenerate.push(spec);
  }

  const settled = await executeWithConcurrency(
    toGenerate.map(spec => () => generateOneSpec(spec, ...)),
    maxConcurrency,
  );

  for (let i = 0; i < settled.length; i++) {
    const result = settled[i];
    if (result.status === 'rejected') {
      failedSpecs.add(toGenerate[i].id);
      log(chalk.red(`  ${toGenerate[i].label} failed: ${result.reason}`));
    } else {
      // success — extract summary, write file
    }
  }
}
```

---

### 36.7 — Unit tests

**Create:** `cli/tests/pipeline/wave-scheduler.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { computeWaves, selectSummaries, DEPENDENCY_GRAPH } from '../../src/pipeline/wave-scheduler.js';

describe('computeWaves', () => {
  it('assigns PM to wave 0 (no dependencies)', () => { ... });
  it('assigns Backend and Marketing to same wave (both depend only on PM)', () => { ... });
  it('assigns Frontend and DB to same wave (both depend on PM + Backend)', () => { ... });
  it('produces 5 waves total for 11 specs', () => { ... });
  it('respects all dependency constraints (no spec before its deps)', () => {
    const waves = computeWaves(SPEC_ROLES);
    const waveOf = new Map<string, number>();
    for (const wave of waves) {
      for (const spec of wave.specs) {
        waveOf.set(spec.id, wave.index);
      }
    }
    for (const [specId, deps] of Object.entries(DEPENDENCY_GRAPH)) {
      for (const dep of deps) {
        expect(waveOf.get(dep)!).toBeLessThan(waveOf.get(specId)!);
      }
    }
  });
});

describe('selectSummaries', () => {
  const mockSummaries = {
    '01_product_manager': 'PM summary',
    '02_backend_lead': 'Backend summary',
    '03_frontend_lead': 'Frontend summary',
    '04_db_architect': 'DB summary',
    '07_marketing_lead': 'Marketing summary',
  };

  it('returns empty for PM (no deps)', () => {
    expect(selectSummaries(mockSummaries, '01_product_manager')).toEqual({});
  });

  it('returns only PM for Backend', () => {
    const result = selectSummaries(mockSummaries, '02_backend_lead');
    expect(Object.keys(result)).toEqual(['01_product_manager']);
  });

  it('returns PM + Backend + Frontend for QA', () => {
    const result = selectSummaries(mockSummaries, '05_qa_lead');
    expect(Object.keys(result)).toHaveLength(3);
  });

  it('returns PM + Marketing for Finance', () => {
    const result = selectSummaries(mockSummaries, '08_finance_lead');
    expect(Object.keys(result)).toEqual(['01_product_manager', '07_marketing_lead']);
  });
});
```

**Create:** `cli/tests/pipeline/parallel-execution.test.ts`

Test the concurrency limiter:
```typescript
describe('executeWithConcurrency', () => {
  it('runs tasks in parallel up to limit', async () => {
    let concurrent = 0;
    let maxConcurrent = 0;
    const task = () => new Promise<void>(resolve => {
      concurrent++;
      maxConcurrent = Math.max(maxConcurrent, concurrent);
      setTimeout(() => { concurrent--; resolve(); }, 50);
    });

    await executeWithConcurrency([task, task, task, task, task], 3);
    expect(maxConcurrent).toBeLessThanOrEqual(3);
  });

  it('collects all results even when some fail', async () => { ... });
});
```

---

### 36.8 — E2E test (integration, not real LLM)

**Create:** `cli/tests/pipeline/generate-parallel.test.ts`

Use a mock provider that returns canned content:

```typescript
import { describe, it, expect } from 'vitest';
import { generateSpecs } from '../../src/pipeline/generate-specs.js';
import { LLMProvider } from '../../src/providers/interface.js';

const mockProvider: LLMProvider = {
  name: 'mock',
  requiresApiKey: false,
  timeoutMs: 10_000,
  isAvailable: async () => true,
  generate: async function* (prompt, options) {
    // Return minimal valid spec content
    yield `# ${prompt.match(/Generate the (.+) specification/)?.[1] ?? 'Test'}\n\nMinimal spec content for testing.\n\n## Overview\nThis is a test spec.\n`;
    // Pad to meet minimum line count
    for (let i = 0; i < 300; i++) yield `Line ${i}\n`;
  },
  parseError: (err) => ({ type: 'unknown', message: String(err), retryable: false }),
};

describe('parallel generation', () => {
  it('produces all 11 specs with --parallel', async () => {
    const tmpDir = '/tmp/autospec-test-parallel-' + Date.now();
    const result = await generateSpecs({
      srsPath: 'cli/tests/fixtures/srs-simple.md',
      outputDir: tmpDir,
      provider: mockProvider,
      parallel: true,
    });
    expect(result.specs).toHaveLength(11);
    expect(result.specs.every(s => !s.skipped || s.lines > 0)).toBe(true);
  });

  it('produces identical file set as --no-parallel', async () => { ... });
});
```

---

## Files to Create/Modify Summary

| Action | File | Ticket |
|--------|------|--------|
| CREATE | `cli/src/pipeline/wave-scheduler.ts` | 36.1 |
| MODIFY | `cli/src/pipeline/generate-specs.ts` | 36.2, 36.3, 36.6 |
| MODIFY | `cli/src/commands/generate.ts` | 36.4 |
| MODIFY | `cli/src/index.ts` | 36.4 |
| CREATE | `cli/src/utils/wave-progress.ts` | 36.5 |
| CREATE | `cli/tests/pipeline/wave-scheduler.test.ts` | 36.7 |
| CREATE | `cli/tests/pipeline/parallel-execution.test.ts` | 36.7 |
| CREATE | `cli/tests/pipeline/generate-parallel.test.ts` | 36.8 |

## Build + QA

After implementation:
```bash
cd /opt/FitnessAiManager/autospec/cli
npm run build    # Must exit 0
npm test         # All existing + new tests must pass
```

## Important Notes

1. **Export `SPEC_ROLES`** from `generate-specs.ts` — the wave scheduler needs access to the spec config array.
2. **Don't break `--spec <name>` mode** — single-spec generation bypasses wave scheduling entirely.
3. **Don't change the output format** — files, frontmatter, .meta.json must be identical to v0.2.0.
4. **The `summaries` object is wave-boundary immutable** — within a wave, all specs read from the same snapshot. New summaries are only added between waves.
5. **Keep the `withRetry` function** — it wraps each individual spec call within a wave, not the wave itself.
6. **`--no-parallel` must produce bit-identical output** to v0.2.0 sequential mode (same summaries injected in same order).
