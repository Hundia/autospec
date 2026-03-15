# Sprint 24 Zeta Brief — Comparison + README (24.12 + 24.13)

**Agent:** Sonnet
**Sprint:** 24 Zeta (6 pts, 2 tickets: 24.12, 24.13)
**Theme:** Implement comparison script and full README

---

## Working Directory

`/opt/FitnessAiManager/autospec/`

---

## Context: What Already Exists

- `benchmark/scorer.sh` — scoring engine producing `scores.json` per run and `aggregate-scores.json` per model
- `benchmark/lib/common.sh` — shared library (source it for logging/utilities)
- `benchmark/config/quality-gates.json` — 28 gates definition
- `benchmark/harness.sh` — full harness implementation
- `benchmark/compare.sh` — STUB (needs full implementation)
- `benchmark/README.md` — STUB (needs full implementation)
- `docs/benchmark/01-05_*.md` — documentation files

---

## Ticket 24.12: Implement `compare.sh` (3 pts)

Replace the stub `benchmark/compare.sh` with the full comparison engine.

### Usage

```bash
# Compare two scored directories
./compare.sh results/run-20260315/claude/ results/run-20260315/gpt/

# Accepts either model-level dirs (with aggregate-scores.json) or single run dirs (with scores.json)
```

### Implementation

```bash
#!/usr/bin/env bash
# AutoSpec Benchmark Comparison
# Usage: ./compare.sh <dir1> <dir2> [--output FILE]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "${SCRIPT_DIR}/lib/common.sh"

DIR1="${1:?Usage: ./compare.sh <dir1> <dir2>}"
DIR2="${2:?Usage: ./compare.sh <dir1> <dir2>}"
OUTPUT_FILE="${3:-}"

# Find scores file (prefer aggregate, fall back to scores.json)
find_scores() {
  local dir="$1"
  if [[ -f "${dir}/aggregate-scores.json" ]]; then
    echo "${dir}/aggregate-scores.json"
  elif [[ -f "${dir}/scores.json" ]]; then
    echo "${dir}/scores.json"
  else
    # Look in run-1 subdirectory
    local first_run
    first_run=$(find "$dir" -name "scores.json" -print -quit 2>/dev/null)
    if [[ -n "$first_run" ]]; then
      echo "$first_run"
    else
      log_error "No scores.json found in $dir"
      return 1
    fi
  fi
}

# Get model name from directory or metadata
get_model_name() {
  local dir="$1"
  if [[ -f "${dir}/run-1/metadata.json" ]]; then
    jq -r '.model // "unknown"' "${dir}/run-1/metadata.json"
  elif [[ -f "${dir}/metadata.json" ]]; then
    jq -r '.model // "unknown"' "${dir}/metadata.json"
  else
    basename "$dir"
  fi
}

# Main comparison logic
compare() {
  local scores1 scores2
  scores1=$(find_scores "$DIR1")
  scores2=$(find_scores "$DIR2")

  local model1 model2
  model1=$(get_model_name "$DIR1")
  model2=$(get_model_name "$DIR2")

  log_info "Comparing: $model1 vs $model2"

  # Extract category scores
  local output=""
  output+="# Benchmark Comparison: ${model1} vs ${model2}\n\n"
  output+="**Date:** $(date +%Y-%m-%d)\n"
  output+="**Dir 1:** ${DIR1}\n"
  output+="**Dir 2:** ${DIR2}\n\n"

  # Category comparison table
  output+="## Category Scores\n\n"
  output+="| Category | Weight | ${model1} | ${model2} | Delta |\n"
  output+="|----------|--------|$(printf -- '--------|' ; printf -- '--------|')-------|\n"

  local categories=("structure" "specificity" "sdd_compliance" "coherence" "viewer" "technical_correctness")
  local max_delta=0
  local max_delta_cat=""

  for cat in "${categories[@]}"; do
    local s1 s2
    s1=$(jq -r ".categories.${cat}.weighted_score // 0" "$scores1" 2>/dev/null || echo "0")
    s2=$(jq -r ".categories.${cat}.weighted_score // 0" "$scores2" 2>/dev/null || echo "0")
    local delta
    delta=$(python3 -c "print(round(float('${s1}') - float('${s2}'), 1))")
    local abs_delta
    abs_delta=$(python3 -c "print(abs(float('${delta}')))")

    output+="| ${cat} | $(jq -r ".categories.${cat}.weight // 0" "$scores1") | ${s1} | ${s2} | ${delta} |\n"

    if python3 -c "exit(0 if float('${abs_delta}') > float('${max_delta}') else 1)"; then
      max_delta="$abs_delta"
      max_delta_cat="$cat"
    fi
  done

  # Overall scores
  local overall1 overall2
  overall1=$(jq -r '.overall.normalized_score // .overall.weighted_score // 0' "$scores1" 2>/dev/null || echo "0")
  overall2=$(jq -r '.overall.normalized_score // .overall.weighted_score // 0' "$scores2" 2>/dev/null || echo "0")
  local overall_delta
  overall_delta=$(python3 -c "print(round(float('${overall1}') - float('${overall2}'), 1))")

  output+="\n## Overall Score\n\n"
  output+="| Metric | ${model1} | ${model2} | Delta |\n"
  output+="|--------|--------|--------|-------|\n"
  output+="| **Overall Score** | **${overall1}** | **${overall2}** | **${overall_delta}** |\n"

  # Wall-clock time comparison (if metadata available)
  output+="\n## Execution Metrics\n\n"
  output+="| Metric | ${model1} | ${model2} |\n"
  output+="|--------|--------|--------|\n"

  for dir_pair in "${DIR1}:${model1}" "${DIR2}:${model2}"; do
    local dir="${dir_pair%%:*}"
    # Try to get elapsed time from metadata
    local elapsed="N/A"
    if [[ -f "${dir}/run-1/metadata.json" ]]; then
      elapsed=$(jq -r '.elapsed_seconds // "N/A"' "${dir}/run-1/metadata.json")
      [[ "$elapsed" != "N/A" ]] && elapsed="${elapsed}s"
    fi
  done

  # Most discriminating gates (top 3 by delta)
  output+="\n## Most Discriminating Gates (Top 3)\n\n"

  # Get all gate IDs and find largest deltas
  local gate_deltas
  gate_deltas=$(python3 -c "
import json, sys
try:
    s1 = json.load(open('$scores1'))
    s2 = json.load(open('$scores2'))
except:
    sys.exit(0)
gates1 = s1.get('gates', {})
gates2 = s2.get('gates', {})
all_gates = set(list(gates1.keys()) + list(gates2.keys()))
deltas = []
for g in all_gates:
    sc1 = gates1.get(g, {}).get('score', 0)
    sc2 = gates2.get(g, {}).get('score', 0)
    delta = abs(sc1 - sc2)
    if delta > 0:
        winner = '${model1}' if sc1 > sc2 else '${model2}'
        deltas.append((g, sc1, sc2, delta, winner))
deltas.sort(key=lambda x: -x[3])
for g, sc1, sc2, d, w in deltas[:3]:
    desc = gates1.get(g, gates2.get(g, {})).get('details', '')
    print(f'| {g} | {sc1} | {sc2} | {d} | {w} | {desc} |')
" 2>/dev/null || echo "")

  if [[ -n "$gate_deltas" ]]; then
    output+="| Gate | ${model1} | ${model2} | Delta | Winner | Details |\n"
    output+="|------|--------|--------|-------|--------|----------|\n"
    output+="${gate_deltas}\n"
  fi

  # Qualitative samples for top discriminating gates
  output+="\n## Qualitative Samples\n\n"
  output+="_First 10 lines of the most discriminating file from each model's output._\n\n"
  output+="_(Samples available after live benchmark runs — not generated in dry-run mode)_\n"

  # Decision gate for Sprint 24B
  output+="\n## Sprint 24B Decision Gate\n\n"
  local abs_overall_delta
  abs_overall_delta=$(python3 -c "print(abs(float('${overall_delta}')))")
  if python3 -c "exit(0 if float('${abs_overall_delta}') > 15 else 1)"; then
    output+="**Score gap: ${abs_overall_delta} points (>15)**\n"
    output+="→ Recommendation: Sprint 24B should investigate multi-agent orchestration to close the gap.\n"
  else
    output+="**Score gap: ${abs_overall_delta} points (≤15)**\n"
    output+="→ Recommendation: Sprint 24B should expand to harder projects (MealMap, E-Commerce) or test prompt sensitivity.\n"
  fi

  # Write output
  if [[ -n "$OUTPUT_FILE" ]]; then
    echo -e "$output" > "$OUTPUT_FILE"
    log_success "Comparison written to $OUTPUT_FILE"
  else
    # Write to the parent of dir1
    local parent_dir
    parent_dir=$(dirname "$DIR1")
    local comp_file="${parent_dir}/comparison.md"
    echo -e "$output" > "$comp_file"
    log_success "Comparison written to $comp_file"
  fi
}

compare
```

---

## Ticket 24.13: Full README (3 pts)

Replace the stub `benchmark/README.md` with comprehensive documentation.

### Content Structure

```markdown
# AutoSpec Benchmark Harness

Cross-model benchmark for the AutoSpec QUICKSTART pipeline. Runs identical prompts through Claude and GPT, scores outputs against 28 quality gates, and compares results.

## Prerequisites

- **Claude Code CLI** — `claude` command available
- **OpenCode CLI** v1.2.26+ — `opencode` command available
- **jq** — JSON processor (`apt install jq` / `brew install jq`)
- **python3** — For template substitution and scoring calculations
- **API Keys:** `ANTHROPIC_API_KEY` and `OPENAI_API_KEY` set in environment

## Quick Start

### Full Benchmark Run
\```bash
./harness.sh run-all
\```

### Dry Run (no API calls)
\```bash
DRY_RUN=true ./harness.sh run-all
\```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CLAUDE_MODEL` | `claude-sonnet-4-20250514` | Claude model ID |
| `GPT_MODEL` | `gpt-4o` | GPT model ID (override to `gpt-5.4` when available) |
| `BENCHMARK_RUNS` | `3` | Number of runs per model |
| `DRY_RUN` | `false` | Skip model invocation, use mock output |

## Usage

### Harness
\```bash
./harness.sh run-all                          # Default: 3 runs, claude+gpt, taskflow
./harness.sh run-all --runs 5                 # 5 runs per model
./harness.sh run-all --models "claude"        # Claude only
./harness.sh run-all --target ../examples/mealmap  # Different target project
\```

### Standalone Scorer
\```bash
./scorer.sh /any/autospec/project/            # Score any project
./scorer.sh examples/mealmap/                 # Score MealMap (viewer gates active)
./scorer.sh examples/taskflow/                # Score TaskFlow (viewer gates skipped)
\```

### Aggregate Scoring
\```bash
./scorer.sh --aggregate results/run-DATE/claude/  # Mean/stddev across runs
\```

### Comparison
\```bash
./compare.sh results/run-DATE/claude/ results/run-DATE/gpt/
\```

## Directory Structure
[show benchmark/ tree]

## Quality Gates
28 gates across 6 categories... (brief summary, point to docs/benchmark/02_quality_gates.md)

## Score Interpretation
| Range | Rating | Description |
|-------|--------|-------------|
| 90-100 | Excellent | Comprehensive, specific, well-cross-referenced |
| 75-89 | Good | Solid coverage, minor gaps |
| 60-74 | Adequate | Meets minimum structure, lacks depth |
| <60 | Poor | Significant gaps |

## Extensibility

### Adding a New Model
1. Create `lib/models/{name}.sh` with `invoke_model()` function
2. Add model to `--models` flag: `./harness.sh run-all --models "claude,gpt,newmodel"`
3. The `run_model()` dispatcher in `lib/common.sh` auto-sources `lib/models/{name}.sh`

### Gemini (stub)
Create `lib/models/gemini.sh` when Gemini CLI is available. The dispatcher already supports arbitrary model names.

## Known Confounding Variables

This benchmark measures **model + CLI + prompt** combined:
1. Model capability differences
2. CLI file-access behavior (Claude reads fs natively; GPT via --dir flag)
3. Context-window handling
4. Prompt interpretation differences

Sprint 24B aims to isolate these factors.

## Model Version Pinning

For reproducible results, pin exact model versions:
\```bash
CLAUDE_MODEL=claude-sonnet-4-20250514 GPT_MODEL=gpt-4o ./harness.sh run-all
\```

## Documentation

- [Overview](../docs/benchmark/01_overview.md)
- [Quality Gates](../docs/benchmark/02_quality_gates.md)
- [TaskFlow Target](../docs/benchmark/03_taskflow_target.md)
- [Run Configuration](../docs/benchmark/04_run_config.md)
- [Scoring Engine](../docs/benchmark/05_scoring.md)
```

---

## Backlog Update

After completing both tickets, update `specs/backlog.md`:
- 24.12: `🔲` → `✅`
- 24.13: `🔲` → `✅`

---

## Verification

```bash
bash -n benchmark/compare.sh
# Must exit 0

wc -l benchmark/README.md
# Should be 100+ lines

# Check README covers all key sections
grep -c "Prerequisites\|Quick Start\|Environment Variables\|Standalone Scorer\|Extensibility\|Confounding" benchmark/README.md
# Should be 6
```
