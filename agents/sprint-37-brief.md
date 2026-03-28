# Sprint 37 Brief: LightSpeedSpec (LSS) — Lightweight SDD Framework

**Date:** 2026-03-27
**Theme:** AutoSpec's lightweight younger brother — adaptive depth, brownfield intelligence, 60-second specs
**Design doc:** `docs/lss/` (6 files, created during this sprint)

---

## Context

AutoSpec is a heavyweight 10-role SDD champion (30+ min generation). Market research shows the #1 complaint across ALL spec frameworks is **specification overkill** — tools generate hundreds of lines for tasks needing a paragraph. The #1 unsolved problem is **adaptive rigor** — no tool adjusts spec depth to task complexity.

LightSpeedSpec (LSS) fills this gap as AutoSpec's lightweight younger brother:
- **Adaptive depth**: micro (15s, 200 lines), standard (45s, 500-1K lines), full (90s, 3 files)
- **Brownfield intelligence**: Scans existing projects before generating specs
- **Graduation path**: `lss graduate` → converts to full AutoSpec

---

## Architecture

```
autospec/lss/                    # NEW — LSS CLI package
  package.json                   # name: "lightspeedspec", bin: { lss }
  tsconfig.json
  vitest.config.ts
  src/
    index.ts                     # CLI entry (Commander.js)
    commands/
      init.ts                    # lss init — scan + generate
      scan.ts                    # lss scan — brownfield analysis only
      status.ts                  # lss status — show task progress
      graduate.ts                # lss graduate — migrate to AutoSpec
    scanner/
      index.ts                   # Barrel export
      types.ts                   # BrownfieldContext, ComplexityLevel, ScanResult
      detect-stack.ts            # Tech stack from manifest files
      detect-architecture.ts     # Directory patterns
      detect-tests.ts            # Test framework detection
      detect-routes.ts           # API route detection
      detect-docs.ts             # README/docs detection
      complexity-scorer.ts       # Heuristic 0-100 score → depth level
    pipeline/
      index.ts
      depth-router.ts            # Map depth → template(s)
      generate-spec.ts           # Unified LLM generation
      task-extractor.ts          # Parse tasks from generated spec
    providers/
      index.ts                   # Re-export from ../../cli/src/providers/
    prompts/system/
      analyze-complexity.hbs
      micro.hbs
      standard.hbs
      full-product.hbs
      full-technical.hbs
      full-quality.hbs
    utils/
      file.ts
      timer.ts
      output.ts
  tests/
    scanner/
      detect-stack.test.ts
      detect-architecture.test.ts
      complexity-scorer.test.ts
    pipeline/
      depth-router.test.ts
      generate-spec.test.ts
      task-extractor.test.ts
    commands/
      init.test.ts
      graduate.test.ts
    fixtures/
      node-project/              # package.json + src/ + tests/
      python-project/            # requirements.txt + app/
      go-project/                # go.mod + main.go
      empty-project/             # empty dir
```

---

## Key Types

```typescript
// lss/src/scanner/types.ts

export type ComplexityLevel = 'micro' | 'standard' | 'full';

export interface TechStack {
  languages: string[];         // ['typescript', 'javascript']
  frameworks: string[];        // ['react', 'express', 'nestjs']
  packageManager: string | null; // 'npm' | 'yarn' | 'pnpm' | 'bun' | null
  testFrameworks: string[];    // ['vitest', 'jest', 'pytest']
  buildTools: string[];        // ['vite', 'tsup', 'webpack']
}

export interface Architecture {
  pattern: 'monolith' | 'modular' | 'monorepo' | 'microservices' | 'unknown';
  entryPoints: string[];       // ['src/index.ts', 'src/main.ts']
  sourceDirectories: string[]; // ['src/', 'lib/', 'app/']
  hasApi: boolean;
  hasFrontend: boolean;
  hasDatabase: boolean;
}

export interface ProjectRoutes {
  routes: Array<{ method: string; path: string; file: string }>;
  framework: string | null;    // 'express' | 'fastify' | 'nestjs' | 'flask' | null
}

export interface ProjectDocs {
  readme: string | null;       // content of README.md (first 500 lines)
  existingSpecs: string[];     // paths to any spec-like files found
  otherDocs: string[];         // paths to other doc files
}

export interface ProjectMetrics {
  totalFiles: number;
  totalLines: number;          // approximate, from wc-like count
  sourceFiles: number;
  testFiles: number;
  testCoverage: number | null; // if detectable from config
}

export interface BrownfieldContext {
  techStack: TechStack;
  architecture: Architecture;
  routes: ProjectRoutes;
  docs: ProjectDocs;
  metrics: ProjectMetrics;
}

export interface ScanResult {
  context: BrownfieldContext;
  suggestedDepth: ComplexityLevel;
  complexityScore: number;     // 0-100
  summary: string;             // human-readable 2-3 sentence summary
  reasoning: string;           // why this depth was chosen
}
```

---

## CLI Interface

```typescript
// lss/src/index.ts — Commander.js program

import { Command } from 'commander';

const program = new Command()
  .name('lss')
  .description('LightSpeedSpec — Just enough spec, just fast enough')
  .version('0.1.0');

program
  .command('init [path]')
  .description('Scan project, detect complexity, generate specs')
  .option('--depth <level>', 'Override depth: micro | standard | full')
  .option('--scope <dir>', 'Scope analysis to a subdirectory')
  .option('--srs <file>', 'Provide an SRS/PRD document as input')
  .option('--provider <name>', 'Force LLM provider')
  .option('--model <name>', 'Override model')
  .option('-o, --output <dir>', 'Output directory', '.lss')
  .option('-y, --yes', 'Skip confirmation prompt')
  .option('--dry-run', 'Show plan without generating')
  .action(initCommand);

program
  .command('scan [path]')
  .description('Run brownfield scanner only (no LLM calls)')
  .option('--json', 'Output as JSON')
  .option('--scope <dir>', 'Scope to subdirectory')
  .action(scanCommand);

program
  .command('status')
  .description('Show task list progress from .lss/tasks.md')
  .action(statusCommand);

program
  .command('graduate')
  .description('Convert LSS output to full AutoSpec project')
  .option('--srs <file>', 'Use existing SRS for AutoSpec generation')
  .action(graduateCommand);
```

---

## Provider Re-Export Pattern

```typescript
// lss/src/providers/index.ts
// Thin re-export layer — LSS uses AutoSpec's provider infrastructure

export { resolveProvider, getAllProviders } from '../../cli/src/providers/resolver.js';
export type {
  LLMProvider,
  GenerateOptions,
  ProviderError,
  GenerateResult,
} from '../../cli/src/providers/interface.js';
```

---

## Complexity Scoring Algorithm

```typescript
// lss/src/scanner/complexity-scorer.ts

export function scoreComplexity(context: BrownfieldContext): ScanResult {
  let score = 0;

  // File count (0-25 points)
  const { totalFiles, sourceFiles, testFiles } = context.metrics;
  if (totalFiles > 200) score += 25;
  else if (totalFiles > 50) score += 15;
  else if (totalFiles > 10) score += 8;
  else score += 2;

  // Line count (0-20 points)
  const { totalLines } = context.metrics;
  if (totalLines > 50000) score += 20;
  else if (totalLines > 10000) score += 12;
  else if (totalLines > 2000) score += 6;
  else score += 1;

  // Architecture complexity (0-20 points)
  if (context.architecture.pattern === 'monorepo') score += 20;
  else if (context.architecture.pattern === 'microservices') score += 18;
  else if (context.architecture.pattern === 'modular') score += 10;
  else if (context.architecture.pattern === 'monolith') score += 5;

  // Tech stack breadth (0-15 points)
  const stackCount = context.techStack.languages.length
    + context.techStack.frameworks.length;
  score += Math.min(stackCount * 3, 15);

  // Has API + Frontend + DB (0-10 points)
  if (context.architecture.hasApi) score += 4;
  if (context.architecture.hasFrontend) score += 3;
  if (context.architecture.hasDatabase) score += 3;

  // Test maturity (0-10 points)
  if (testFiles > 20) score += 10;
  else if (testFiles > 5) score += 6;
  else if (testFiles > 0) score += 3;

  // Cap at 100
  score = Math.min(score, 100);

  // Map to depth level
  let suggestedDepth: ComplexityLevel;
  let reasoning: string;

  if (score <= 25) {
    suggestedDepth = 'micro';
    reasoning = 'Small project with minimal complexity — micro spec is sufficient';
  } else if (score <= 65) {
    suggestedDepth = 'standard';
    reasoning = 'Medium complexity project — standard unified spec recommended';
  } else {
    suggestedDepth = 'full';
    reasoning = 'Complex project with multiple concerns — full 3-spec decomposition recommended';
  }

  return { context, suggestedDepth, complexityScore: score, summary: '...', reasoning };
}
```

---

## Depth Router

```typescript
// lss/src/pipeline/depth-router.ts

export interface DepthPlan {
  depth: ComplexityLevel;
  templates: string[];        // template file names
  outputFiles: string[];      // output file names in .lss/
  maxTokensPerCall: number;
  estimatedSeconds: number;
}

export function planDepth(depth: ComplexityLevel): DepthPlan {
  switch (depth) {
    case 'micro':
      return {
        depth: 'micro',
        templates: ['micro.hbs'],
        outputFiles: ['spec.md'],
        maxTokensPerCall: 4096,
        estimatedSeconds: 15,
      };
    case 'standard':
      return {
        depth: 'standard',
        templates: ['standard.hbs'],
        outputFiles: ['spec.md'],
        maxTokensPerCall: 8192,
        estimatedSeconds: 45,
      };
    case 'full':
      return {
        depth: 'full',
        templates: ['full-product.hbs', 'full-technical.hbs', 'full-quality.hbs'],
        outputFiles: ['product.md', 'technical.md', 'quality.md'],
        maxTokensPerCall: 6144,
        estimatedSeconds: 90,
      };
  }
}
```

---

## Output Structure

```
.lss/                           # Default output directory
  spec.md                       # Micro/Standard: unified spec
  — OR —
  product.md                    # Full: product spec (what)
  technical.md                  # Full: technical spec (how)
  quality.md                    # Full: quality spec (verify)
  tasks.md                      # Task list / checklist
  .meta.json                    # Generation metadata
```

**.meta.json format:**
```json
{
  "version": "0.1.0",
  "generated": "2026-03-27T12:00:00Z",
  "depth": "standard",
  "complexityScore": 42,
  "provider": "claude-code",
  "model": "claude-sonnet-4-20250514",
  "durationMs": 38200,
  "projectPath": "/path/to/project",
  "scope": null,
  "files": ["spec.md", "tasks.md"]
}
```

---

## Prompt Template Guidelines

Each `.hbs` prompt template should:
1. Start with a `<role>` tag (e.g., "You are a senior software architect")
2. Include `<context>` with the brownfield scan results as structured data
3. Include `<input>` with the SRS content (if provided) or project description
4. Include `<constraints>` specific to the depth level
5. End with `<output_format>` specifying exact markdown structure expected

**Micro template output format:**
```markdown
# {{projectName}} — Spec

## Problem
[What needs to be done and why]

## Approach
[How it will be implemented]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Notes
[Any risks, dependencies, or considerations]
```

**Standard template output format:**
```markdown
# {{projectName}} — Specification

## Overview
[Project/feature description, goals, target users]

## Technical Design
### Architecture
[High-level architecture decisions]
### API / Endpoints
[API routes, request/response formats]
### Data Model
[Schema, entities, relationships]
### Dependencies
[External services, libraries]

## Implementation Plan
### Phase 1: [Name]
[Description]
### Phase 2: [Name]
[Description]

## Testing Strategy
[Test approach, coverage targets, key test cases]

## Task List
| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 1 | ... | High | 2h |
```

**Full template** splits the standard into three focused files: product.md (personas, user stories, success metrics), technical.md (architecture, API, schema, deployment), quality.md (test plan, acceptance criteria, performance benchmarks).

---

## Graduate Command Design

```typescript
// lss/src/commands/graduate.ts

// The graduate command:
// 1. Reads .lss/ output files
// 2. Creates specs/ directory with 10 role spec files
// 3. Maps LSS content to appropriate roles:
//    - spec.md "Overview" section → 01_product_manager.md
//    - spec.md "Technical Design" → 02_backend_lead.md + 03_frontend_lead.md
//    - spec.md "Data Model" → 04_db_architect.md
//    - spec.md "Testing" → 05_qa_lead.md
//    - Remaining roles (06-10) get stubs:
//      "# [Role] Spec\n\nTODO: Generate with `autospec generate <srs>`"
// 4. Creates specs/backlog.md from tasks.md
// 5. Creates CLAUDE.md from template
// 6. Prints next steps: "Run `autospec generate <srs>` to fill remaining specs"
```

---

## Test Fixtures

**node-project fixture:**
```
tests/fixtures/node-project/
  package.json          # { name: "my-app", deps: { express: "^4.18.2", vitest: "^1.0.0" } }
  src/
    index.ts            # import express...
    routes/
      users.ts          # GET /users, POST /users
    models/
      user.ts           # interface User { ... }
  tests/
    users.test.ts       # describe('Users API', ...)
  README.md             # "# My App\n\nA REST API for user management"
  tsconfig.json
```

**python-project fixture:**
```
tests/fixtures/python-project/
  requirements.txt      # flask==3.0.0\npytest==8.0.0\nsqlalchemy==2.0.0
  app/
    __init__.py
    routes.py            # @app.route('/api/items')
    models.py            # class Item(db.Model): ...
  tests/
    test_routes.py       # def test_get_items(): ...
  README.md              # "# Item API\n\nFlask REST API"
```

**go-project fixture:**
```
tests/fixtures/go-project/
  go.mod                # module github.com/user/myapi \n go 1.21
  main.go               # package main; func main() { ... }
  handlers/
    user.go             # func GetUser(w http.ResponseWriter, ...)
  README.md
```

**empty-project fixture:**
```
tests/fixtures/empty-project/
  (empty directory)
```

---

## Build + QA

```bash
cd /opt/FitnessAiManager/autospec/lss
npm run build          # tsup src/index.ts --format esm --dts --clean
npm test               # vitest run — target 40+ tests
```

---

## Important Notes

1. **Provider imports use relative paths**: `../../cli/src/providers/` — this works because LSS and CLI are siblings in the monorepo. Do NOT try to npm-link or create a workspace.

2. **Scanner is pure** — no LLM calls, no async (except file reads). This keeps it testable without mocks.

3. **The CLI must work with zero config** — no `.lssrc.json`, no env vars required for scanning. Only LLM generation needs a provider.

4. **Use `fs-extra` for file operations** — consistent with AutoSpec CLI.

5. **Handlebars templates must be copied to dist/** — add `cp -r src/prompts dist/prompts` to the build script (same pattern as AutoSpec CLI).

6. **All output files use YAML frontmatter** — consistent with AutoSpec:
   ```yaml
   ---
   generated_by: lightspeedspec
   version: 0.1.0
   depth: standard
   date: 2026-03-27
   ---
   ```

7. **The presentation site deploys at `/autospec/lss/`** — Vite base must be `/autospec/lss/`. Uses HashRouter for GitHub Pages compatibility.
