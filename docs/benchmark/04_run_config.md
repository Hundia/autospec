---
title: Run Configuration Reference
sprint: "24"
created: "2026-03-15"
---

# Run Configuration Reference

This document describes the CLI invocations, environment variables, ANSI stripping, file-access parity design, and model version pinning for the benchmark harness.

**Related sprint:** Sprint 24 — `specs/backlog.md` §Sprint 24 ticket 24.6

---

## CLI Invocations

### Claude

```bash
claude -p "$PROMPT" --model $CLAUDE_MODEL --allowedTools "Edit,Write,Read,Bash,Glob,Grep"
```

Invoked from the benchmark working directory (`/tmp/benchmark-claude-{run}-{timestamp}/`). Claude's `--allowedTools` flag grants filesystem access via the listed tool types. Claude reads files natively from the working directory without requiring explicit attachment flags.

The `--model` flag pins the exact model version for reproducibility. Default: `$CLAUDE_MODEL` (see environment variables below).

### GPT (via OpenCode)

```bash
opencode run -m $GPT_MODEL --dir $WORK_DIR "$PROMPT"
```

Invoked from the autospec root directory. The `--dir` flag sets the working directory for OpenCode. File access behavior depends on OpenCode's implementation — see File Access Parity section below.

The `-m` flag pins the model. Default: `$GPT_MODEL` (see environment variables below).

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `$CLAUDE_MODEL` | `claude-sonnet-4-20250514` | Claude model version. Pin to an exact version ID for reproducibility. |
| `$GPT_MODEL` | `gpt-4o` | GPT model passed to OpenCode via `-m`. Override to `gpt-4.5` or newer when available. |
| `$BENCHMARK_RUNS` | `3` | Number of runs per model. Minimum 3 for variance statistics; 5+ for publication quality. |
| `$DRY_RUN` | _(unset)_ | Set to `true` to skip actual CLI invocation. `run_model()` writes mock output instead. Use for pipeline testing. |

All defaults are defined in `benchmark/config/models.sh`. Override by setting environment variables before invoking `harness.sh`:

```bash
CLAUDE_MODEL=claude-opus-4-20250514 BENCHMARK_RUNS=5 ./harness.sh run-all
```

---

## ANSI Stripping

GPT output via OpenCode may include ANSI color escape codes in its stdout. These codes interfere with scoring if the output is treated as plain text (e.g., regex matching on file content). All GPT output is stripped via:

```bash
sed 's/\x1b\[[0-9;]*m//g'
```

This is applied to `output.log` immediately after capture. Claude output does not typically require stripping, but the same filter is applied defensively for consistency.

The ANSI stripping is implemented in `benchmark/lib/common.sh` as the `strip_ansi()` function:

```bash
strip_ansi() {
  sed 's/\x1b\[[0-9;]*m//g'
}
```

---

## File Access Parity

File access is a documented confounding variable. The two CLIs differ in how they access the project filesystem:

| Aspect | Claude (`claude -p`) | GPT (OpenCode `opencode run`) |
|--------|---------------------|-------------------------------|
| Working directory | Invoked from `$WORK_DIR` | Set via `--dir $WORK_DIR` |
| File reads | Native via `Read`/`Glob`/`Grep` tools | Depends on OpenCode's `--dir` implementation |
| File writes | Native via `Write`/`Edit` tools | Depends on OpenCode's `--dir` implementation |
| Explicit attachment | Not required | May require `--file` flags for files outside `--dir` scope |

When `claude -p` is invoked from the benchmark working directory, it can read and write all project files using its native tool calls. This is the intended workflow.

For OpenCode, the `--dir` flag is intended to set the working directory, giving the model filesystem access equivalent to Claude's. If `--dir` does not expose the full filesystem (e.g., only the directory listing, not recursive reads), individual files may need to be attached via `--file` flags:

```bash
opencode run -m $GPT_MODEL \
  --dir $WORK_DIR \
  --file /tmp/QUICKSTART-combined.md \
  --file $WORK_DIR/requirements/project-brief.md \
  "$PROMPT"
```

**This is a documented confounding variable.** If OpenCode requires explicit `--file` attachments while Claude reads natively, GPT may receive less implicit context about the project structure. Sprint 24B includes a pre-flight spike (ticket 24.14) to verify actual behavior and update the harness accordingly.

Both CLIs are configured to have equivalent access by design. Observed behavioral differences should be noted in the run metadata and the comparison report.

---

## Model Version Pinning

For reproducible results, pin exact model version identifiers in environment variables. Default values are reasonable starting points:

| Model | Default | Notes |
|-------|---------|-------|
| Claude | `claude-sonnet-4-20250514` | Sonnet 4 (2025-05-14 snapshot). Override to Opus for higher capability at higher cost. |
| GPT | `gpt-4o` | GPT-4o. Override to `gpt-4.5` or GPT-5 series when available. User override documented as preferred for benchmark comparisons. |

Model IDs change as new versions are released. Always check the CLI's supported model list before a benchmark run:

```bash
claude --list-models          # Claude
opencode models list          # OpenCode/GPT
```

When publishing benchmark results, always include the exact model version used. Results from different model versions are not directly comparable.

---

## DRY_RUN Mode

Set `DRY_RUN=true` to test the entire pipeline without making actual API calls:

```bash
DRY_RUN=true ./harness.sh run-all
```

In dry-run mode, `run_model()` writes `echo "mock output"` to `output.log` instead of invoking the CLI. The rest of the pipeline (metadata capture, `scorer.sh` invocation, directory structure) runs normally. This is useful for:

- Verifying harness setup and directory structure
- Testing `scorer.sh` against mock output
- CI/CD pipeline validation without incurring API costs

The `scorer.sh` will evaluate the mock output directories and emit scores (likely all failing, since mock output contains no spec files). This is expected behavior in dry-run mode.

---

## Metadata Capture

Each run writes a `metadata.json` file alongside `output.log`:

```json
{
  "model": "claude-sonnet-4-20250514",
  "cli": "claude",
  "cli_version": "1.2.x",
  "prompt_sha256": "abc123...",
  "timestamp": "2026-03-15T12:00:00Z",
  "run_index": 1,
  "total_runs": 3,
  "env": {
    "CLAUDE_MODEL": "claude-sonnet-4-20250514",
    "GPT_MODEL": "gpt-4o",
    "BENCHMARK_RUNS": "3",
    "DRY_RUN": "false"
  }
}
```

The `prompt_sha256` is the SHA256 of the filled prompt (after `{{QUICKSTART_CONTENT}}` substitution). This ensures the exact prompt used is traceable across runs and can be verified for consistency.
