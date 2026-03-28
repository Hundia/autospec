---
title: LSS Architecture
sprint: 37
created: 2026-03-27
---

# LSS Architecture

## Overview

LightSpeedSpec is a standalone CLI package (`lightspeedspec`) living at `autospec/lss/`. It shares the provider infrastructure of the AutoSpec CLI but is otherwise independent. The architecture is intentionally flat — five modules with clear boundaries and a linear data flow.

---

## Directory Structure

```
autospec/lss/
├── package.json              # name: "lightspeedspec", bin: { lss }
├── tsconfig.json             # ES2022, bundler moduleResolution
├── vitest.config.ts          # tests/**/*.test.ts
├── src/
│   ├── index.ts              # Commander.js program, 4 commands
│   ├── commands/
│   │   ├── init.ts           # lss init — scan + route + generate
│   │   ├── scan.ts           # lss scan — brownfield analysis only
│   │   ├── status.ts         # lss status — task list progress
│   │   └── graduate.ts       # lss graduate — promote to AutoSpec
│   ├── scanner/
│   │   ├── types.ts          # Core interfaces (BrownfieldContext, ScanResult, etc.)
│   │   ├── detect-stack.ts   # Package manager + language + framework detection
│   │   ├── detect-architecture.ts  # Directory pattern → architecture type
│   │   ├── detect-tests.ts   # Test framework + test file counting
│   │   ├── detect-routes.ts  # API route extraction from source files
│   │   ├── detect-docs.ts    # README + spec file discovery
│   │   ├── complexity-scorer.ts    # 0-100 score → depth level
│   │   └── index.ts          # Barrel export
│   ├── pipeline/
│   │   ├── depth-router.ts   # depth → DepthPlan (templates + output files)
│   │   ├── generate-spec.ts  # LLM call with Handlebars template
│   │   ├── task-extractor.ts # Parse task list from generated Markdown
│   │   └── index.ts
│   ├── providers/
│   │   └── index.ts          # Re-exports from ../../cli/src/providers/
│   ├── prompts/system/
│   │   ├── micro.hbs         # Micro depth prompt template
│   │   ├── standard.hbs      # Standard depth prompt template
│   │   ├── full-product.hbs  # Full: product spec prompt
│   │   ├── full-technical.hbs
│   │   └── full-quality.hbs
│   └── utils/
│       ├── file.ts           # File I/O helpers
│       ├── timer.ts          # Duration tracking
│       └── output.ts         # Terminal output (ora + chalk)
├── tests/
│   ├── scanner/              # Unit tests for scanner modules
│   ├── pipeline/             # Unit tests for pipeline modules
│   ├── commands/             # Integration tests for commands
│   └── fixtures/             # node-project, python-project, go-project, empty-project
└── dist/                     # Built output (tsup ESM + .d.ts)
    └── prompts/              # Copied from src/prompts/ at build time
```

---

## Module Dependency Graph

```
CLI Entry (index.ts)
    │
    ├── commands/init.ts
    │       ├── scanner/ (scanProject)
    │       ├── pipeline/depth-router.ts
    │       ├── pipeline/generate-spec.ts
    │       │       └── providers/ (resolveProvider)
    │       ├── pipeline/task-extractor.ts
    │       └── utils/ (file, timer, output)
    │
    ├── commands/scan.ts
    │       └── scanner/ (scanProject)
    │
    ├── commands/status.ts
    │       └── utils/file.ts
    │
    └── commands/graduate.ts
            └── utils/ (file, output)
```

The scanner module has no dependencies outside `fs`, `glob`, and Node built-ins — it never calls an LLM. This is deliberate: scanning is fast, deterministic, and fully testable without mocks.

---

## Provider Reuse Strategy

LSS does not define its own LLM providers. Instead, it re-exports from the AutoSpec CLI's provider layer:

```typescript
// lss/src/providers/index.ts
export { resolveProvider, getAllProviders } from '../../cli/src/providers/resolver.js';
export type { LLMProvider, GenerateOptions, ProviderError, GenerateResult }
  from '../../cli/src/providers/interface.js';
```

This works because LSS and the AutoSpec CLI are siblings in the same repository (`autospec/lss/` and `autospec/cli/`). No npm-linking or workspace setup is needed — the relative path resolves correctly from the `lss/` working directory.

This pattern means LSS automatically gains new providers added to the AutoSpec CLI (Anthropic, OpenAI, Ollama, etc.) without any code changes.

---

## Data Flow

```
1. SCAN
   lss init <path>
       │
       ▼
   scanProject(path, scope?)
       ├── detectStack()         → TechStack
       ├── detectArchitecture()  → Architecture
       ├── detectRoutes()        → ProjectRoutes
       ├── detectDocs()          → ProjectDocs
       ├── detectTests()         → TestInfo
       └── gatherMetrics()       → ProjectMetrics
       │
       ▼
   scoreComplexity(BrownfieldContext)
       └── ScanResult { suggestedDepth, complexityScore, summary, reasoning }

2. ROUTE
   planDepth(depth | override)
       └── DepthPlan { templates[], outputFiles[], maxTokens, estimatedSeconds }

3. GENERATE
   generateSpec(plan, context, srsContent?)
       ├── Load Handlebars template from dist/prompts/system/
       ├── Compile template with { context, srs, projectName }
       ├── resolveProvider(providerName?)
       └── provider.generate(prompt) → spec Markdown

4. EXTRACT
   extractTasks(specMarkdown)
       └── tasks.md (checkbox list)

5. WRITE
   writeOutput(outputDir, plan, specs, tasks, metadata)
       └── .lss/
           ├── spec.md (or product.md + technical.md + quality.md)
           ├── tasks.md
           └── .meta.json
```

---

## Output Structure

All LSS outputs live in `.lss/` (configurable via `-o`):

```
.lss/
├── spec.md          # Micro or Standard: unified spec
├── tasks.md         # Generated task checklist
└── .meta.json       # Generation metadata
```

For full depth:
```
.lss/
├── product.md       # What: personas, user stories, success metrics
├── technical.md     # How: architecture, API, schema, deployment
├── quality.md       # Verify: test plan, acceptance criteria, benchmarks
├── tasks.md
└── .meta.json
```

`.meta.json` records version, generated timestamp, depth, complexity score, provider, model, duration, project path, scope, and output file list. This enables `lss status` to show accurate context and `lss graduate` to understand what was generated.

---

## Zero-Config Design Principles

1. **No config file required.** LSS reads the project, not a `.lssrc.json`. If you want overrides, use CLI flags.
2. **No required environment variables for scanning.** `lss scan` works with zero env setup — it only reads the filesystem.
3. **LLM generation gracefully degrades.** If no provider API key is found, `lss init` shows the scan results and depth recommendation, then exits with instructions rather than crashing.
4. **Sensible defaults everywhere.** Output goes to `.lss/`. Depth is auto-detected. Provider is auto-resolved from available env vars.

---

## Key Types Overview

The core type hierarchy flows from scan to result:

- `TechStack` — languages, frameworks, package manager, test frameworks, build tools
- `Architecture` — pattern (monolith/modular/monorepo/microservices), entry points, source directories, API/frontend/DB flags
- `ProjectRoutes` — extracted route list with method, path, source file
- `ProjectDocs` — README content, spec files, other docs
- `ProjectMetrics` — file count, line count, source files, test files, test coverage
- `BrownfieldContext` — aggregates all five above
- `ScanResult` — context + suggestedDepth + complexityScore + summary + reasoning
- `DepthPlan` — templates, output files, token limit, estimated seconds
