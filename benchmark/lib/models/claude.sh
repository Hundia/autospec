#!/usr/bin/env bash
# Claude model invocation — sourced by common.sh run_model()

invoke_model() {
  local prompt_file="$1" work_dir="$2"
  local prompt
  prompt=$(cat "$prompt_file")

  log_info "Invoking Claude (model: ${CLAUDE_MODEL}) in ${work_dir}"
  log_info "Prompt length: $(wc -c < "$prompt_file") bytes"

  cd "$work_dir"

  # claude -p runs in the current directory, reads filesystem natively.
  # --allowedTools grants the model the same tools used in interactive mode.
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

  # Report token usage if present in output
  if echo "$output" | grep -q "tokens"; then
    log_info "Token info found in output (check output.log for details)"
  fi
}
