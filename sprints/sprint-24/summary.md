# Sprint 24 Summary

**Date:** 2026-03-15
**Status:** ✅ COMPLETE
**Theme:** Cross-Model Benchmark Harness — QUICKSTART Pipeline Scoring

## Overview

Built a complete bash-based benchmark harness for running the AutoSpec QUICKSTART pipeline through Claude (`claude -p`) and GPT (OpenCode CLI), scoring outputs against 28 quality gates across 6 categories, and comparing results. The harness supports multi-run variance control, DRY_RUN mode, automatic scoring, and model-extensibility. Executed via Opus orchestrator + 6 Sonnet agents across 5 batches.

## Completed Tickets

| # | Ticket | Description | Status | Docs |
|---|--------|-------------|--------|------|
| 24.1 | Directory skeleton | Created `benchmark/` tree with all subdirs, stubs, `.gitkeep` | ✅ | `docs/benchmark/01_overview.md` |
| 24.2 | Quality gates JSON | 28 gates, 6 categories, binary + graded, conditional viewer gates | ✅ | `docs/benchmark/02_quality_gates.md` |
| 24.3 | Common library | `lib/common.sh` + `config/models.sh` + model dispatch + DRY_RUN | ✅ | — |
| 24.4 | Overview + gates docs | Architecture, confounding variables, gate definitions | ✅ | `docs/benchmark/01_overview.md`, `docs/benchmark/02_quality_gates.md` |
| 24.5 | Prompt template | Symmetric `baseline-template.txt` with `{{QUICKSTART_CONTENT}}` | ✅ | `docs/benchmark/04_run_config.md` |
| 24.6 | TaskFlow + config docs | Why TaskFlow, CLI invocations, env vars, file access parity | ✅ | `docs/benchmark/03_taskflow_target.md`, `docs/benchmark/04_run_config.md` |
| 24.7 | Harness `run-all` | `--runs N`, `--models`, `--target`, auto-scoring, metadata capture | ✅ | — |
| 24.8 | Claude invocation | `claude -p` with `--allowedTools`, error handling, token detection | ✅ | — |
| 24.9 | GPT invocation | `opencode run` with `--dir`, ANSI stripping, error handling | ✅ | — |
| 24.10 | Scorer engine | 28 gates evaluated, binary + graded, conditional, aggregate mode | ✅ | `docs/benchmark/05_scoring.md` |
| 24.11 | Scoring docs | Formula, categories, thresholds, example JSON shapes | ✅ | `docs/benchmark/05_scoring.md` |
| 24.12 | Comparison script | Side-by-side table, top-3 discriminating gates, qualitative samples | ✅ | — |
| 24.13 | README | Full usage guide, prerequisites, env vars, extensibility | ✅ | `benchmark/README.md` |
| 24.14 | Pre-flight spike | CLI file-writing verified via DRY_RUN pipeline test | ✅ | `docs/benchmark/04_run_config.md` |
| 24.15 | Syntax + DRY_RUN | `bash -n` all scripts ✅, `DRY_RUN=true ./harness.sh run-all` ✅ | ✅ | — |
| 24.16 | Scorer validation | MealMap: 69/100 (viewer active), TaskFlow: 58/100 (viewer skipped), compare ✅ | ✅ | — |
| 24.17 | Sprint close | Backlog + summary | ✅ | `sprints/sprint-24/summary.md` |

## Documentation Updated

| Doc File | Change | Related Tickets |
|----------|--------|-----------------|
| `docs/benchmark/01_overview.md` | Created — architecture, dispatcher, confounding variables | 24.4 |
| `docs/benchmark/02_quality_gates.md` | Created — 28 gates, 6 categories, scoring formula | 24.4 |
| `docs/benchmark/03_taskflow_target.md` | Created — why TaskFlow, expected output, minimum criteria | 24.6 |
| `docs/benchmark/04_run_config.md` | Created — CLI invocations, env vars, file access parity | 24.6, 24.14 |
| `docs/benchmark/05_scoring.md` | Created — scoring formula, categories, thresholds | 24.11 |
| `benchmark/README.md` | Full usage guide | 24.13 |

## Key Files Created

| File | Purpose | Lines |
|------|---------|-------|
| `benchmark/harness.sh` | Main harness — `run-all` with args | ~170 |
| `benchmark/scorer.sh` | 28-gate scoring engine | ~1100 |
| `benchmark/compare.sh` | Side-by-side comparison generator | ~200 |
| `benchmark/lib/common.sh` | Shared library (logging, dispatch, metadata) | ~136 |
| `benchmark/lib/models/claude.sh` | Claude CLI invocation | ~25 |
| `benchmark/lib/models/gpt.sh` | GPT/OpenCode CLI invocation | ~25 |
| `benchmark/config/quality-gates.json` | 28 gate definitions | ~500 |
| `benchmark/config/models.sh` | Model env var defaults | ~6 |
| `benchmark/prompts/baseline-template.txt` | Symmetric prompt template | ~72 |

## QA & Test Results

| Test | Result | Notes |
|------|--------|-------|
| `bash -n` all 6 scripts | ✅ PASS | harness, scorer, compare, common, claude, gpt |
| `DRY_RUN=true ./harness.sh run-all --runs 1` | ✅ PASS | Both models, auto-scoring, aggregation |
| `scorer.sh examples/mealmap/` | ✅ PASS | 69/100, viewer gates activated (4/4 evaluated) |
| `scorer.sh examples/taskflow/` | ✅ PASS | 58/100, viewer gates skipped correctly |
| `compare.sh mealmap/ taskflow/` | ✅ PASS | Valid comparison.md with decision gate |
| Quality gates JSON validation | ✅ PASS | 28 gates confirmed via Python |

## Orchestration Pattern

| Batch | Agent(s) | Tickets | Mode | Duration |
|-------|----------|---------|------|----------|
| 1 | Alpha | 24.1, 24.2, 24.3 | Serial (foreground) | ~3min |
| 2 | Beta + Gamma | 24.5, 24.4+24.6 | Parallel (background) | ~5min |
| 3 | Delta + Epsilon | 24.7-24.9, 24.10+24.11 | Parallel (background) | ~8min |
| 4 | Zeta | 24.12, 24.13 | Serial (foreground) | ~5min (incl. queue) |
| 5 | Orchestrator | 24.14-24.17 | Direct (QA + close) | ~5min |

## Bugs Fixed During QA

| Bug | Root Cause | Fix |
|-----|-----------|-----|
| `prepare_quickstart()` stdout pollution | `log_info` on stdout captured by `$()` | Redirect to `>&2` |
| `fill_template()` Python string break | Bash `$var` interpolation in Python heredoc | Use `sys.argv` via `<<'PYEOF'` |
| `harness.sh` scorer detection | Checked for `score_project` not in scorer | Changed to grep for `Scoring Engine` |
| `scorer.sh` arithmetic errors | `grep -cE` returning non-numeric output | Sanitize with `${m//[^0-9]/}` |
| Missing `jq` dependency | Not installed on server | `apt-get install jq` |
| Missing `bc` dependency | Not installed on server | `apt-get install bc` |

## Sprint 24B Decision Gate

**Baseline results (DRY_RUN scores on existing project content, not model-generated):**
- MealMap (with viewer): **69/100** — Adequate
- TaskFlow (no viewer): **58/100** — Poor (expected: TaskFlow has fewer files)

**Note:** These scores reflect the *existing* project content being scored, not model-generated output. Real model comparison requires live benchmark runs (Sprint 24B or manual invocation).

**Decision:** Sprint 24B should proceed with live runs to establish actual model score gap, then decide between:
- Track A (gap >15pts): Multi-agent orchestration investigation
- Track B (gap ≤15pts): Harder targets (MealMap, E-Commerce) + prompt sensitivity

## Retrospective

**What went well:**
- 6 Sonnet agents completed all 13 implementation tickets with minimal conflicts
- Parallel batch execution (Batches 2 and 3) saved significant time
- DRY_RUN mode enabled full pipeline testing without API costs

**What to improve:**
- Agents couldn't run `bash -n` (permission denied) — orchestrator had to verify
- `grep -cE` output sanitization should be a utility function in `common.sh`
- `jq` and `bc` should be listed as prerequisites and checked in `common.sh`
