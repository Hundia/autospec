#!/usr/bin/env bash
# AutoSpec Benchmark Harness
# Usage: ./harness.sh run-all [--runs N] [--models "claude,gpt"] [--target DIR]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "${SCRIPT_DIR}/lib/common.sh"

# ── Defaults ──
RUNS="${BENCHMARK_RUNS:-3}"
MODELS="claude,gpt"
TARGET_DIR="${SCRIPT_DIR}/../examples/taskflow"
RESULTS_BASE="${SCRIPT_DIR}/results"

# ── Argument Parsing ──
CMD=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    run-all)
      CMD="run-all"
      shift
      ;;
    --runs)
      RUNS="$2"
      shift 2
      ;;
    --models)
      MODELS="$2"
      shift 2
      ;;
    --target)
      TARGET_DIR="$2"
      shift 2
      ;;
    *)
      log_error "Unknown argument: $1"
      echo "Usage: $0 run-all [--runs N] [--models \"claude,gpt\"] [--target DIR]" >&2
      exit 1
      ;;
  esac
done

# ── Template Substitution ──
fill_template() {
  local template_file="$1" quickstart_file="$2" output_file="$3"
  # Use Python for reliable multi-line substitution (sed fails with large content)
  python3 - "$template_file" "$quickstart_file" "$output_file" <<'PYEOF'
import sys
template = open(sys.argv[1]).read()
quickstart = open(sys.argv[2]).read()
result = template.replace('{{QUICKSTART_CONTENT}}', quickstart)
open(sys.argv[3], 'w').write(result)
PYEOF
}

# ── Main: run-all ──
run_all() {
  local run_date
  run_date=$(date +%Y%m%d-%H%M%S)
  local run_dir="${RESULTS_BASE}/run-${run_date}"
  mkdir -p "$run_dir"

  log_info "Benchmark run: ${run_date}"
  log_info "Models: ${MODELS}"
  log_info "Runs per model: ${RUNS}"
  log_info "Target: ${TARGET_DIR}"
  log_info "DRY_RUN: ${DRY_RUN}"

  # Validate target directory exists
  if [[ ! -d "$TARGET_DIR" ]]; then
    log_error "Target directory not found: $TARGET_DIR"
    exit 1
  fi

  # Prepare QUICKSTART once (shared across all model runs)
  local quickstart_file
  quickstart_file=$(prepare_quickstart "/tmp/QUICKSTART-combined-${run_date}.md")

  # Validate prompt template
  local template_file="${SCRIPT_DIR}/prompts/baseline-template.txt"
  if [[ ! -f "$template_file" ]]; then
    log_error "Prompt template not found: $template_file"
    exit 1
  fi

  # Iterate over each model
  IFS=',' read -ra MODEL_LIST <<< "$MODELS"
  for model in "${MODEL_LIST[@]}"; do
    model=$(echo "$model" | tr -d ' ')
    log_info "═══ Running model: $model ═══"

    for ((run=1; run<=RUNS; run++)); do
      log_info "── Run $run of $RUNS for $model ──"

      local model_run_dir="${run_dir}/${model}/run-${run}"
      mkdir -p "$model_run_dir"

      # 1. Copy target project to a fresh temp directory
      local temp_dir="/tmp/benchmark-${model}-${run}-${run_date}"
      rm -rf "$temp_dir"
      cp -r "$TARGET_DIR" "$temp_dir"
      log_info "Copied target to $temp_dir"

      # 2. Fill prompt template with QUICKSTART content (Python-based, multi-line safe)
      local filled_prompt_file="${model_run_dir}/filled-prompt.txt"
      fill_template "$template_file" "$quickstart_file" "$filled_prompt_file"
      log_info "Filled prompt written to $filled_prompt_file ($(wc -c < "$filled_prompt_file") bytes)"

      # 3. Invoke model and capture output + timing
      local start_time
      start_time=$(date +%s)

      run_model "$model" "$filled_prompt_file" "$temp_dir" \
        > "${model_run_dir}/output.log" 2>&1 || true

      local end_time
      end_time=$(date +%s)

      # 4. Copy generated output from temp dir to results (preserves model's work)
      cp -r "$temp_dir"/. "$model_run_dir/" 2>/dev/null || true

      # 5. Write metadata.json
      local model_id
      case "$model" in
        claude) model_id="${CLAUDE_MODEL}" ;;
        gpt)    model_id="${GPT_MODEL}" ;;
        *)      model_id="$model" ;;
      esac
      write_metadata "$model_run_dir" "$model_id" "$filled_prompt_file" "$start_time" "$end_time"

      local elapsed=$(( end_time - start_time ))
      log_success "Run $run for $model completed in ${elapsed}s → $model_run_dir"

      # Cleanup temp dir
      rm -rf "$temp_dir"
    done

    # Auto-score this model's runs if scorer.sh is implemented
    if [[ -f "${SCRIPT_DIR}/scorer.sh" ]] && grep -q "Scoring Engine\|score_gate\|QUALITY_GATES" "${SCRIPT_DIR}/scorer.sh"; then
      log_info "Auto-scoring ${model} runs..."
      for ((run=1; run<=RUNS; run++)); do
        "${SCRIPT_DIR}/scorer.sh" "${run_dir}/${model}/run-${run}/" 2>/dev/null || true
      done
      # Aggregate scores across runs for this model
      "${SCRIPT_DIR}/scorer.sh" --aggregate "${run_dir}/${model}/" 2>/dev/null || true
    else
      log_warn "scorer.sh not yet implemented — skipping auto-score for ${model}"
    fi
  done

  log_success "Benchmark complete: $run_dir"
  echo "$run_dir"
}

# ── Dispatch ──
case "$CMD" in
  run-all)
    run_all
    ;;
  "")
    log_error "No command specified."
    echo "Usage: $0 run-all [--runs N] [--models \"claude,gpt\"] [--target DIR]" >&2
    exit 1
    ;;
  *)
    log_error "Unknown command: $CMD"
    exit 1
    ;;
esac
