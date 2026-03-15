---
title: Benchmark Harness Overview
sprint: "24"
created: "2026-03-15"
---

# Benchmark Harness Overview

The AutoSpec benchmark harness measures how well a model (combined with its CLI invocation layer) executes the AutoSpec QUICKSTART pipeline against a target project. This document describes the architecture, dispatcher design, confounding variables, and variance methodology.

**Related sprint:** Sprint 24 — Cross-Model Benchmark Harness (`specs/backlog.md` §Sprint 24)

---

## Harness Architecture

The pipeline executes as follows:

```
harness.sh run-all
  └── for each model × run:
        1. prepare_quickstart()        — concatenate quickstart/01–07 → /tmp/QUICKSTART-combined.md
        2. Template substitution       — fill {{QUICKSTART_CONTENT}} in baseline-template.txt
        3. run_model() dispatcher      — CLI invocation per model
        4. Output capture              — stdout/stderr → results/run-{date}/{model}/run-{N}/output.log
        5. write_metadata()            — metadata.json (model ID, prompt SHA256, timestamp, env vars)
  └── scorer.sh                        — automatic per-run scoring after all runs complete
```

### `prepare_quickstart()`

Reads `quickstart/01-generation-plan.md` through `quickstart/07-*.md`, concatenates them with section separators into `/tmp/QUICKSTART-combined.md`. This combined file is then substituted into the prompt template via the `{{QUICKSTART_CONTENT}}` placeholder. Both Claude and GPT receive the identical combined content.

### Prompt Template Substitution

`benchmark/prompts/baseline-template.txt` contains a single symmetric prompt used by all models. The `{{QUICKSTART_CONTENT}}` placeholder is replaced at invocation time with the concatenated QUICKSTART. This ensures no model receives structurally different instructions.

### `run_model()` Dispatcher

Defined in `benchmark/lib/common.sh`. Switches on `$1` (model name):

| Model | CLI Invocation |
|-------|----------------|
| `claude` | `claude -p "$PROMPT" --model $CLAUDE_MODEL --allowedTools "Edit,Write,Read,Bash,Glob,Grep"` |
| `gpt` | `opencode run -m $GPT_MODEL --dir $WORK_DIR "$PROMPT"` |
| `gemini` | Stub — `TODO: implement gemini invocation` (extensibility hook) |

Each model's invocation is defined in its own shell module at `benchmark/lib/models/{model}.sh`, which exports the `invoke_model()` function. Adding a new model requires only creating a new module file.

When `DRY_RUN=true`, `run_model()` writes `echo "mock output"` instead of invoking the actual CLI, enabling full pipeline testing without API calls.

### Output Capture

Each run's output is captured to:
```
results/run-{date}/
  {model}/
    run-{N}/
      output.log      ← raw stdout/stderr (ANSI-stripped for GPT)
      metadata.json   ← model ID, prompt SHA256, timestamp, CLI version
      scores.json     ← populated by scorer.sh
```

### `scorer.sh`

Called automatically after all runs complete. Iterates `config/quality-gates.json`, evaluates all 28 gates against the generated output directory, and writes `scores.json` per run. Supports `--aggregate` mode to compute mean/min/max/stddev across runs. See `docs/benchmark/02_quality_gates.md` for gate definitions.

### `compare.sh`

Accepts two scored results directories, renders a side-by-side Markdown comparison table with per-category scores, overall scores, wall-clock time, file count, and qualitative samples from the 3 most discriminating gates.

---

## Directory Structure

```
benchmark/
├── harness.sh                     ← Main entrypoint: run-all, dry-run
├── scorer.sh                      ← Standalone + aggregate scorer
├── compare.sh                     ← Side-by-side comparison renderer
├── README.md                      ← Usage guide
├── config/
│   ├── quality-gates.json         ← 28 gate definitions (machine-readable)
│   └── models.sh                  ← Env var defaults ($CLAUDE_MODEL, $GPT_MODEL, etc.)
├── lib/
│   ├── common.sh                  ← Shared functions (run_model, prepare_quickstart, etc.)
│   └── models/
│       ├── claude.sh              ← Claude-specific invoke_model()
│       └── gpt.sh                 ← GPT/OpenCode-specific invoke_model()
├── prompts/
│   └── baseline-template.txt      ← Single symmetric prompt template
└── results/
    └── .gitkeep                   ← Results dir tracked empty; run outputs gitignored
```

---

## Confounding Variables Disclosure

**This benchmark measures model + CLI + prompt combined.** The harness does not isolate individual factors in v1. Differences in output may reflect:

1. **Model capability differences** — the models themselves differ in instruction-following, context retention, and SDD pattern recognition.
2. **CLI file-access behavior** — Claude reads the filesystem natively when `claude -p` is run from the project directory. GPT via OpenCode uses the `--dir` flag and may require explicit file attachments for files outside the working directory. This means Claude may have lower friction accessing project files, which is a structural (not capability) advantage.
3. **Context-window handling** — the combined QUICKSTART is long. Models with different context windows or attention mechanisms may weight early vs late instructions differently.
4. **Prompt interpretation differences** — even with an identical prompt, models may interpret instruction emphasis differently (e.g., how literally to follow the spec file naming convention).

**Sprint 24B** aims to isolate these factors by testing prompt sensitivity, multi-agent orchestration patterns, and alternative CLI attachment methods.

---

## Multi-Run Variance Methodology

Each model runs `N` times (default `$BENCHMARK_RUNS=3`). This design serves two purposes:

1. **Captures output variance** — LLMs are non-deterministic. A single run may be an outlier. Running 3+ times reveals whether a model consistently produces the right structure or occasionally fails.
2. **Aggregated statistics** — `scorer.sh --aggregate` computes mean, min, max, and standard deviation per gate and per category across all runs. A model with high mean score but high stddev is less reliable than one with slightly lower mean but near-zero stddev.

The aggregate statistics are used in `compare.sh` to display confidence intervals alongside the mean scores, enabling more honest comparison than a single-run point estimate.

**Recommended minimum:** 3 runs. For publication-quality results, 5+ runs are recommended to reduce sampling noise.
