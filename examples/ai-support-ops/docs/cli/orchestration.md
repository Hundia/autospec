# Phase Orchestration Engine

**Sprint:** 6
**Status:** Planned
**Subsystem:** `cli/src/orchestration/`

## Overview

The Phase Orchestration Engine breaks AutoSpec's monolithic generation pipeline into sequential, independently executable phases with validation gates, state persistence, and resume capability. Each phase writes output to disk immediately, enabling crash recovery and agent-adaptive chunk sizing.

## Architecture

### Phase Model

Phases are the atomic unit of generation work:

```
Phase {
  id: string              // 'specs' | 'backlog' | 'docs' | 'prompts' | 'skills'
  displayName: string     // Human-readable name
  type: PhaseType         // 'foundation' | 'scaffold' | 'content' | 'polish' | 'qa'
  dependsOn: string[]     // Phase IDs that must complete first
  generator: GeneratorFn  // Produces output files
  validator: ValidatorFn  // Checks output integrity
  estimatedTokens: number // For chunk sizing
}
```

### Phase Types

| Type | Purpose | Examples |
|------|---------|---------|
| `foundation` | Project structure, config, type definitions | Specs, config |
| `scaffold` | Core infrastructure and frameworks | State manager, validators |
| `content` | Feature implementation, main content | Docs, prompts, skills |
| `polish` | Refinement, optimization | Cross-ref validation |
| `qa` | Verification, testing | Build checks, test runs |

### Execution Flow

```
1. Load config + detect agent profile
2. Load or create state file (.autospec-state.json)
3. Build phase dependency DAG
4. Topological sort → execution order
5. For each phase (respecting deps):
   a. Skip if already complete (resume)
   b. Block if deps unsatisfied
   c. Check estimated tokens vs agent budget
   d. Run generator
   e. Run validator
   f. If fail: retry (max 2), then save error state
   g. Save state to disk (atomic write)
6. Report final status
```

### State Persistence

State file tracks progress across sessions:

```json
{
  "sessionId": "uuid",
  "startedAt": "2026-03-09T...",
  "agent": "claude",
  "phases": {
    "specs": { "status": "completed", "completedAt": "...", "outputFiles": [...], "fileHashes": {...} },
    "backlog": { "status": "failed", "errorMessage": "..." }
  },
  "lastCompletedPhase": "specs"
}
```

Atomic writes via temp file + rename prevent corruption.

### Validation Gates

Each phase has validators that check output integrity before proceeding:

- **File existence**: Expected output files created and non-empty
- **Content completeness**: Required sections present (e.g., backlog has Sprint 0)
- **Syntax validity**: JSON/YAML parseable, markdown well-formed
- **Cross-references**: Backlog ticket refs match actual spec files

Validation failures trigger retry with error context injected.

## CLI Interface

### `autospec generate`

```bash
autospec generate                    # Full phased generation
autospec generate --phase specs      # Run single phase
autospec generate --resume           # Continue from last state
autospec generate --dry-run          # Print execution plan
autospec generate --validate-only    # Check existing output
autospec generate --agent copilot    # Override agent profile
autospec generate --no-validation    # Skip post-phase checks
```

### `autospec init` (updated)

```bash
autospec init --yes                  # Now uses phased generation by default
autospec init --no-phased            # Legacy monolithic mode
autospec init --agent gemini         # Set agent profile
```

On detecting existing `.autospec-state.json`, init prompts: "Previous session found. Resume? (Y/n)"

## Integration

- **Existing generators** become phase providers consumed by the orchestrator
- **Agent profiles** determine chunk strategy and token budgets
- **Config** extended with `orchestrator` section for retry/validation settings
- **Claude Code skills** can invoke individual phases via `autospec generate --phase`

## Files

| File | Purpose |
|------|---------|
| `cli/src/orchestration/sequencer.ts` | Phase DAG resolution, ordering, parallel detection |
| `cli/src/orchestration/state.ts` | State persistence, atomic writes, resume logic |
| `cli/src/orchestration/validators.ts` | Phase-specific validation gates |
| `cli/src/orchestration/cross-ref.ts` | Cross-reference integrity checker |
| `cli/src/types/phases.ts` | Phase type definitions, PhaseType enum |
| `cli/src/commands/generate.ts` | CLI command wrapper |
