#!/usr/bin/env bash
# GPT model invocation via OpenCode CLI — sourced by common.sh run_model()

invoke_model() {
  local prompt_file="$1" work_dir="$2"
  local prompt
  prompt=$(cat "$prompt_file")

  log_info "Invoking GPT (model: ${GPT_MODEL}) via OpenCode in ${work_dir}"
  log_info "Prompt length: $(wc -c < "$prompt_file") bytes"

  # opencode run with --dir gives the model filesystem access to the working directory.
  # Output may contain ANSI color codes; strip_ansi removes them for clean logs.
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

  # Strip ANSI codes from successful output as well
  echo "$output" | strip_ansi

  # Report token usage if present in output
  if echo "$output" | grep -qi "token"; then
    log_info "Token info found in output (check output.log for details)"
  fi
}
