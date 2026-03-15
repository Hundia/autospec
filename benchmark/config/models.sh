#!/usr/bin/env bash
# Model defaults — override with environment variables

export CLAUDE_MODEL="${CLAUDE_MODEL:-claude-sonnet-4-20250514}"
export GPT_MODEL="${GPT_MODEL:-gpt-4o}"
export BENCHMARK_RUNS="${BENCHMARK_RUNS:-3}"
