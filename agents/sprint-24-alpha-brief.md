# Sprint 24 Alpha Brief — Foundation (24.1 + 24.2 + 24.3)

**Agent:** Sonnet
**Sprint:** 24 Alpha (12 pts, 3 tickets: 24.1, 24.2, 24.3)
**Theme:** Create the entire `benchmark/` skeleton, quality gates JSON, and shared bash library

---

## CRITICAL: Working Directory

All paths are relative to `/opt/FitnessAiManager/autospec/`.

---

## Ticket 24.1: Create `benchmark/` directory skeleton (2 pts)

Create this directory structure:

```
benchmark/
├── config/
│   ├── quality-gates.json
│   └── models.sh
├── lib/
│   ├── common.sh
│   └── models/
│       ├── claude.sh
│       └── gpt.sh
├── prompts/
│   └── (baseline-template.txt — created by another agent later)
├── results/
│   └── .gitkeep
├── harness.sh          (stub — implemented later)
├── scorer.sh           (stub — implemented later)
├── compare.sh          (stub — implemented later)
└── README.md           (stub — implemented later)
```

For the stubs (`harness.sh`, `scorer.sh`, `compare.sh`, `README.md`), create minimal placeholder files:
- Shell scripts: `#!/usr/bin/env bash` + comment `# Implemented in Sprint 24 Phase C/D/E`
- README.md: `# Benchmark Harness\n\nFull documentation in Sprint 24 Phase E.`

Mark all shell scripts as executable: `chmod +x benchmark/*.sh benchmark/lib/common.sh benchmark/lib/models/*.sh`

**Status:** Set to ✅ in `specs/backlog.md` when done.

---

## Ticket 24.2: Define `config/quality-gates.json` (5 pts)

Create `benchmark/config/quality-gates.json` with exactly **28 gates** across **6 categories**.

### JSON Structure

```json
{
  "version": "1.0",
  "total_gates": 28,
  "categories": {
    "structure": { "weight": 20, "gates": [...] },
    "specificity": { "weight": 20, "gates": [...] },
    "sdd_compliance": { "weight": 25, "gates": [...] },
    "coherence": { "weight": 15, "gates": [...] },
    "viewer": { "weight": 10, "gates": [...] },
    "technical_correctness": { "weight": 10, "gates": [...] }
  }
}
```

### Gate Object Schema

```json
{
  "id": "STR-01",
  "category": "structure",
  "description": "10 spec files exist in specs/",
  "weight": 1,
  "check_type": "file_exists",
  "check_config": { "paths": ["specs/01_product_manager.md", "specs/02_backend_lead.md", ...] },
  "conditional": false
}
```

`check_type` values: `file_exists`, `content_match`, `regex`, `line_count`, `graded`, `directory_exists`, `file_count`

### The 28 Gates

**Structure (6 gates, weight 20%):**
1. `STR-01`: 10 spec files exist (`specs/01_product_manager.md` through `specs/10_ui_designer.md`) — `file_exists`
2. `STR-02`: `specs/backlog.md` has 2+ sprint sections — `regex` pattern `## Sprint \d+` count >= 2
3. `STR-03`: `docs/` has 8+ subdirectories — `file_count` on `docs/*/` >= 8
4. `STR-04`: `prompts/` directory exists — `directory_exists`
5. `STR-05`: `CLAUDE.md` exists in project root — `file_exists`
6. `STR-06`: `agents/` directory exists — `directory_exists`

**Specificity (5 gates, weight 20%):**
7. `SPC-01`: No `[insert here]`, `[TODO]`, `[TBD]`, `<placeholder>` in spec files — `regex` (inverse match)
8. `SPC-02`: Spec files contain project-specific references (entity names from requirements) — `content_match`
9. `SPC-03`: Specs contain concrete examples (real endpoint paths, table names) — `regex` for patterns like `/api/`, `CREATE TABLE`, `POST /`
10. `SPC-04`: Cross-references between specs exist (`See specs/0X_`) — `regex`
11. `SPC-05`: Average spec file length >100 lines — `graded` (0=<50, 1=50-99, 2=100-299, 3=300+)

**SDD Compliance (5 gates, weight 25%):**
12. `SDD-01`: Backlog uses status emojis (🔲, 🔄, ✅) — `regex`
13. `SDD-02`: Tickets have Definition of Done — `graded` (0=none, 1=exists, 2=actionable, 3=references specs)
14. `SDD-03`: Assumptions documented in specs — `content_match` for "Assumption" or "Constraint"
15. `SDD-04`: CLAUDE.md has tech stack + commands — `content_match` for patterns like `npm`, `docker`, `npx`
16. `SDD-05`: Ticket descriptions reference spec sections — `regex` for `specs/0\d_`

**Coherence (4 gates, weight 15%):**
17. `COH-01`: Entity names consistent across specs (mentioned in 3+ files) — `graded` (Jaccard-like)
18. `COH-02`: Backend endpoints match QA test targets — `graded`
19. `COH-03`: DB tables referenced in backend spec match DB architect spec — `graded`
20. `COH-04`: Cross-file references resolve (referenced files exist) — `graded`

**Viewer (4 gates, weight 10%, ALL conditional):**
21. `VWR-01`: Viewer is not a markdown reader — `content_match` (mentions React/Vue/Svelte/chart library) — `conditional: true`
22. `VWR-02`: Mentions visualization framework (Recharts/D3/Chart.js) — `content_match` — `conditional: true`
23. `VWR-03`: 5+ distinct visualizations specified — `graded` (0=0, 1=1-2, 2=3-4, 3=5+) — `conditional: true`
24. `VWR-04`: Interactive components specified (not just static renders) — `content_match` — `conditional: true`

**Technical Correctness (4 gates, weight 10%):**
25. `TC-01`: Valid markdown tables in specs (proper `|` delimiters, header separator) — `regex`
26. `TC-02`: No circular dependencies in backlog (ticket X depends on Y depends on X) — `graded`
27. `TC-03`: Consistent forward-slash paths (no backslash paths) — `regex` (inverse)
28. `TC-04`: Internal links/references use valid relative paths — `graded`

### Conditional Gate Logic

Viewer gates (VWR-01 to VWR-04) have `"conditional": true` and `"condition": { "type": "directory_exists", "path": "viewer/" }`. When `viewer/` doesn't exist, these gates are SKIPPED (not failed). The total weight redistributes proportionally among active categories.

**Status:** Set to ✅ in `specs/backlog.md` when done.

---

## Ticket 24.3: Create `benchmark/lib/common.sh` + model files (5 pts)

### `benchmark/lib/common.sh`

Full shared bash library. MUST be sourceable (not executable standalone).

```bash
#!/usr/bin/env bash
# AutoSpec Benchmark — Common Library
# Source this file: source "$(dirname "$0")/lib/common.sh"

set -euo pipefail

# ── Colors ──
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

# ── Globals ──
BENCHMARK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
QUALITY_GATES_JSON="${BENCHMARK_DIR}/config/quality-gates.json"
MODELS_CONFIG="${BENCHMARK_DIR}/config/models.sh"
DRY_RUN="${DRY_RUN:-false}"

# Source model defaults
source "${MODELS_CONFIG}"

# ── Logging ──
log_info()    { echo -e "${BLUE}[INFO]${NC} $*"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; }
log_success() { echo -e "${GREEN}[OK]${NC} $*"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }

# ── Utilities ──
strip_ansi() { sed 's/\x1b\[[0-9;]*m//g'; }

elapsed_seconds() {
  local start_time="$1"
  local end_time
  end_time=$(date +%s)
  echo $(( end_time - start_time ))
}

write_json_field() {
  # Usage: write_json_field file.json "key" "value"
  local file="$1" key="$2" value="$3"
  if [[ ! -f "$file" ]]; then
    echo "{}" > "$file"
  fi
  local tmp
  tmp=$(mktemp)
  jq --arg k "$key" --arg v "$value" '. + {($k): $v}' "$file" > "$tmp" && mv "$tmp" "$file"
}

# ── QUICKSTART Preparation ──
prepare_quickstart() {
  # Concatenates quickstart/01-07 into a single file
  local output_file="${1:-/tmp/QUICKSTART-combined.md}"
  local quickstart_dir="${BENCHMARK_DIR}/../quickstart"

  if [[ ! -d "$quickstart_dir" ]]; then
    log_error "quickstart/ directory not found at $quickstart_dir"
    return 1
  fi

  > "$output_file"  # truncate
  for part in "$quickstart_dir"/0{1,2,3,4,5,6,7}-*.md; do
    if [[ -f "$part" ]]; then
      echo -e "\n---\n" >> "$output_file"
      cat "$part" >> "$output_file"
    fi
  done

  log_info "Combined QUICKSTART written to $output_file ($(wc -l < "$output_file") lines)"
  echo "$output_file"
}

# ── Metadata ──
write_metadata() {
  # Usage: write_metadata <output_dir> <model_id> <prompt_file> <start_time> <end_time>
  local output_dir="$1" model_id="$2" prompt_file="$3" start_time="$4" end_time="$5"
  local metadata_file="${output_dir}/metadata.json"
  local prompt_sha256
  prompt_sha256=$(sha256sum "$prompt_file" | cut -d' ' -f1)
  local elapsed
  elapsed=$(( end_time - start_time ))

  cat > "$metadata_file" <<METADATA_EOF
{
  "model": "$model_id",
  "prompt_sha256": "$prompt_sha256",
  "timestamp_start": "$start_time",
  "timestamp_end": "$end_time",
  "elapsed_seconds": $elapsed,
  "dry_run": $DRY_RUN,
  "benchmark_runs": ${BENCHMARK_RUNS:-3},
  "cli_version": "$(get_cli_version "$model_id")",
  "env": {
    "CLAUDE_MODEL": "${CLAUDE_MODEL:-unset}",
    "GPT_MODEL": "${GPT_MODEL:-unset}",
    "BENCHMARK_RUNS": "${BENCHMARK_RUNS:-3}"
  }
}
METADATA_EOF
  log_info "Metadata written to $metadata_file"
}

get_cli_version() {
  local model="$1"
  case "$model" in
    claude*|anthropic*) claude --version 2>/dev/null || echo "unknown" ;;
    gpt*|openai*|github*) opencode version 2>/dev/null || echo "unknown" ;;
    *) echo "unknown" ;;
  esac
}

# ── Model Dispatcher ──
run_model() {
  # Usage: run_model <model_name> <prompt_file> <work_dir>
  local model_name="$1" prompt_file="$2" work_dir="$3"

  if [[ "$DRY_RUN" == "true" ]]; then
    log_warn "DRY_RUN mode — skipping actual model invocation for $model_name"
    echo "# DRY_RUN: mock output for $model_name"
    echo "# Would invoke $model_name with prompt from $prompt_file"
    echo "# Working directory: $work_dir"
    return 0
  fi

  local model_script="${BENCHMARK_DIR}/lib/models/${model_name}.sh"
  if [[ ! -f "$model_script" ]]; then
    log_error "No model script found for '$model_name' at $model_script"
    return 1
  fi

  source "$model_script"
  invoke_model "$prompt_file" "$work_dir"
}
```

### `benchmark/config/models.sh`

```bash
#!/usr/bin/env bash
# Model defaults — override with environment variables

export CLAUDE_MODEL="${CLAUDE_MODEL:-claude-sonnet-4-20250514}"
export GPT_MODEL="${GPT_MODEL:-gpt-4o}"
export BENCHMARK_RUNS="${BENCHMARK_RUNS:-3}"
```

### `benchmark/lib/models/claude.sh`

```bash
#!/usr/bin/env bash
# Claude model invocation — sourced by common.sh run_model()

invoke_model() {
  local prompt_file="$1" work_dir="$2"
  local prompt
  prompt=$(cat "$prompt_file")

  log_info "Invoking Claude (model: ${CLAUDE_MODEL}) in ${work_dir}"

  cd "$work_dir"
  claude -p "$prompt" \
    --model "${CLAUDE_MODEL}" \
    --allowedTools "Edit,Write,Read,Bash,Glob,Grep" \
    2>&1
}
```

### `benchmark/lib/models/gpt.sh`

```bash
#!/usr/bin/env bash
# GPT model invocation via OpenCode CLI — sourced by common.sh run_model()

invoke_model() {
  local prompt_file="$1" work_dir="$2"
  local prompt
  prompt=$(cat "$prompt_file")

  log_info "Invoking GPT (model: ${GPT_MODEL}) via OpenCode in ${work_dir}"

  # OpenCode run with directory context and file attachments
  opencode run \
    -m "${GPT_MODEL}" \
    --dir "$work_dir" \
    "$prompt" \
    2>&1 | strip_ansi
}
```

### Implementation Notes

- All shell files must pass `bash -n` (syntax check)
- `common.sh` uses `${BASH_SOURCE[0]}` for self-location
- `jq` is required for JSON manipulation — add a check at top of common.sh
- Model scripts define `invoke_model()` function, sourced by `run_model()` dispatcher
- `DRY_RUN=true` skips actual CLI invocation, returns mock output

---

## Backlog Updates

After completing all 3 tickets, update `specs/backlog.md`:
- 24.1: `🔲` → `✅`
- 24.2: `🔲` → `✅`
- 24.3: `🔲` → `✅`

---

## Verification

Run these checks before reporting done:
```bash
bash -n benchmark/lib/common.sh
bash -n benchmark/config/models.sh
bash -n benchmark/lib/models/claude.sh
bash -n benchmark/lib/models/gpt.sh
python3 -c "import json; d=json.load(open('benchmark/config/quality-gates.json')); print(f'Gates: {d[\"total_gates\"]}')"
# Must output: Gates: 28
ls benchmark/results/.gitkeep
```
