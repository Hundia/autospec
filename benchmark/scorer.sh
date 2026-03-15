#!/usr/bin/env bash
# AutoSpec Benchmark — Scoring Engine
# Evaluates a project directory against quality-gates.json
#
# Usage:
#   ./scorer.sh <results_dir>           # harness results dir (has output.log)
#   ./scorer.sh <project_dir>           # raw AutoSpec project dir
#   ./scorer.sh --aggregate <model_dir> # aggregate scores from run-N/scores.json files

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source common library (provides log_info, log_error, log_success, log_warn, BENCHMARK_DIR, QUALITY_GATES_JSON)
source "${SCRIPT_DIR}/lib/common.sh"

# ── Constants ──
AGGREGATE_MODE=false
TARGET_ARG=""

# ── Argument Parsing ──
if [[ $# -lt 1 ]]; then
  echo "Usage: $0 [--aggregate] <directory>" >&2
  exit 1
fi

if [[ "$1" == "--aggregate" ]]; then
  AGGREGATE_MODE=true
  if [[ $# -lt 2 ]]; then
    log_error "--aggregate requires a model directory argument"
    exit 1
  fi
  TARGET_ARG="$2"
else
  TARGET_ARG="$1"
fi

# ── Resolve absolute path ──
if [[ ! -d "$TARGET_ARG" ]]; then
  log_error "Directory not found: $TARGET_ARG"
  exit 1
fi
TARGET_ARG="$(cd "$TARGET_ARG" && pwd)"

# ════════════════════════════════════════════════════════════
# AGGREGATE MODE
# ════════════════════════════════════════════════════════════
if [[ "$AGGREGATE_MODE" == "true" ]]; then
  MODEL_DIR="$TARGET_ARG"

  # Find all run-N/scores.json files
  mapfile -t SCORE_FILES < <(find "$MODEL_DIR" -maxdepth 2 -name "scores.json" | sort)

  if [[ ${#SCORE_FILES[@]} -eq 0 ]]; then
    log_error "No scores.json files found under $MODEL_DIR"
    exit 1
  fi

  log_info "Aggregating ${#SCORE_FILES[@]} score files from $MODEL_DIR"

  # Collect gate IDs from first file
  GATE_IDS=$(jq -r '.gates | keys[]' "${SCORE_FILES[0]}" | sort)
  CATEGORY_IDS=$(jq -r '.categories | keys[]' "${SCORE_FILES[0]}" | sort)

  # Use a temp file for intermediate data
  TMP_AGG=$(mktemp)

  # Pure jq/bash aggregate approach
  {
    echo "{"
    echo "  \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\","
    echo "  \"model_dir\": \"$MODEL_DIR\","
    echo "  \"run_count\": ${#SCORE_FILES[@]},"

    # Gates aggregate
    echo "  \"gates\": {"
    FIRST_GATE=true
    while IFS= read -r gate_id; do
      [[ -z "$gate_id" ]] && continue
      # Collect scores across runs
      SCORES=$(jq -r --arg g "$gate_id" '.gates[$g].score // 0' "${SCORE_FILES[@]}" | tr '\n' ' ')
      read -ra SCORE_ARR <<< "$SCORES"
      N=${#SCORE_ARR[@]}
      SUM=0
      MIN="${SCORE_ARR[0]:-0}"
      MAX="${SCORE_ARR[0]:-0}"
      for s in "${SCORE_ARR[@]}"; do
        SUM=$(echo "$SUM + $s" | bc -l)
        [[ "$(echo "$s < $MIN" | bc -l)" == "1" ]] && MIN="$s"
        [[ "$(echo "$s > $MAX" | bc -l)" == "1" ]] && MAX="$s"
      done
      MEAN=$(echo "scale=4; $SUM / $N" | bc -l)
      # Stddev
      VARIANCE=0
      for s in "${SCORE_ARR[@]}"; do
        DIFF=$(echo "($s - $MEAN)^2" | bc -l)
        VARIANCE=$(echo "$VARIANCE + $DIFF" | bc -l)
      done
      STDDEV=$(echo "scale=4; sqrt($VARIANCE / $N)" | bc -l)

      # Status counts (|| true prevents grep exit-1 when no matches)
      PASS_COUNT=$(jq -r --arg g "$gate_id" '.gates[$g].status' "${SCORE_FILES[@]}" | { grep -c "^PASS$" || true; })
      MAX_SCORE=$(jq -r --arg g "$gate_id" '.gates[$g].max_score // 0' "${SCORE_FILES[0]}")

      [[ "$FIRST_GATE" == "false" ]] && echo ","
      FIRST_GATE=false
      printf '    "%s": {"mean": %s, "min": %s, "max": %s, "stddev": %s, "max_score": %s, "pass_count": %d, "run_count": %d}' \
        "$gate_id" "$MEAN" "$MIN" "$MAX" "$STDDEV" "$MAX_SCORE" "$PASS_COUNT" "$N"
    done <<< "$GATE_IDS"
    echo ""
    echo "  },"

    # Categories aggregate
    echo "  \"categories\": {"
    FIRST_CAT=true
    while IFS= read -r cat_id; do
      [[ -z "$cat_id" ]] && continue
      CAT_SCORES=$(jq -r --arg c "$cat_id" '.categories[$c].weighted_score // 0' "${SCORE_FILES[@]}" | tr '\n' ' ')
      read -ra CAT_ARR <<< "$CAT_SCORES"
      N=${#CAT_ARR[@]}
      SUM=0
      MIN="${CAT_ARR[0]:-0}"
      MAX="${CAT_ARR[0]:-0}"
      for s in "${CAT_ARR[@]}"; do
        SUM=$(echo "$SUM + $s" | bc -l)
        [[ "$(echo "$s < $MIN" | bc -l)" == "1" ]] && MIN="$s"
        [[ "$(echo "$s > $MAX" | bc -l)" == "1" ]] && MAX="$s"
      done
      MEAN=$(echo "scale=4; $SUM / $N" | bc -l)
      VARIANCE=0
      for s in "${CAT_ARR[@]}"; do
        DIFF=$(echo "($s - $MEAN)^2" | bc -l)
        VARIANCE=$(echo "$VARIANCE + $DIFF" | bc -l)
      done
      STDDEV=$(echo "scale=4; sqrt($VARIANCE / $N)" | bc -l)

      [[ "$FIRST_CAT" == "false" ]] && echo ","
      FIRST_CAT=false
      printf '    "%s": {"mean_weighted_score": %s, "min": %s, "max": %s, "stddev": %s}' \
        "$cat_id" "$MEAN" "$MIN" "$MAX" "$STDDEV"
    done <<< "$CATEGORY_IDS"
    echo ""
    echo "  },"

    # Overall aggregate
    OVERALL_SCORES=$(jq -r '.overall.normalized_score // 0' "${SCORE_FILES[@]}" | tr '\n' ' ')
    read -ra OVR_ARR <<< "$OVERALL_SCORES"
    N=${#OVR_ARR[@]}
    SUM=0
    MIN="${OVR_ARR[0]:-0}"
    MAX="${OVR_ARR[0]:-0}"
    for s in "${OVR_ARR[@]}"; do
      SUM=$(echo "$SUM + $s" | bc -l)
      [[ "$(echo "$s < $MIN" | bc -l)" == "1" ]] && MIN="$s"
      [[ "$(echo "$s > $MAX" | bc -l)" == "1" ]] && MAX="$s"
    done
    MEAN=$(echo "scale=4; $SUM / $N" | bc -l)
    VARIANCE=0
    for s in "${OVR_ARR[@]}"; do
      DIFF=$(echo "($s - $MEAN)^2" | bc -l)
      VARIANCE=$(echo "$VARIANCE + $DIFF" | bc -l)
    done
    STDDEV=$(echo "scale=4; sqrt($VARIANCE / $N)" | bc -l)

    echo "  \"overall\": {"
    echo "    \"mean\": $MEAN,"
    echo "    \"min\": $MIN,"
    echo "    \"max\": $MAX,"
    echo "    \"stddev\": $STDDEV,"
    echo "    \"run_count\": $N"
    echo "  }"
    echo "}"
  } > "${MODEL_DIR}/aggregate-scores.json"

  rm -f "$TMP_AGG"
  log_success "Aggregate written to ${MODEL_DIR}/aggregate-scores.json"

  echo ""
  echo "════════════════════════════════════════════"
  echo "  AGGREGATE RESULTS: $MODEL_DIR"
  echo "════════════════════════════════════════════"
  echo "  Runs: ${#SCORE_FILES[@]}"
  MEAN_SCORE=$(jq -r '.overall.mean' "${MODEL_DIR}/aggregate-scores.json")
  STDDEV_SCORE=$(jq -r '.overall.stddev' "${MODEL_DIR}/aggregate-scores.json")
  printf "  Overall: %.1f ± %.1f\n" "$MEAN_SCORE" "$STDDEV_SCORE"
  echo "════════════════════════════════════════════"
  exit 0
fi

# ════════════════════════════════════════════════════════════
# SINGLE DIRECTORY SCORING MODE
# ════════════════════════════════════════════════════════════
TARGET_DIR="$TARGET_ARG"

# Determine mode: harness results (has output.log) or raw project
MODE="standalone"
if [[ -f "${TARGET_DIR}/output.log" ]]; then
  MODE="harness"
fi

log_info "Scoring mode: $MODE"
log_info "Target directory: $TARGET_DIR"

# ── Check Type Implementations ──

# check_file_exists: all listed paths must exist
# Returns 0 (pass) or 1 (fail)
check_file_exists() {
  local target_dir="$1"
  shift
  local all_ok=true
  for path in "$@"; do
    if [[ ! -f "${target_dir}/${path}" ]]; then
      all_ok=false
      break
    fi
  done
  [[ "$all_ok" == "true" ]]
}

# check_directory_exists: directory must exist
check_directory_exists() {
  local target_dir="$1" path="$2"
  [[ -d "${target_dir}/${path}" ]]
}

# check_regex: grep pattern in files
# Args: target_dir pattern files_glob min_matches inverse
check_regex() {
  local target_dir="$1" pattern="$2" files_glob="$3" min_matches="${4:-1}" inverse="${5:-false}"
  local count=0
  # Use glob expansion carefully
  local glob_pattern="${target_dir}/${files_glob}"
  for file in $glob_pattern; do
    [[ -f "$file" ]] || continue
    local matches
    matches=$(grep -cE "$pattern" "$file" 2>/dev/null || true)
    matches=${matches:-0}; matches=${matches//[^0-9]/}; matches=${matches:-0}
    count=$((count + matches))
  done
  if [[ "$inverse" == "true" ]]; then
    [[ $count -eq 0 ]]
  else
    [[ $count -ge $min_matches ]]
  fi
}

# check_content_match: at least N patterns found in files
# Args: target_dir files_glob min_matches patterns...
check_content_match() {
  local target_dir="$1" files_glob="$2" min_matches="${3:-1}"
  shift 3
  local patterns=("$@")
  local found=0
  local glob_pattern="${target_dir}/${files_glob}"
  for file in $glob_pattern; do
    [[ -f "$file" ]] || continue
    for pattern in "${patterns[@]}"; do
      if grep -ql "$pattern" "$file" 2>/dev/null; then
        found=$((found + 1))
      fi
    done
  done
  [[ $found -ge $min_matches ]]
}

# check_file_count: count directories matching glob
# Args: target_dir glob min_count
check_file_count() {
  local target_dir="$1" glob="$2" min_count="$3"
  local count
  # Count directories matching the glob
  count=$(find "${target_dir}" -maxdepth 2 -mindepth 1 -type d -path "${target_dir}/${glob%/}*" 2>/dev/null | wc -l)
  [[ $count -ge $min_count ]]
}

# check_line_count: average lines per file >= min_lines
# Args: target_dir files_glob min_lines
check_line_count() {
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

# ── Graded Gate Implementations ──
# Each returns a score 0-3 via echo

grade_spc05_avg_spec_length() {
  local target_dir="$1"
  local total=0 file_count=0
  for file in "${target_dir}"/specs/0*.md; do
    [[ -f "$file" ]] || continue
    local lines
    lines=$(wc -l < "$file")
    total=$((total + lines))
    file_count=$((file_count + 1))
  done
  if [[ $file_count -eq 0 ]]; then
    echo 0; return
  fi
  local avg=$((total / file_count))
  if [[ $avg -ge 300 ]]; then
    echo 3
  elif [[ $avg -ge 100 ]]; then
    echo 2
  elif [[ $avg -ge 50 ]]; then
    echo 1
  else
    echo 0
  fi
}

grade_sdd02_definition_of_done() {
  local target_dir="$1"
  local backlog="${target_dir}/specs/backlog.md"
  [[ -f "$backlog" ]] || { echo 0; return; }

  # Check for DoD quality levels
  # Level 3: references specs (specs/0N_ pattern)
  if grep -qE "specs/0[0-9]_" "$backlog" 2>/dev/null; then
    echo 3; return
  fi
  # Level 2: has actionable DoD language (acceptance criteria, must, shall, verify)
  if grep -qiE "acceptance criteria|must |shall |verify|definition of done|DoD" "$backlog" 2>/dev/null; then
    echo 2; return
  fi
  # Level 1: any DoD-like content (done when, complete when)
  if grep -qiE "done when|complete when|deliverable|output:|result:" "$backlog" 2>/dev/null; then
    echo 1; return
  fi
  echo 0
}

grade_coh01_entity_consistency() {
  local target_dir="$1"
  # Extract capitalized nouns (2+ chars) from spec files
  # Count how many appear in 3+ files
  local spec_files=()
  for f in "${target_dir}"/specs/0*.md; do
    [[ -f "$f" ]] && spec_files+=("$f")
  done
  [[ ${#spec_files[@]} -eq 0 ]] && { echo 0; return; }

  # Extract candidate entity words (capitalized, 3+ chars)
  local entities_file
  entities_file=$(mktemp)
  for f in "${spec_files[@]}"; do
    grep -oE '\b[A-Z][a-z]{2,}[a-zA-Z]*\b' "$f" 2>/dev/null >> "$entities_file" || true
  done

  # Get unique entities
  local unique_entities
  unique_entities=$(sort -u "$entities_file")
  rm -f "$entities_file"

  # Count how many entities appear in 3+ spec files
  local consistent_count=0
  while IFS= read -r entity; do
    [[ -z "$entity" ]] && continue
    # Skip common English words
    case "$entity" in
      The|And|For|With|This|That|From|Into|When|Where|What|How|Are|Has|Have|Not|All|Each|Any|Can|May|Will|Must|Should|Would|Could|Also|Only|Both|More|Some|Such|Most|Other|Same|Than|Then|Too|Very|Which|While|After|Before|Under|Over|About|Above|Below|Through|Between|During|Within|Without|Against|Across|Along|Around|Behind|Beside|Between|Beyond|Inside|Outside|Unless|Until|Upon|Whether|Yet|Thus|Hence|Since|Though|Because|Although|However|Therefore|Moreover|Furthermore|Additionally|Consequently|Nevertheless|Nonetheless|Meanwhile|Otherwise|Similarly|Specifically|Generally|Currently|Previously|Typically|Usually|Often|Always|Never|Sometimes|Recently|Initially|Finally|Basically|Essentially|Primarily|Mainly|Simply|Clearly|Exactly|Particularly|Especially|Certainly|Definitely|Probably|Possibly|Actually|Already|Even|Just|Still|Again|Back|Down|Here|There|Now|Then|Where|When|Why|How|Who|What|Which) continue ;;
    esac
    local file_count=0
    for f in "${spec_files[@]}"; do
      if grep -ql "\b${entity}\b" "$f" 2>/dev/null; then file_count=$((file_count + 1)); fi
    done
    [[ $file_count -ge 3 ]] && consistent_count=$((consistent_count + 1))
  done <<< "$unique_entities"

  if [[ $consistent_count -ge 10 ]]; then
    echo 3
  elif [[ $consistent_count -ge 6 ]]; then
    echo 2
  elif [[ $consistent_count -ge 3 ]]; then
    echo 1
  else
    echo 0
  fi
}

grade_coh02_endpoint_overlap() {
  local target_dir="$1"
  local backend_spec="${target_dir}/specs/02_backend_lead.md"
  local qa_spec="${target_dir}/specs/05_qa_engineer.md"

  if [[ ! -f "$backend_spec" ]] || [[ ! -f "$qa_spec" ]]; then
    echo 0; return
  fi

  # Extract /api/ paths
  local backend_endpoints
  backend_endpoints=$(grep -oE '/(api/[a-zA-Z0-9/_:-]+|[a-zA-Z0-9/_:-]*\b)' "$backend_spec" 2>/dev/null | grep "api" | sort -u | head -50)
  local qa_endpoints
  qa_endpoints=$(grep -oE '/(api/[a-zA-Z0-9/_:-]+|[a-zA-Z0-9/_:-]*\b)' "$qa_spec" 2>/dev/null | grep "api" | sort -u | head -50)

  local backend_count
  backend_count=$(echo "$backend_endpoints" | grep -c "." 2>/dev/null || echo 0)
  local qa_count
  qa_count=$(echo "$qa_endpoints" | grep -c "." 2>/dev/null || echo 0)

  if [[ $backend_count -eq 0 ]] || [[ $qa_count -eq 0 ]]; then
    echo 0; return
  fi

  # Count overlap (backend endpoints that appear in qa spec)
  local overlap=0
  while IFS= read -r ep; do
    [[ -z "$ep" ]] && continue
    if echo "$qa_endpoints" | grep -qF "$ep" 2>/dev/null; then
      overlap=$((overlap + 1))
    fi
  done <<< "$backend_endpoints"

  local ratio
  ratio=$(echo "scale=4; $overlap / $backend_count" | bc -l 2>/dev/null || echo "0")

  if [[ "$(echo "$ratio >= 0.5" | bc -l 2>/dev/null || echo 0)" == "1" ]]; then
    echo 3
  elif [[ "$(echo "$ratio >= 0.25" | bc -l 2>/dev/null || echo 0)" == "1" ]]; then
    echo 2
  elif [[ "$(echo "$ratio > 0" | bc -l 2>/dev/null || echo 0)" == "1" ]]; then
    echo 1
  else
    echo 0
  fi
}

grade_coh03_table_overlap() {
  local target_dir="$1"
  local backend_spec="${target_dir}/specs/02_backend_lead.md"
  local db_spec="${target_dir}/specs/04_db_architect.md"

  if [[ ! -f "$backend_spec" ]] || [[ ! -f "$db_spec" ]]; then
    echo 0; return
  fi

  # Extract table names (CREATE TABLE, model names, etc.)
  local db_tables
  db_tables=$(grep -oiE '(CREATE TABLE\s+["`]?[a-zA-Z_]+|Table:\s*[a-zA-Z_]+|\b[A-Z][a-zA-Z]+Table\b|`[a-zA-Z_]+`\s+table)' "$db_spec" 2>/dev/null | \
    grep -oE '[a-zA-Z_]{3,}' | grep -vE '^(CREATE|TABLE|table|CREATE|INDEX|ALTER)$' | sort -u)
  local backend_content
  backend_content=$(cat "$backend_spec" 2>/dev/null || echo "")

  local db_count
  db_count=$(echo "$db_tables" | grep -c "." 2>/dev/null || echo 0)
  [[ $db_count -eq 0 ]] && { echo 0; return; }

  local found=0
  while IFS= read -r tbl; do
    [[ -z "$tbl" ]] && continue
    if echo "$backend_content" | grep -qi "\b${tbl}\b" 2>/dev/null; then found=$((found + 1)); fi
  done <<< "$db_tables"

  local ratio
  ratio=$(echo "scale=4; $found / $db_count" | bc -l 2>/dev/null || echo "0")

  if [[ "$(echo "$ratio >= 0.5" | bc -l 2>/dev/null || echo 0)" == "1" ]]; then
    echo 3
  elif [[ "$(echo "$ratio >= 0.25" | bc -l 2>/dev/null || echo 0)" == "1" ]]; then
    echo 2
  elif [[ "$(echo "$ratio > 0" | bc -l 2>/dev/null || echo 0)" == "1" ]]; then
    echo 1
  else
    echo 0
  fi
}

grade_coh04_cross_refs_resolve() {
  local target_dir="$1"
  local total=0 resolved=0
  # Find all specs/0X_ references in spec files
  for f in "${target_dir}"/specs/*.md; do
    [[ -f "$f" ]] || continue
    while IFS= read -r ref; do
      [[ -z "$ref" ]] && continue
      total=$((total + 1))
      # Extract just the filename/path portion
      local ref_path
      ref_path=$(echo "$ref" | grep -oE 'specs/[a-zA-Z0-9_./]+\.md' | head -1)
      if [[ -n "$ref_path" ]] && [[ -f "${target_dir}/${ref_path}" ]]; then
        resolved=$((resolved + 1))
      fi
    done < <(grep -oE 'specs/0[0-9]_[a-zA-Z0-9_]+\.md' "$f" 2>/dev/null || true)
  done

  [[ $total -eq 0 ]] && { echo 1; return; }  # No refs = minimal but not zero
  local ratio
  ratio=$(echo "scale=4; $resolved / $total" | bc -l 2>/dev/null || echo "0")

  if [[ "$(echo "$ratio >= 0.75" | bc -l 2>/dev/null || echo 0)" == "1" ]]; then
    echo 3
  elif [[ "$(echo "$ratio >= 0.5" | bc -l 2>/dev/null || echo 0)" == "1" ]]; then
    echo 2
  elif [[ "$(echo "$ratio >= 0.25" | bc -l 2>/dev/null || echo 0)" == "1" ]]; then
    echo 1
  else
    echo 0
  fi
}

grade_tc02_circular_deps() {
  local target_dir="$1"
  local backlog="${target_dir}/specs/backlog.md"
  [[ -f "$backlog" ]] || { echo 3; return; }  # No backlog = assume no cycles

  # Extract ticket IDs and their dependencies from backlog
  # Pattern: | SPRINT.N | ... | DEPS | ...
  # Look for dependency references like "24.1, 24.2" or "Deps: 24.1"
  # Simple heuristic: check if any ticket depends on something that depends on it
  # For simplicity, check if Depends-on columns reference forward items that create obvious cycles
  # A full graph analysis requires more infrastructure; use a heuristic

  # Count tickets that have explicit dependency references
  local has_deps
  has_deps=$(grep -cE '\|\s*[0-9]+\.[0-9]+.*\|\s*[0-9]+\.[0-9]+\s*\|' "$backlog" 2>/dev/null || true)
  has_deps=${has_deps:-0}; has_deps=${has_deps//[^0-9]/}; has_deps=${has_deps:-0}

  # Check for any obvious self-references (ticket depends on itself)
  local self_refs=0
  while IFS= read -r line; do
    [[ -z "$line" ]] && continue
    # Extract ticket ID and deps column (very simplified)
    local ticket_id
    ticket_id=$(echo "$line" | grep -oE '^\|\s*[0-9]+\.[0-9]+' | grep -oE '[0-9]+\.[0-9]+' | head -1)
    if [[ -n "$ticket_id" ]]; then
      # Check if deps column contains the same ID
      if echo "$line" | grep -qE "\|\s*${ticket_id}\s*\|" 2>/dev/null; then
        self_refs=$((self_refs + 1))
      fi
    fi
  done < <(grep -E '^\|\s*[0-9]+\.[0-9]+' "$backlog" 2>/dev/null || true)

  if [[ $self_refs -gt 0 ]]; then
    echo 0
  else
    echo 3
  fi
}

grade_tc04_internal_links() {
  local target_dir="$1"
  local total=0 valid=0

  # Find all docs/ and specs/ references in spec files
  for f in "${target_dir}"/specs/*.md; do
    [[ -f "$f" ]] || continue
    while IFS= read -r ref; do
      [[ -z "$ref" ]] && continue
      total=$((total + 1))
      if [[ -f "${target_dir}/${ref}" ]] || [[ -d "${target_dir}/${ref}" ]]; then
        valid=$((valid + 1))
      fi
    done < <(grep -oE '(docs|specs)/[a-zA-Z0-9_./]+\.(md|json|sh|ts|js)' "$f" 2>/dev/null || true)
  done

  [[ $total -eq 0 ]] && { echo 1; return; }
  local ratio
  ratio=$(echo "scale=4; $valid / $total" | bc -l 2>/dev/null || echo "0")

  if [[ "$(echo "$ratio >= 0.8" | bc -l 2>/dev/null || echo 0)" == "1" ]]; then
    echo 3
  elif [[ "$(echo "$ratio >= 0.5" | bc -l 2>/dev/null || echo 0)" == "1" ]]; then
    echo 2
  elif [[ "$(echo "$ratio > 0" | bc -l 2>/dev/null || echo 0)" == "1" ]]; then
    echo 1
  else
    echo 0
  fi
}

grade_vwr03_visualization_count() {
  local target_dir="$1"
  local count=0
  local viz_keywords="chart|graph|diagram|dashboard|histogram|heatmap|treemap|gantt|timeline|sparkline|scatter|bar chart|pie chart|line graph|visualization|visualisation"
  for f in "${target_dir}"/specs/*.md; do
    [[ -f "$f" ]] || continue
    local matches
    matches=$(grep -ciE "$viz_keywords" "$f" 2>/dev/null || true)
    matches=${matches:-0}; matches=${matches//[^0-9]/}; matches=${matches:-0}
    count=$((count + matches))
  done
  if [[ $count -ge 5 ]]; then
    echo 3
  elif [[ $count -ge 3 ]]; then
    echo 2
  elif [[ $count -ge 1 ]]; then
    echo 1
  else
    echo 0
  fi
}

# ── Evaluate a Single Gate ──
# Outputs: gate_id status score max_score details
evaluate_gate() {
  local gate_id="$1"
  local target_dir="$2"

  # Extract gate config from JSON
  local gate_json
  gate_json=$(jq -r --arg id "$gate_id" '
    .categories | to_entries[] |
    .value.gates[] |
    select(.id == $id)
  ' "$QUALITY_GATES_JSON")

  local check_type
  check_type=$(echo "$gate_json" | jq -r '.check_type')
  local conditional
  conditional=$(echo "$gate_json" | jq -r '.conditional')
  local max_score
  max_score=$(echo "$gate_json" | jq -r '.weight // 1')

  # Handle conditional gates
  if [[ "$conditional" == "true" ]]; then
    local cond_type
    cond_type=$(echo "$gate_json" | jq -r '.condition.type')
    local cond_path
    cond_path=$(echo "$gate_json" | jq -r '.condition.path')
    if [[ "$cond_type" == "directory_exists" ]]; then
      if [[ ! -d "${target_dir}/${cond_path}" ]]; then
        echo "${gate_id} SKIPPED 0 0 Condition not met: ${cond_path} not found"
        return 0
      fi
    fi
  fi

  local status="FAIL"
  local score=0
  local details=""

  case "$check_type" in
    file_exists)
      # Extract paths array
      local paths
      paths=$(echo "$gate_json" | jq -r '.check_config.paths[]')
      local all_found=true
      local found_count=0
      local total_count=0
      while IFS= read -r p; do
        [[ -z "$p" ]] && continue
        total_count=$((total_count + 1))
        if [[ -f "${target_dir}/${p}" ]]; then
          found_count=$((found_count + 1))
        else
          all_found=false
        fi
      done <<< "$paths"
      if [[ "$all_found" == "true" ]]; then
        status="PASS"
        score=$max_score
        details="${found_count}/${total_count} files found"
      else
        details="${found_count}/${total_count} files found"
      fi
      ;;

    directory_exists)
      local dir_path
      dir_path=$(echo "$gate_json" | jq -r '.check_config.path')
      if check_directory_exists "$target_dir" "$dir_path"; then
        status="PASS"
        score=$max_score
        details="Directory exists: ${dir_path}"
      else
        details="Directory not found: ${dir_path}"
      fi
      ;;

    regex)
      # Get config fields; handle both 'paths' array and 'pattern'
      local pattern
      pattern=$(echo "$gate_json" | jq -r '.check_config.pattern')
      local inverse
      inverse=$(echo "$gate_json" | jq -r '.check_config.inverse // "false"')
      local min_count
      min_count=$(echo "$gate_json" | jq -r '.check_config.min_count // 1')
      # paths can be a string or array
      local paths_type
      paths_type=$(echo "$gate_json" | jq -r '.check_config.paths | type')

      if [[ "$paths_type" == "array" ]]; then
        local total_matches=0
        local files_checked=0
        while IFS= read -r p; do
          [[ -z "$p" ]] && continue
          # p may be a glob like specs/*.md
          for f in ${target_dir}/${p}; do
            [[ -f "$f" ]] || continue
            files_checked=$((files_checked + 1))
            local m
            m=$(grep -cE "$pattern" "$f" 2>/dev/null || true)
            m=${m:-0}; m=${m//[^0-9]/}; m=${m:-0}
            total_matches=$((total_matches + m))
          done
        done < <(echo "$gate_json" | jq -r '.check_config.paths[]')
        if [[ "$inverse" == "true" ]]; then
          if [[ $total_matches -eq 0 ]]; then
            status="PASS"; score=$max_score
            details="No matches found (inverse check passed)"
          else
            details="Found ${total_matches} unwanted matches"
          fi
        else
          if [[ $total_matches -ge $min_count ]]; then
            status="PASS"; score=$max_score
            details="Found ${total_matches} matches (min: ${min_count})"
          else
            details="Found ${total_matches} matches (min: ${min_count})"
          fi
        fi
      else
        # paths is a string glob
        local files_glob
        files_glob=$(echo "$gate_json" | jq -r '.check_config.paths')
        if check_regex "$target_dir" "$pattern" "$files_glob" "$min_count" "$inverse"; then
          status="PASS"; score=$max_score
          details="Regex check passed"
        else
          details="Regex check failed: ${pattern}"
        fi
      fi
      ;;

    content_match)
      local paths_type
      paths_type=$(echo "$gate_json" | jq -r '.check_config.paths | type')
      local min_matches
      min_matches=$(echo "$gate_json" | jq -r '.check_config.min_matches // 1')
      local found=0

      if [[ "$paths_type" == "array" ]]; then
        # Try terms array first, fall back to patterns
        local terms_key
        terms_key=$(echo "$gate_json" | jq -r 'if .check_config.terms then "terms" else "patterns" end')
        local terms
        terms=$(echo "$gate_json" | jq -r ".check_config.${terms_key}[]?" 2>/dev/null || echo "")

        while IFS= read -r p; do
          [[ -z "$p" ]] && continue
          for f in ${target_dir}/${p}; do
            [[ -f "$f" ]] || continue
            while IFS= read -r term; do
              [[ -z "$term" ]] && continue
              if grep -qi "$term" "$f" 2>/dev/null; then
                found=$((found + 1))
              fi
            done <<< "$terms"
          done
        done < <(echo "$gate_json" | jq -r '.check_config.paths[]')
      fi

      if [[ $found -ge $min_matches ]]; then
        status="PASS"; score=$max_score
        details="Found ${found} term matches (min: ${min_matches})"
      else
        details="Found ${found} term matches (min: ${min_matches})"
      fi
      ;;

    file_count)
      local glob
      glob=$(echo "$gate_json" | jq -r '.check_config.glob')
      local min_count
      min_count=$(echo "$gate_json" | jq -r '.check_config.min_count')
      # Count actual subdirectories under the docs/ path
      local base_path
      base_path=$(echo "$gate_json" | jq -r '.check_config.path')
      local count
      count=$(find "${target_dir}/${base_path}" -maxdepth 1 -mindepth 1 -type d 2>/dev/null | wc -l)
      if [[ $count -ge $min_count ]]; then
        status="PASS"; score=$max_score
        details="${count} subdirectories found (min: ${min_count})"
      else
        details="${count} subdirectories found (min: ${min_count})"
      fi
      ;;

    line_count)
      local files_glob
      files_glob=$(echo "$gate_json" | jq -r '.check_config.files')
      local min_lines
      min_lines=$(echo "$gate_json" | jq -r '.check_config.min_lines')
      if check_line_count "$target_dir" "$files_glob" "$min_lines"; then
        status="PASS"; score=$max_score
        details="Average line count >= ${min_lines}"
      else
        details="Average line count < ${min_lines}"
      fi
      ;;

    graded)
      local metric
      metric=$(echo "$gate_json" | jq -r '.check_config.metric')
      local grade_score=0
      local grade_details=""

      case "$metric" in
        avg_line_count)
          grade_score=$(grade_spc05_avg_spec_length "$target_dir")
          local total=0 fc=0
          for f in "${target_dir}"/specs/0*.md; do
            [[ -f "$f" ]] || continue
            total=$((total + $(wc -l < "$f")))
            fc=$((fc + 1))
          done
          local avg=0
          [[ $fc -gt 0 ]] && avg=$((total / fc))
          grade_details="Average spec length: ${avg} lines (score: ${grade_score}/3)"
          ;;
        definition_of_done_quality)
          grade_score=$(grade_sdd02_definition_of_done "$target_dir")
          grade_details="DoD quality score: ${grade_score}/3"
          ;;
        entity_consistency)
          grade_score=$(grade_coh01_entity_consistency "$target_dir")
          grade_details="Entity consistency across specs: ${grade_score}/3"
          ;;
        endpoint_overlap)
          grade_score=$(grade_coh02_endpoint_overlap "$target_dir")
          grade_details="Backend/QA endpoint overlap: ${grade_score}/3"
          ;;
        table_name_overlap)
          grade_score=$(grade_coh03_table_overlap "$target_dir")
          grade_details="DB table name overlap: ${grade_score}/3"
          ;;
        reference_resolution_rate)
          grade_score=$(grade_coh04_cross_refs_resolve "$target_dir")
          grade_details="Cross-file reference resolution: ${grade_score}/3"
          ;;
        circular_dependency_check)
          grade_score=$(grade_tc02_circular_deps "$target_dir")
          grade_details="Circular dependency check: ${grade_score}/3"
          ;;
        internal_link_validity)
          grade_score=$(grade_tc04_internal_links "$target_dir")
          grade_details="Internal link validity: ${grade_score}/3"
          ;;
        visualization_count)
          grade_score=$(grade_vwr03_visualization_count "$target_dir")
          grade_details="Visualization keywords found: ${grade_score}/3"
          ;;
        *)
          grade_score=0
          grade_details="Unknown metric: ${metric}"
          ;;
      esac

      status="GRADED"
      score=$grade_score
      # max_score for graded gates is 3
      max_score=3
      details="$grade_details"
      ;;

    *)
      status="UNKNOWN"
      details="Unknown check type: ${check_type}"
      ;;
  esac

  echo "${gate_id} ${status} ${score} ${max_score} ${details}"
}

# ── Main Scoring Loop ──
log_info "Loading quality gates from $QUALITY_GATES_JSON"

TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# Build gates results JSON
declare -A GATE_STATUS
declare -A GATE_SCORE
declare -A GATE_MAX
declare -A GATE_DETAILS

# Get all gate IDs in order
ALL_GATE_IDS=$(jq -r '.categories | to_entries[] | .value.gates[] | .id' "$QUALITY_GATES_JSON")

echo ""
echo "════════════════════════════════════════════════════════════"
printf "  AUTOSPEC SCORING ENGINE\n"
printf "  Target: %s\n" "$TARGET_DIR"
printf "  Mode:   %s\n" "$MODE"
echo "════════════════════════════════════════════════════════════"
echo ""
printf "%-10s %-8s %6s %6s  %s\n" "Gate ID" "Status" "Score" "Max" "Details"
printf "%-10s %-8s %6s %6s  %s\n" "-------" "------" "-----" "---" "-------"

while IFS= read -r gate_id; do
  [[ -z "$gate_id" ]] && continue

  result=$(evaluate_gate "$gate_id" "$TARGET_DIR")

  # Parse result: "gate_id status score max_score details..."
  read -r r_id r_status r_score r_max r_details_rest <<< "$result"

  GATE_STATUS[$gate_id]="$r_status"
  GATE_SCORE[$gate_id]="$r_score"
  GATE_MAX[$gate_id]="$r_max"
  GATE_DETAILS[$gate_id]="$r_details_rest"

  # Color output
  case "$r_status" in
    PASS)    COLOR="${GREEN}" ;;
    FAIL)    COLOR="${RED}" ;;
    GRADED)  COLOR="${YELLOW}" ;;
    SKIPPED) COLOR="${BLUE}" ;;
    *)       COLOR="${NC}" ;;
  esac

  printf "%-10s ${COLOR}%-8s${NC} %6s %6s  %s\n" \
    "$gate_id" "$r_status" "$r_score" "$r_max" "$r_details_rest"
done <<< "$ALL_GATE_IDS"

echo ""

# ── Category Subtotals ──
echo "════════════════════════════════════════════════════════════"
printf "  CATEGORY SUBTOTALS\n"
echo "════════════════════════════════════════════════════════════"

declare -A CAT_SCORE
declare -A CAT_MAX
declare -A CAT_WEIGHT
declare -A CAT_SKIPPED
declare -A CAT_WEIGHTED

ALL_CATEGORIES=$(jq -r '.categories | keys[]' "$QUALITY_GATES_JSON")

# Track active weight sum for normalization
TOTAL_ACTIVE_WEIGHT=0
TOTAL_WEIGHTED_SCORE=0

CATEGORIES_JSON="{"

FIRST_CAT=true
while IFS= read -r cat_id; do
  [[ -z "$cat_id" ]] && continue

  local_score=0
  local_max=0
  local_all_skipped=true
  cat_weight=$(jq -r --arg c "$cat_id" '.categories[$c].weight' "$QUALITY_GATES_JSON")

  while IFS= read -r gate_id; do
    [[ -z "$gate_id" ]] && continue
    g_score="${GATE_SCORE[$gate_id]:-0}"
    g_max="${GATE_MAX[$gate_id]:-0}"
    g_status="${GATE_STATUS[$gate_id]:-UNKNOWN}"

    if [[ "$g_status" != "SKIPPED" ]]; then
      local_all_skipped=false
      local_score=$((local_score + g_score))
      local_max=$((local_max + g_max))
    fi
  done < <(jq -r --arg c "$cat_id" '.categories[$c].gates[] | .id' "$QUALITY_GATES_JSON")

  CAT_SCORE[$cat_id]=$local_score
  CAT_MAX[$cat_id]=$local_max
  CAT_WEIGHT[$cat_id]=$cat_weight

  if [[ "$local_all_skipped" == "true" ]]; then
    CAT_SKIPPED[$cat_id]="true"
    cat_ratio="0"
    weighted="0"
    printf "  %-25s %6s / %6s  (weight: %2d%%) SKIPPED\n" \
      "$cat_id" "$local_score" "$local_max" "$cat_weight"
  else
    CAT_SKIPPED[$cat_id]="false"
    TOTAL_ACTIVE_WEIGHT=$((TOTAL_ACTIVE_WEIGHT + cat_weight))

    if [[ $local_max -gt 0 ]]; then
      cat_ratio=$(echo "scale=6; $local_score / $local_max" | bc -l)
      weighted=$(echo "scale=4; $cat_ratio * $cat_weight" | bc -l)
    else
      cat_ratio="0"
      weighted="0"
    fi
    TOTAL_WEIGHTED_SCORE=$(echo "scale=4; $TOTAL_WEIGHTED_SCORE + $weighted" | bc -l)
    CAT_WEIGHTED[$cat_id]="$weighted"
    printf "  %-25s %6s / %6s  (weight: %2d%%)  %.1f%%\n" \
      "$cat_id" "$local_score" "$local_max" "$cat_weight" \
      "$(echo "scale=1; $cat_ratio * 100" | bc -l)"
  fi

  [[ "$FIRST_CAT" == "false" ]] && CATEGORIES_JSON="${CATEGORIES_JSON},"
  FIRST_CAT=false

  if [[ "${CAT_SKIPPED[$cat_id]}" == "true" ]]; then
    CATEGORIES_JSON="${CATEGORIES_JSON}\"${cat_id}\":{\"score\":${local_score},\"max_score\":${local_max},\"weight\":${cat_weight},\"weighted_score\":0,\"skipped\":true}"
  else
    CATEGORIES_JSON="${CATEGORIES_JSON}\"${cat_id}\":{\"score\":${local_score},\"max_score\":${local_max},\"weight\":${cat_weight},\"weighted_score\":${weighted:-0},\"skipped\":false}"
  fi

done <<< "$ALL_CATEGORIES"

CATEGORIES_JSON="${CATEGORIES_JSON}}"

echo ""

# ── Overall Score ──
RAW_SCORE=0
RAW_MAX=0
for gate_id in "${!GATE_SCORE[@]}"; do
  s="${GATE_SCORE[$gate_id]:-0}"
  m="${GATE_MAX[$gate_id]:-0}"
  RAW_SCORE=$((RAW_SCORE + s))
  RAW_MAX=$((RAW_MAX + m))
done

# Normalized score: weighted_score / active_weight * 100
NORMALIZED="0"
if [[ $TOTAL_ACTIVE_WEIGHT -gt 0 ]]; then
  NORMALIZED=$(echo "scale=2; $TOTAL_WEIGHTED_SCORE / $TOTAL_ACTIVE_WEIGHT * 100" | bc -l)
fi

echo "════════════════════════════════════════════════════════════"
printf "  OVERALL SCORE\n"
echo "════════════════════════════════════════════════════════════"
printf "  Raw Score:         %d / %d\n" "$RAW_SCORE" "$RAW_MAX"
printf "  Active Weight:     %d%%\n" "$TOTAL_ACTIVE_WEIGHT"
printf "  Weighted Score:    %.2f / %d\n" "$TOTAL_WEIGHTED_SCORE" "$TOTAL_ACTIVE_WEIGHT"
printf "  Normalized Score:  %.1f / 100\n" "$NORMALIZED"
echo ""

# Score interpretation
NORM_INT=$(echo "$NORMALIZED" | cut -d. -f1)
if [[ $NORM_INT -ge 90 ]]; then
  printf "  ${GREEN}Rating: EXCELLENT — comprehensive, specific, well-cross-referenced${NC}\n"
elif [[ $NORM_INT -ge 75 ]]; then
  printf "  ${GREEN}Rating: GOOD — solid coverage, minor gaps${NC}\n"
elif [[ $NORM_INT -ge 60 ]]; then
  printf "  ${YELLOW}Rating: ADEQUATE — meets minimum structure, lacks depth${NC}\n"
else
  printf "  ${RED}Rating: POOR — significant gaps in structure or specificity${NC}\n"
fi
echo "════════════════════════════════════════════════════════════"
echo ""

# ── Build Gates JSON ──
GATES_JSON="{"
FIRST_GATE=true
while IFS= read -r gate_id; do
  [[ -z "$gate_id" ]] && continue
  g_status="${GATE_STATUS[$gate_id]:-UNKNOWN}"
  g_score="${GATE_SCORE[$gate_id]:-0}"
  g_max="${GATE_MAX[$gate_id]:-0}"
  # Escape details for JSON
  g_details="${GATE_DETAILS[$gate_id]:-}"
  g_details="${g_details//\"/\\\"}"

  [[ "$FIRST_GATE" == "false" ]] && GATES_JSON="${GATES_JSON},"
  FIRST_GATE=false
  GATES_JSON="${GATES_JSON}\"${gate_id}\":{\"status\":\"${g_status}\",\"score\":${g_score},\"max_score\":${g_max},\"details\":\"${g_details}\"}"
done <<< "$ALL_GATE_IDS"
GATES_JSON="${GATES_JSON}}"

# ── Write scores.json ──
SCORES_JSON="${TARGET_DIR}/scores.json"

cat > "$SCORES_JSON" <<JSON_EOF
{
  "timestamp": "${TIMESTAMP}",
  "target_dir": "${TARGET_DIR}",
  "mode": "${MODE}",
  "gates": ${GATES_JSON},
  "categories": ${CATEGORIES_JSON},
  "overall": {
    "raw_score": ${RAW_SCORE},
    "max_possible": ${RAW_MAX},
    "weighted_score": ${TOTAL_WEIGHTED_SCORE},
    "active_weight": ${TOTAL_ACTIVE_WEIGHT},
    "normalized_score": ${NORMALIZED}
  }
}
JSON_EOF

log_success "scores.json written to $SCORES_JSON"
