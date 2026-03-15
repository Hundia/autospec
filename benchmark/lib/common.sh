#!/usr/bin/env bash
# AutoSpec Benchmark — Common Library
# Source this file: source "$(dirname "$0")/lib/common.sh"

set -euo pipefail

# ── Dependency check ──
if ! command -v jq &>/dev/null; then
  echo "[ERROR] jq is required but not installed. Install with: apt-get install jq" >&2
  exit 1
fi

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

  log_info "Combined QUICKSTART written to $output_file ($(wc -l < "$output_file") lines)" >&2
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
