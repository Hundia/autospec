#!/usr/bin/env bash
# AutoSpec Benchmark Comparison Engine
# Usage: ./compare.sh <dir1> <dir2> [--output FILE]
#
# Accepts either model-level dirs (with aggregate-scores.json) or single run
# dirs (with scores.json). Writes a comparison.md to the parent of dir1, or
# to the file specified by --output.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "${SCRIPT_DIR}/lib/common.sh"

# ── Argument parsing ────────────────────────────────────────────────────────
DIR1="${1:?Usage: ./compare.sh <dir1> <dir2> [--output FILE]}"
DIR2="${2:?Usage: ./compare.sh <dir1> <dir2> [--output FILE]}"
OUTPUT_FILE=""

shift 2
while [[ $# -gt 0 ]]; do
  case "$1" in
    --output) OUTPUT_FILE="${2:?--output requires a filename}"; shift 2 ;;
    *) log_warn "Unknown argument: $1"; shift ;;
  esac
done

# Resolve to absolute paths
DIR1="$(cd "$DIR1" && pwd)"
DIR2="$(cd "$DIR2" && pwd)"

# ── Helper: locate scores file ───────────────────────────────────────────────
find_scores() {
  local dir="$1"
  if [[ -f "${dir}/aggregate-scores.json" ]]; then
    echo "${dir}/aggregate-scores.json"
  elif [[ -f "${dir}/scores.json" ]]; then
    echo "${dir}/scores.json"
  else
    local first_run
    first_run=$(find "$dir" -name "scores.json" -print -quit 2>/dev/null || true)
    if [[ -n "$first_run" ]]; then
      echo "$first_run"
    else
      log_error "No scores.json or aggregate-scores.json found in: $dir"
      return 1
    fi
  fi
}

# ── Helper: resolve model name ───────────────────────────────────────────────
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

# ── Helper: mean elapsed seconds across runs in a model dir ──────────────────
get_mean_elapsed() {
  local dir="$1"
  # Collect all metadata.json under dir
  local total=0 count=0
  while IFS= read -r meta; do
    local secs
    secs=$(jq -r '.elapsed_seconds // 0' "$meta" 2>/dev/null || echo 0)
    total=$(( total + secs ))
    count=$(( count + 1 ))
  done < <(find "$dir" -name "metadata.json" 2>/dev/null)

  if [[ $count -gt 0 ]]; then
    echo $(( total / count ))
  else
    echo "N/A"
  fi
}

# ── Helper: count files and lines in output directory ────────────────────────
get_output_stats() {
  local dir="$1"
  local file_count line_count
  file_count=$(find "$dir" -type f \( -name "*.md" -o -name "*.json" -o -name "*.sh" -o -name "*.ts" -o -name "*.py" \) 2>/dev/null | wc -l | tr -d ' ')
  line_count=$(find "$dir" -type f \( -name "*.md" -o -name "*.json" -o -name "*.sh" -o -name "*.ts" -o -name "*.py" \) 2>/dev/null -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}' || echo 0)
  echo "${file_count}:${line_count}"
}

# ── Helper: python3 arithmetic (avoids subshell bc dependency) ───────────────
py_calc() {
  python3 -c "print($1)" 2>/dev/null || echo "0"
}

# ── Main comparison ──────────────────────────────────────────────────────────
compare() {
  local scores1 scores2
  scores1=$(find_scores "$DIR1")
  scores2=$(find_scores "$DIR2")

  local model1 model2
  model1=$(get_model_name "$DIR1")
  model2=$(get_model_name "$DIR2")

  log_info "Comparing: ${model1} vs ${model2}"
  log_info "  Dir 1 scores: ${scores1}"
  log_info "  Dir 2 scores: ${scores2}"

  # ── Build output (using printf to avoid echo -e portability issues) ──────
  local out
  out=""

  # Header
  out+="# Benchmark Comparison: ${model1} vs ${model2}\n\n"
  out+="**Date:** $(date +%Y-%m-%d)\n"
  out+="**Dir 1:** \`${DIR1}\`\n"
  out+="**Dir 2:** \`${DIR2}\`\n"
  out+="**Scores 1:** \`${scores1}\`\n"
  out+="**Scores 2:** \`${scores2}\`\n\n"

  # ── Category scores table ────────────────────────────────────────────────
  out+="## Category Scores\n\n"
  out+="| Category | Weight | ${model1} | ${model2} | Delta |\n"
  out+="|----------|--------|$(printf -- '--------|'; printf -- '--------|')-------|\n"

  local categories=("structure" "specificity" "sdd_compliance" "coherence" "viewer" "technical_correctness")
  local max_delta_val=0
  local max_delta_cat=""

  for cat in "${categories[@]}"; do
    local s1 s2 weight
    s1=$(jq -r ".categories.${cat}.weighted_score // .categories.${cat}.mean_weighted_score // 0" "$scores1" 2>/dev/null || echo "0")
    s2=$(jq -r ".categories.${cat}.weighted_score // .categories.${cat}.mean_weighted_score // 0" "$scores2" 2>/dev/null || echo "0")
    weight=$(jq -r ".categories.${cat}.weight // 0" "$scores1" 2>/dev/null || echo "0")

    local delta abs_delta
    delta=$(py_calc "round(float(${s1}) - float(${s2}), 1)")
    abs_delta=$(py_calc "abs(float(${s1}) - float(${s2}))")

    # Track most discriminating category
    if python3 -c "exit(0 if float('${abs_delta}') > float('${max_delta_val}') else 1)" 2>/dev/null; then
      max_delta_val="$abs_delta"
      max_delta_cat="$cat"
    fi

    # Stddev column if aggregate scores
    local stddev1 stddev2
    stddev1=$(jq -r ".categories.${cat}.stddev_weighted_score // \"\"" "$scores1" 2>/dev/null || echo "")
    stddev2=$(jq -r ".categories.${cat}.stddev_weighted_score // \"\"" "$scores2" 2>/dev/null || echo "")

    local cell1 cell2
    if [[ -n "$stddev1" && "$stddev1" != "null" ]]; then
      cell1="${s1} ±${stddev1}"
    else
      cell1="${s1}"
    fi
    if [[ -n "$stddev2" && "$stddev2" != "null" ]]; then
      cell2="${s2} ±${stddev2}"
    else
      cell2="${s2}"
    fi

    out+="| ${cat} | ${weight} | ${cell1} | ${cell2} | ${delta} |\n"
  done

  # ── Overall scores ────────────────────────────────────────────────────────
  local overall1 overall2
  overall1=$(jq -r '.overall.normalized_score // .overall.weighted_score // .overall.mean_normalized_score // 0' "$scores1" 2>/dev/null || echo "0")
  overall2=$(jq -r '.overall.normalized_score // .overall.weighted_score // .overall.mean_normalized_score // 0' "$scores2" 2>/dev/null || echo "0")
  local overall_delta
  overall_delta=$(py_calc "round(float(${overall1}) - float(${overall2}), 1)")
  local abs_overall_delta
  abs_overall_delta=$(py_calc "abs(float(${overall1}) - float(${overall2}))")

  local stddev_overall1 stddev_overall2
  stddev_overall1=$(jq -r '.overall.stddev_normalized_score // ""' "$scores1" 2>/dev/null || echo "")
  stddev_overall2=$(jq -r '.overall.stddev_normalized_score // ""' "$scores2" 2>/dev/null || echo "")

  local overall_cell1 overall_cell2
  if [[ -n "$stddev_overall1" && "$stddev_overall1" != "null" ]]; then
    overall_cell1="${overall1} ±${stddev_overall1}"
  else
    overall_cell1="${overall1}"
  fi
  if [[ -n "$stddev_overall2" && "$stddev_overall2" != "null" ]]; then
    overall_cell2="${overall2} ±${stddev_overall2}"
  else
    overall_cell2="${overall2}"
  fi

  out+="\n## Overall Score\n\n"
  out+="| Metric | ${model1} | ${model2} | Delta |\n"
  out+="|--------|--------|--------|-------|\n"
  out+="| **Overall Score** | **${overall_cell1}** | **${overall_cell2}** | **${overall_delta}** |\n"

  # ── Execution metrics ─────────────────────────────────────────────────────
  local elapsed1 elapsed2
  elapsed1=$(get_mean_elapsed "$DIR1")
  elapsed2=$(get_mean_elapsed "$DIR2")

  local stats1 stats2
  stats1=$(get_output_stats "$DIR1")
  stats2=$(get_output_stats "$DIR2")
  local files1 lines1 files2 lines2
  files1="${stats1%%:*}"
  lines1="${stats1##*:}"
  files2="${stats2%%:*}"
  lines2="${stats2##*:}"

  out+="\n## Execution Metrics\n\n"
  out+="| Metric | ${model1} | ${model2} |\n"
  out+="|--------|--------|--------|\n"
  [[ "$elapsed1" != "N/A" ]] && out+="| Wall-clock time (mean) | ${elapsed1}s | ${elapsed2}s |\n" || out+="| Wall-clock time (mean) | N/A | N/A |\n"
  out+="| Output file count | ${files1} | ${files2} |\n"
  out+="| Total output lines | ${lines1} | ${lines2} |\n"

  # ── Most discriminating gates (top 3 by delta) ────────────────────────────
  out+="\n## Most Discriminating Gates (Top 3)\n\n"

  local gate_table
  gate_table=$(python3 - "$scores1" "$scores2" "$model1" "$model2" <<'PYEOF'
import json, sys

scores1_path, scores2_path, model1, model2 = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]

try:
    s1 = json.load(open(scores1_path))
    s2 = json.load(open(scores2_path))
except Exception as e:
    print(f"<!-- Could not load scores: {e} -->")
    sys.exit(0)

gates1 = s1.get("gates", {})
gates2 = s2.get("gates", {})
all_gates = set(list(gates1.keys()) + list(gates2.keys()))

deltas = []
for g in all_gates:
    sc1 = gates1.get(g, {}).get("score", 0)
    sc2 = gates2.get(g, {}).get("score", 0)
    delta = abs(sc1 - sc2)
    if delta > 0:
        winner = model1 if sc1 > sc2 else model2
        details = gates1.get(g, gates2.get(g, {})).get("details", "")
        description = gates1.get(g, gates2.get(g, {})).get("description", g)
        deltas.append((g, sc1, sc2, delta, winner, description, details))

deltas.sort(key=lambda x: -x[3])

if not deltas:
    print("_No gate-level data available — run scorer.sh first._")
    sys.exit(0)

print(f"| Gate | Description | {model1} | {model2} | Delta | Winner |")
print("|------|-------------|--------|--------|-------|--------|")
for g, sc1, sc2, d, w, desc, _ in deltas[:3]:
    short_desc = desc[:60] + "…" if len(desc) > 60 else desc
    print(f"| {g} | {short_desc} | {sc1} | {sc2} | {d:.1f} | {w} |")
PYEOF
2>/dev/null || echo "_Gate-level comparison requires Python 3._")

  out+="${gate_table}\n"

  # ── Qualitative samples for most discriminating category ──────────────────
  out+="\n## Qualitative Samples\n\n"
  out+="_First 10 lines of a representative file from the most discriminating category_"
  if [[ -n "$max_delta_cat" ]]; then
    out+=" (**${max_delta_cat}**, delta: ${max_delta_val})_\n\n"
  else
    out+=".\n\n"
  fi

  local sample_found=false
  for dir_var in "DIR1:$model1" "DIR2:$model2"; do
    local dir="${dir_var%%:*}"
    local label="${dir_var##*:}"
    eval "local the_dir=\"\$$dir\""

    # Try to find a relevant file for the most discriminating category
    local sample_file=""
    if [[ -n "$max_delta_cat" ]]; then
      sample_file=$(find "$the_dir" -type f -name "*.md" 2>/dev/null | \
        grep -i "$max_delta_cat" | head -1 || true)
    fi
    if [[ -z "$sample_file" ]]; then
      sample_file=$(find "$the_dir" -type f -name "*.md" 2>/dev/null | head -1 || true)
    fi

    if [[ -n "$sample_file" ]]; then
      out+="### ${label}: \`$(basename "$sample_file")\`\n\n"
      out+="\`\`\`\n"
      out+="$(head -10 "$sample_file" 2>/dev/null || echo "(file not readable)")\n"
      out+="\`\`\`\n\n"
      sample_found=true
    fi
  done

  if [[ "$sample_found" == "false" ]]; then
    out+="_Samples available after live benchmark runs — not generated in dry-run mode._\n"
  fi

  # ── Sprint 24B Decision Gate ───────────────────────────────────────────────
  out+="\n## Sprint 24B Decision Gate\n\n"

  local winner_label
  if python3 -c "exit(0 if float('${overall1}') >= float('${overall2}') else 1)" 2>/dev/null; then
    winner_label="$model1"
  else
    winner_label="$model2"
  fi

  out+="| Metric | Value |\n"
  out+="|--------|-------|\n"
  out+="| Score gap (absolute) | **${abs_overall_delta} points** |\n"
  out+="| Leading model | **${winner_label}** |\n"
  out+="| Most discriminating category | ${max_delta_cat:-N/A} (Δ ${max_delta_val}) |\n\n"

  if python3 -c "exit(0 if float('${abs_overall_delta}') > 15 else 1)" 2>/dev/null; then
    out+="**Score gap: ${abs_overall_delta} points (>15 threshold)**\n\n"
    out+="→ **Recommendation:** Sprint 24B should investigate multi-agent orchestration to close the gap.\n"
    out+="The ${abs_overall_delta}-point gap suggests systematic differences in how each model/CLI approaches\n"
    out+="spec-driven development. Multi-agent workflows (Orchestrator + Agents) may help the trailing model.\n"
  else
    out+="**Score gap: ${abs_overall_delta} points (≤15 threshold)**\n\n"
    out+="→ **Recommendation:** Sprint 24B should expand to harder projects (MealMap, E-Commerce) or test prompt sensitivity.\n"
    out+="Models are competitive on TaskFlow. Test on more complex targets to find meaningful differentiation.\n"
  fi

  # ── Footer ────────────────────────────────────────────────────────────────
  out+="\n---\n\n"
  out+="_Generated by AutoSpec benchmark/compare.sh on $(date -u '+%Y-%m-%dT%H:%M:%SZ')_\n"

  # ── Write output ──────────────────────────────────────────────────────────
  local dest
  if [[ -n "$OUTPUT_FILE" ]]; then
    dest="$OUTPUT_FILE"
  else
    local parent_dir
    parent_dir=$(dirname "$DIR1")
    dest="${parent_dir}/comparison.md"
  fi

  printf "%b" "$out" > "$dest"
  log_success "Comparison written to: $dest"
  echo "$dest"
}

compare
