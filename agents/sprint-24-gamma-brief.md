# Sprint 24 Gamma Brief — Documentation (24.4 + 24.6)

**Agent:** Sonnet
**Sprint:** 24 Gamma (5 pts, 2 tickets: 24.4, 24.6)
**Theme:** Create all 4 benchmark documentation files

---

## Working Directory

`/opt/FitnessAiManager/autospec/`

---

## Ticket 24.4: Create `docs/benchmark/01_overview.md` + `docs/benchmark/02_quality_gates.md` (2 pts)

Create the `docs/benchmark/` directory and two documentation files.

### `docs/benchmark/01_overview.md`

Cover:
- **Harness Architecture:** Explain the benchmark pipeline: `harness.sh` → `prepare_quickstart()` → prompt template substitution → `run_model()` dispatcher → model CLI invocation → output capture → `scorer.sh` → `compare.sh`
- **`run_model()` Dispatcher:** Sources `lib/models/{model}.sh`, each defines `invoke_model()`. Currently supports `claude` and `gpt`, with extensibility for `gemini`.
- **Confounding Variables Disclosure:** "This benchmark measures model + CLI + prompt combined. Differences in output may reflect: (1) model capability differences, (2) CLI file-access behavior (Claude reads fs natively; GPT may need explicit file attachments), (3) context-window handling, (4) prompt interpretation differences. Sprint 24B aims to isolate these factors."
- **Multi-Run Variance Methodology:** Each model runs N times (default 3). Scorer aggregates mean/min/max/stddev per gate and per category. This captures output variance — some models may produce more consistent results.
- **Directory structure** of `benchmark/`
- Reference Sprint 24 in `specs/backlog.md`

Use YAML frontmatter:
```yaml
---
title: Benchmark Harness Overview
sprint: "24"
created: "2026-03-15"
---
```

### `docs/benchmark/02_quality_gates.md`

Cover:
- **28 Gate Definitions** — list all gates with ID, category, description, check_type, weight
- **6 Categories** with weights: Structure (20%), Specificity (20%), SDD Compliance (25%), Coherence (15%), Viewer (10%, conditional), Technical Correctness (10%)
- **Binary vs Graded:** Binary gates = PASS (1) or FAIL (0). Graded gates = score 0-3 (0=absent, 1=minimal, 2=adequate, 3=comprehensive)
- **Conditional Viewer Gates:** VWR-01 through VWR-04 only evaluated if `viewer/` directory exists. When skipped, their weight (10%) redistributes proportionally.
- **Scoring Formula:** `overall_score = Σ(category_weight × category_score) / Σ(active_category_weights) × 100`
- **Coherence Metric:** Entity Jaccard — extract entity names from each spec, compute pairwise Jaccard similarity. Higher = more consistent naming.
- Reference `benchmark/config/quality-gates.json` for machine-readable definitions

Read `benchmark/config/quality-gates.json` to get the exact gate definitions.

---

## Ticket 24.6: Create `docs/benchmark/03_taskflow_target.md` + `docs/benchmark/04_run_config.md` (3 pts)

### `docs/benchmark/03_taskflow_target.md`

Cover:
- **Why TaskFlow:** Simplest AutoSpec target — straightforward task management app with clear requirements. 2 sprints expected, ~54 tickets. Small enough for single-session generation. No viewer requirement (unlike MealMap).
- **Expected Output File Tree:** Based on `quickstart/01-generation-plan.md` — list the complete expected structure (specs/, docs/, prompts/, sprints/, CLAUDE.md, agents/)
- **Minimum Passing Criteria:** All 6 structure gates pass, overall score ≥60
- **TaskFlow Requirements Summary:** Reference `examples/taskflow/requirements.md` — task management app with auth, CRUD tasks, projects, categories/tags, dashboard. Tech stack: React 18, Node.js/Express, PostgreSQL, Prisma, Tailwind CSS.
- **What TaskFlow Does NOT Have:** No `viewer/` directory — so viewer gates (VWR-01 to VWR-04) should be skipped. This tests the conditional gate logic.

### `docs/benchmark/04_run_config.md`

Cover:
- **CLI Invocations:**
  - Claude: `claude -p "$PROMPT" --model $CLAUDE_MODEL --allowedTools "Edit,Write,Read,Bash,Glob,Grep"`
  - GPT: `opencode run -m $GPT_MODEL --dir $WORK_DIR "$PROMPT"`
- **Environment Variables:**
  - `$CLAUDE_MODEL` — default `claude-sonnet-4-20250514`
  - `$GPT_MODEL` — default `gpt-4o` (user overrides to GPT 5.4 when available)
  - `$BENCHMARK_RUNS` — default 3
  - `$DRY_RUN` — set `true` to skip actual model invocation
- **ANSI Stripping:** GPT/OpenCode output may include ANSI color codes; stripped via `sed 's/\x1b\[[0-9;]*m//g'`
- **File Access Parity:** Claude reads filesystem natively via `claude -p` when run from the project dir. GPT via OpenCode uses `--dir` flag. Both should have equivalent filesystem access but behavior may differ — this is a documented confounding variable.
- **Model Version Pinning:** For reproducibility, pin exact model versions in env vars. Default versions are reasonable starting points.

Both docs use YAML frontmatter with `title`, `sprint: "24"`, `created: "2026-03-15"`.

---

## Backlog Update

After completing both tickets, update `specs/backlog.md`:
- 24.4: `🔲` → `✅`
- 24.6: `🔲` → `✅`

---

## Verification

```bash
ls docs/benchmark/01_overview.md docs/benchmark/02_quality_gates.md docs/benchmark/03_taskflow_target.md docs/benchmark/04_run_config.md
# All 4 files must exist
```
