# Sprint 24 Epsilon Brief — Scorer (24.10 + 24.11)

**Agent:** Sonnet
**Sprint:** 24 Epsilon (10 pts, 2 tickets: 24.10, 24.11)
**Theme:** Implement the scoring engine and scoring documentation

---

## Working Directory

`/opt/FitnessAiManager/autospec/`

---

## Context: What Already Exists

- `benchmark/config/quality-gates.json` — 28 gates with check_type, check_config, conditional flags
- `benchmark/lib/common.sh` — shared library (DO NOT MODIFY — only source it)
- `benchmark/scorer.sh` — STUB (needs full implementation)

---

## Ticket 24.10: Implement `scorer.sh` (8 pts)

Replace the stub `benchmark/scorer.sh` with the full scoring engine.

### Usage Modes

```bash
# Mode 1: Score a harness results directory (has output.log)
./scorer.sh results/run-20260315/claude/run-1/

# Mode 2: Score any raw AutoSpec project directory
./scorer.sh examples/mealmap/
./scorer.sh examples/taskflow/

# Mode 3: Aggregate scores across multiple runs
./scorer.sh --aggregate results/run-20260315/claude/
```

### Auto-Detection

- If `$1` contains `output.log` → harness results mode (project files are in same dir)
- If `$1` is a directory without `output.log` → raw project mode
- If `--aggregate` flag → aggregate mode (reads `run-N/scores.json` files)

### Scoring Logic

Read `benchmark/config/quality-gates.json` and evaluate each gate against the target directory.

#### Check Types Implementation

```bash
check_file_exists() {
  # check_config.paths is an array of relative paths
  # ALL must exist for PASS
  local target_dir="$1"
  shift
  for path in "$@"; do
    [[ -f "${target_dir}/${path}" ]] || return 1
  done
  return 0
}

check_directory_exists() {
  # check_config.path is a single dir path
  local target_dir="$1" path="$2"
  [[ -d "${target_dir}/${path}" ]]
}

check_regex() {
  # check_config.pattern, check_config.files (glob), check_config.min_matches
  # For inverse checks (no placeholders), check_config.inverse = true
  local target_dir="$1" pattern="$2" files_glob="$3" min_matches="${4:-1}" inverse="${5:-false}"
  local count=0
  for file in ${target_dir}/${files_glob}; do
    [[ -f "$file" ]] || continue
    local matches
    matches=$(grep -cE "$pattern" "$file" 2>/dev/null || echo 0)
    count=$((count + matches))
  done
  if [[ "$inverse" == "true" ]]; then
    [[ $count -eq 0 ]]  # PASS if zero matches (no placeholders found)
  else
    [[ $count -ge $min_matches ]]
  fi
}

check_content_match() {
  # check_config.patterns is array of strings to find
  # check_config.files is glob
  # At least one pattern must appear in at least one file
  local target_dir="$1" files_glob="$2"
  shift 2
  local patterns=("$@")
  for file in ${target_dir}/${files_glob}; do
    [[ -f "$file" ]] || continue
    for pattern in "${patterns[@]}"; do
      if grep -ql "$pattern" "$file" 2>/dev/null; then
        return 0
      fi
    done
  done
  return 1
}

check_file_count() {
  # check_config.path (glob), check_config.min_count
  local target_dir="$1" path_glob="$2" min_count="$3"
  local count
  count=$(find "${target_dir}/${path_glob}" -maxdepth 0 -type d 2>/dev/null | wc -l)
  [[ $count -ge $min_count ]]
}

check_line_count() {
  # check_config.files (glob), check_config.min_lines
  local target_dir="$1" files_glob="$2" min_lines="$3"
  local total=0 file_count=0
  for file in ${target_dir}/${files_glob}; do
    [[ -f "$file" ]] || continue
    local lines
    lines=$(wc -l < "$file")
    total=$((total + lines))
    file_count=$((file_count + 1))
  done
  [[ $file_count -eq 0 ]] && return 1
  local avg=$((total / file_count))
  [[ $avg -ge $min_lines ]]
}

check_graded() {
  # Returns 0-3 score based on gate-specific logic
  # Each graded gate has its own evaluation function
  # Return value via echo, not return code
}
```

#### Graded Gate Scoring (0-3)

For graded gates, implement specific evaluation functions:

- **SPC-05** (avg spec length): 0=<50 lines, 1=50-99, 2=100-299, 3=300+
- **SDD-02** (DoD per ticket): Count tickets with DoD text. 0=none, 1=<25%, 2=25-75%, 3=>75%
- **COH-01** (entity consistency): Extract nouns from specs, count how many appear in 3+ files. 0=<3, 1=3-5, 2=6-9, 3=10+
- **COH-02** (endpoints match QA): Extract `/api/` paths from backend and QA specs, compute overlap. 0=0%, 1=1-33%, 2=34-66%, 3=67%+
- **COH-03** (DB tables match): Extract `CREATE TABLE` or table names from DB and PM specs. 0=0%, 1=1-33%, 2=34-66%, 3=67%+
- **COH-04** (cross-refs resolve): Find `specs/0X_` references, check if files exist. 0=<25% resolve, 1=25-50%, 2=50-75%, 3=75%+
- **TC-02** (no circular deps): Check if any ticket depends on itself transitively. 0=circular found, 3=no circulars
- **TC-04** (valid internal links): Find `docs/` and `specs/` references, check existence. Similar to COH-04.
- **VWR-03** (5+ visualizations): Count viz-related keywords (chart, graph, diagram, dashboard, etc.). 0=0, 1=1-2, 2=3-4, 3=5+

### Output: `scores.json`

Write to `${target_dir}/scores.json`:

```json
{
  "timestamp": "2026-03-15T12:00:00Z",
  "target_dir": "/path/to/project",
  "mode": "standalone",
  "gates": {
    "STR-01": { "status": "PASS", "score": 1, "max_score": 1, "details": "10/10 spec files found" },
    "SPC-05": { "status": "GRADED", "score": 2, "max_score": 3, "details": "Average spec length: 185 lines" },
    "VWR-01": { "status": "SKIPPED", "score": 0, "max_score": 0, "details": "No viewer/ directory" }
  },
  "categories": {
    "structure": { "score": 5.5, "max_score": 6, "weight": 20, "weighted_score": 18.33 },
    "viewer": { "score": 0, "max_score": 0, "weight": 0, "weighted_score": 0, "skipped": true }
  },
  "overall": {
    "raw_score": 22.5,
    "max_possible": 28,
    "weighted_score": 82.4,
    "active_weight": 90,
    "normalized_score": 91.6
  }
}
```

### Scoring Formula

```
category_score = sum(gate_scores_in_category) / sum(gate_max_scores_in_category)
weighted_category = category_score * category_weight
overall = sum(weighted_categories) / sum(active_category_weights) * 100
```

Active category weights exclude conditional categories whose gates were all skipped.

### Aggregate Mode (`--aggregate`)

When `--aggregate` flag is passed with a model results directory:

```bash
./scorer.sh --aggregate results/run-20260315/claude/
```

Finds all `run-N/scores.json` files, computes:
- Mean, min, max, stddev per gate
- Mean, min, max, stddev per category
- Overall mean ± stddev

Writes `aggregate-scores.json` to the model directory.

### Script Implementation Notes

- Use `jq` extensively for JSON processing (it's available — common.sh checks for it)
- Source `lib/common.sh` for logging and utilities
- Handle edge cases: missing files gracefully (score 0, not crash), empty directories
- For graded gates, echo the numeric score (0-3)
- For binary gates, return 0 (pass) or 1 (fail)
- Print a summary table to stdout showing all gate results

---

## Ticket 24.11: Create `docs/benchmark/05_scoring.md` (2 pts)

### `docs/benchmark/05_scoring.md`

Cover:
- **Scoring Formula:** `overall = Σ(category_weight × category_score) / Σ(active_weights) × 100`
- **Weighted Categories Table:**
  | Category | Weight | Gates | Type Mix |
  |----------|--------|-------|----------|
  | Structure | 20% | 6 | All binary |
  | Specificity | 20% | 5 | 4 binary + 1 graded |
  | SDD Compliance | 25% | 5 | 3 binary + 2 graded |
  | Coherence | 15% | 4 | All graded |
  | Viewer | 10% | 4 | 2 binary + 2 graded (conditional) |
  | Technical Correctness | 10% | 4 | 2 binary + 2 graded |
- **Binary vs Graded:** Binary = PASS(1)/FAIL(0). Graded = 0-3 scale.
- **Conditional Gate Behavior:** Viewer gates skipped if no `viewer/` dir. Weight redistributes.
- **Both Invocation Modes:** Harness results (with `output.log`) vs standalone (any project dir)
- **Aggregate Mode:** Mean/stddev across N runs
- **Example `scores.json`:** Show full example shape
- **Score Interpretation:**
  - 90-100: Excellent — comprehensive, specific, well-cross-referenced
  - 75-89: Good — solid coverage, minor gaps
  - 60-74: Adequate — meets minimum structure, lacks depth
  - <60: Poor — significant gaps in structure or specificity

Use YAML frontmatter with `title: "Scoring Engine"`, `sprint: "24"`, `created: "2026-03-15"`.

---

## Backlog Update

After completing both tickets, update `specs/backlog.md`:
- 24.10: `🔲` → `✅`
- 24.11: `🔲` → `✅`

---

## Verification

```bash
bash -n benchmark/scorer.sh
# Must exit 0

# Test against mealmap (has viewer/)
./benchmark/scorer.sh examples/mealmap/ 2>/dev/null
[[ -f examples/mealmap/scores.json ]] && echo "scores.json created" || echo "FAIL: no scores.json"

# Test against taskflow (no viewer/)
./benchmark/scorer.sh examples/taskflow/ 2>/dev/null
[[ -f examples/taskflow/scores.json ]] && echo "scores.json created" || echo "FAIL: no scores.json"

# Verify docs
[[ -f docs/benchmark/05_scoring.md ]] && echo "05_scoring.md exists" || echo "FAIL"
```
