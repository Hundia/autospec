# Backend Lead Spec — AutoSpec CLI

## CLI Architecture

**Stack:** Node.js 20, TypeScript 5, Commander.js, tsup (bundler)

**Entry:** `cli/src/index.ts`
**Build:** `tsup src/index.ts --format cjs,esm --dts`
**Test:** Vitest

## Command Structure

```
autospec
├── init [project-name]       # Scaffold new SDD project
├── spec generate             # Generate spec files from SRS input
├── sprint create [number]    # Create sprint docs from backlog
├── viewer build              # Generate static viewer
└── --version / --help
```

## Key Generators (`cli/src/generators/`)

- `project-scaffold.generator.ts` — creates full project structure
- `spec.generator.ts` — generates role spec files from templates
- `backlog.generator.ts` — initializes backlog.md with sprint structure
- `claude-md.generator.ts` — generates CLAUDE.md with SDD rules
- `viewer-prompt.generator.ts` — emits warm palette viewer spec for AI

## Parsers (`cli/src/parsers/`)

- `backlog.parser.ts` — parses backlog.md to JSON (status, tickets, sprints)
- `spec.parser.ts` — parses spec .md files to structured objects

## Design Decisions
- Pure file-based "database" — no SQLite, no network
- All generators are pure functions (input → output string, no side effects)
- tsup for zero-config bundling to CommonJS + ESM
- Vitest for fast unit tests on generators/parsers

## Standards
- All files: strict TypeScript, no `any`
- Functions > Classes where possible
- Generators return strings (callers write to disk)
- 80%+ test coverage on generators and parsers
