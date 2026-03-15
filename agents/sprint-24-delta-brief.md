# Sprint 24 Delta Brief — Harness + Model Invocations (24.7 + 24.8 + 24.9)

**Agent:** Sonnet
**Sprint:** 24 Delta (14 pts, 3 tickets: 24.7, 24.8, 24.9)
**Theme:** Implement the main benchmark harness script and model-specific invocation logic

---

## Working Directory

`/opt/FitnessAiManager/autospec/`

---

## Context: What Already Exists

- `benchmark/lib/common.sh` — full shared library with `log_*`, `strip_ansi`, `prepare_quickstart()`, `write_metadata()`, `run_model()` dispatcher, `DRY_RUN` support
- `benchmark/config/models.sh` — env var defaults (`CLAUDE_MODEL`, `GPT_MODEL`, `BENCHMARK_RUNS`)
- `benchmark/config/quality-gates.json` — 28 gates definition
- `benchmark/lib/models/claude.sh` — `invoke_model()` using `claude -p`
- `benchmark/lib/models/gpt.sh` — `invoke_model()` using `opencode run`
- `benchmark/prompts/baseline-template.txt` — prompt template with `{{QUICKSTART_CONTENT}}` placeholder
- `benchmark/harness.sh` — STUB (needs full implementation)
- `benchmark/scorer.sh` — STUB (another agent implements this)

---

## Ticket 24.7: Implement `harness.sh run-all` (8 pts)

Replace the stub `benchmark/harness.sh` with the full implementation.

### Script Structure

```bash
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
# Parse: run-all, --runs N, --models "claude,gpt", --target /path/to/project

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

  # Prepare QUICKSTART once
  local quickstart_file
  quickstart_file=$(prepare_quickstart "/tmp/QUICKSTART-combined-${run_date}.md")

  # Read and fill prompt template
  local template_file="${SCRIPT_DIR}/prompts/baseline-template.txt"
  if [[ ! -f "$template_file" ]]; then
    log_error "Prompt template not found: $template_file"
    exit 1
  fi

  local quickstart_content
  quickstart_content=$(cat "$quickstart_file")

  # For each model
  IFS=',' read -ra MODEL_LIST <<< "$MODELS"
  for model in "${MODEL_LIST[@]}"; do
    model=$(echo "$model" | tr -d ' ')
    log_info "═══ Running model: $model ═══"

    for ((run=1; run<=RUNS; run++)); do
      log_info "── Run $run of $RUNS for $model ──"

      local model_run_dir="${run_dir}/${model}/run-${run}"
      mkdir -p "$model_run_dir"

      # 1. Copy target project to temp dir
      local temp_dir="/tmp/benchmark-${model}-${run}-${run_date}"
      rm -rf "$temp_dir"
      cp -r "$TARGET_DIR" "$temp_dir"
      log_info "Copied target to $temp_dir"

      # 2. Fill prompt template
      local filled_prompt_file="${model_run_dir}/filled-prompt.txt"
      sed "s|{{QUICKSTART_CONTENT}}|${quickstart_content}|" "$template_file" > "$filled_prompt_file"
      # Note: sed may fail with large content. Use awk instead:
      awk -v content="$quickstart_content" '{gsub(/\{\{QUICKSTART_CONTENT\}\}/, content)}1' "$template_file" > "$filled_prompt_file"

      # 3. Invoke model
      local start_time
      start_time=$(date +%s)

      run_model "$model" "$filled_prompt_file" "$temp_dir" \
        > "${model_run_dir}/output.log" 2>&1 || true

      local end_time
      end_time=$(date +%s)

      # 4. Copy generated output from temp dir to results
      cp -r "$temp_dir"/* "$model_run_dir/" 2>/dev/null || true

      # 5. Write metadata
      local model_id
      case "$model" in
        claude) model_id="${CLAUDE_MODEL}" ;;
        gpt) model_id="${GPT_MODEL}" ;;
        *) model_id="$model" ;;
      esac
      write_metadata "$model_run_dir" "$model_id" "$filled_prompt_file" "$start_time" "$end_time"

      local elapsed=$(( end_time - start_time ))
      log_success "Run $run for $model completed in ${elapsed}s"

      # Cleanup temp dir
      rm -rf "$temp_dir"
    done

    # Auto-score this model's runs
    if [[ -f "${SCRIPT_DIR}/scorer.sh" ]] && head -5 "${SCRIPT_DIR}/scorer.sh" | grep -q "score_project"; then
      log_info "Auto-scoring ${model} runs..."
      for ((run=1; run<=RUNS; run++)); do
        "${SCRIPT_DIR}/scorer.sh" "${run_dir}/${model}/run-${run}/" 2>/dev/null || true
      done
      # Aggregate
      "${SCRIPT_DIR}/scorer.sh" --aggregate "${run_dir}/${model}/" 2>/dev/null || true
    fi
  done

  log_success "Benchmark complete: $run_dir"
  echo "$run_dir"
}
```

### IMPORTANT: Template substitution

The `{{QUICKSTART_CONTENT}}` substitution is tricky because the QUICKSTART is hundreds of lines. Do NOT use `sed` for this — use a method that handles multi-line content safely:

```bash
fill_template() {
  local template_file="$1" quickstart_file="$2" output_file="$3"
  # Use Python for reliable multi-line substitution
  python3 -c "
import sys
template = open('$template_file').read()
quickstart = open('$quickstart_file').read()
result = template.replace('{{QUICKSTART_CONTENT}}', quickstart)
open('$output_file', 'w').write(result)
"
}
```

### Argument parsing

Support these invocations:
```bash
./harness.sh run-all                          # defaults: 3 runs, claude+gpt, taskflow
./harness.sh run-all --runs 5                 # 5 runs per model
./harness.sh run-all --models "claude"        # Claude only
./harness.sh run-all --target ../examples/mealmap  # different target
DRY_RUN=true ./harness.sh run-all             # no API calls
```

---

## Ticket 24.8: Enhance Claude invocation (3 pts)

Update `benchmark/lib/models/claude.sh` to be more robust:

```bash
#!/usr/bin/env bash
# Claude model invocation — sourced by common.sh run_model()

invoke_model() {
  local prompt_file="$1" work_dir="$2"
  local prompt
  prompt=$(cat "$prompt_file")

  log_info "Invoking Claude (model: ${CLAUDE_MODEL}) in ${work_dir}"
  log_info "Prompt length: $(wc -c < "$prompt_file") bytes"

  cd "$work_dir"

  # Claude -p runs in the current directory, reads filesystem natively
  local output
  output=$(claude -p "$prompt" \
    --model "${CLAUDE_MODEL}" \
    --allowedTools "Edit,Write,Read,Bash,Glob,Grep" \
    2>&1) || {
    log_error "Claude invocation failed (exit code: $?)"
    echo "$output"
    return 1
  }

  echo "$output"

  # Try to extract token usage if available in output
  if echo "$output" | grep -q "tokens"; then
    log_info "Token info found in output (check output.log for details)"
  fi
}
```

---

## Ticket 24.9: Enhance GPT invocation (3 pts)

Update `benchmark/lib/models/gpt.sh` to be more robust:

```bash
#!/usr/bin/env bash
# GPT model invocation via OpenCode CLI — sourced by common.sh run_model()

invoke_model() {
  local prompt_file="$1" work_dir="$2"
  local prompt
  prompt=$(cat "$prompt_file")

  log_info "Invoking GPT (model: ${GPT_MODEL}) via OpenCode in ${work_dir}"
  log_info "Prompt length: $(wc -c < "$prompt_file") bytes"

  # OpenCode run with directory context
  # --dir gives the model filesystem access to the working directory
  local output
  output=$(opencode run \
    -m "${GPT_MODEL}" \
    --dir "$work_dir" \
    "$prompt" \
    2>&1) || {
    log_error "OpenCode/GPT invocation failed (exit code: $?)"
    echo "$output" | strip_ansi
    return 1
  }

  # Strip ANSI codes from output (OpenCode may include color codes)
  echo "$output" | strip_ansi

  # Try to extract token usage if available
  if echo "$output" | grep -qi "token"; then
    log_info "Token info found in output (check output.log for details)"
  fi
}
```

---

## Backlog Update

After completing all 3 tickets, update `specs/backlog.md`:
- 24.7: `🔲` → `✅`
- 24.8: `🔲` → `✅`
- 24.9: `🔲` → `✅`

---

## Verification

```bash
bash -n benchmark/harness.sh
bash -n benchmark/lib/models/claude.sh
bash -n benchmark/lib/models/gpt.sh
# All must exit 0
```
