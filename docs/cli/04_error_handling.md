---
title: Error Handling & Recovery
created: 2026-03-21
sprint: 29
status: complete
---

# Error Handling & Recovery

AutoSpec's error handling is designed around two principles: every error message must be specific, actionable, and contextual; and partial completion is always recoverable via the resume mechanism. This document covers the 8 failure modes, exit codes, error message quality rules, partial completion behavior, and retry caps.

---

## 8 Failure Modes

| # | Failure | Detection | Response | Retries |
|---|---------|-----------|----------|---------|
| 1 | Empty/truncated response | Output < 50 lines | Retry with same prompt | 2 |
| 2 | Missing YAML frontmatter | Frontmatter parse fails | Retry with augmented prompt (explicit frontmatter instruction added) | 1 |
| 3 | Missing required sections | Section-presence check fails | Retry with explicit section list injected into prompt | 1 |
| 4 | Provider timeout | Exceeds per-provider `timeoutMs` (120s for CLI, 60s for SDK) | Retry once, then halt with resume instructions | 1 |
| 5 | Provider auth failure | 401/403 HTTP or auth-related text in stderr | Halt immediately with re-auth instructions | 0 |
| 6 | Rate limit | 429 response or "rate limit" in stderr | Retry with exponential backoff | 2 |
| 7 | Budget exceeded | Cumulative cost > `--max-budget` | Halt, show progress achieved so far, suggest resume | 0 |
| 8 | Network error | Connection refused / DNS failure / socket timeout | Retry once after 2s delay | 1 |

**Total retry cap:** 5 retries across all specs per run. Once 5 retries are exhausted, the run halts with resume instructions regardless of which failure mode is active. This prevents infinite retry loops on a systematically failing provider.

---

## Exit Codes

Expanded from the original 0-3 to 0-7 for CI/CD pipeline differentiation. CI tools can inspect exit codes to decide whether to retry, alert, or fix configuration:

| Code | Description | CI Implication |
|------|-------------|----------------|
| 0 | Success — all specs generated | Pipeline continues |
| 1 | General error (unexpected / internal) | Alert: inspect logs |
| 2 | Invalid arguments or configuration | Fix: check command syntax |
| 3 | File not found — SRS path missing | Fix: check file path |
| 4 | No LLM provider available | Fix: install provider or set API key |
| 5 | Authentication failure | Alert: re-authenticate (do not auto-retry) |
| 6 | Budget exceeded — partial generation | Resume: run again with higher `--max-budget` or without cap |
| 7 | Provider timeout or network error | Retry: likely transient; run again |

**Why distinct codes matter (Architect 2 rationale):** A CI pipeline that gets exit code 7 (timeout) should retry automatically. A pipeline that gets exit code 5 (auth failure) should page on-call. A pipeline that gets exit code 4 (no provider) should file a ticket to configure the environment. Without distinct codes, all of these look like "error — check logs."

(Decision #14 — Architect 2)

---

## Error Message Quality Rules

Every error message produced by AutoSpec must satisfy three requirements:

**1. Specific** — state what exactly failed, not a generic category.

Bad: `Error: generation failed`
Good: `Error [spec 5/11]: Provider timeout after 120s generating 05_qa_lead.md.`

**2. Actionable** — tell the user what to do next, with a concrete command where possible.

Bad: `Auth error. Please check your credentials.`
Good: `Auth expired. Run: claude auth login`

**3. Contextual** — include relevant state: which spec number, which provider, how many succeeded.

Bad: `Rate limit exceeded.`
Good: `Rate limit reached on spec 3/11 (02_backend_lead.md). Wait 60s or use --provider anthropic-api.`

---

## Error Message Examples

**Timeout with retry:**
```
  Error [spec 5/11]: Provider timeout after 120s generating 05_qa_lead.md.
  Retry 1/2 in 2 seconds...

  Error [spec 5/11]: Provider timeout after 120s (retry 2/2 exhausted).
  4 specs completed successfully. Resume with:
    autospec generate requirements.md
```

**Auth failure (no retry):**
```
  Error [spec 3/11]: Authentication failed for Claude Code CLI.

  Your CLI session has expired. Re-authenticate with:
    claude auth login

  2 specs completed and saved. Resume after login:
    autospec generate requirements.md
```

**Rate limit with backoff:**
```
  Rate limit reached on spec 6/11 (05_qa_lead.md).
  Waiting 60s before retry 1/2...
```

**Budget exceeded:**
```
  Budget cap reached: $4.92 spent of $5.00 limit.
  8 of 11 specs completed and saved.

  To generate remaining specs:
    autospec generate requirements.md --max-budget 10.00
  Or without a cap:
    autospec generate requirements.md
```

**Empty SRS file:**
```
  Error: requirements.md is empty (0 bytes).

  AutoSpec needs a requirements document to generate specs.
    Interactive:  autospec generate --interview
    Examples:     https://github.com/Hundia/autospec/tree/main/examples
```

**Short SRS (warning, not error):**
```
  Warning: requirements.md is only 23 words.
  Generated specs may lack detail. Consider expanding your requirements
  or using: autospec generate --interview
  Proceed anyway? [y/N]
```

**Binary file:**
```
  Error: requirements.md appears to be a binary file.

  AutoSpec accepts Markdown (.md), plain text (.txt), or YAML (.yml) files.
  If this is a PDF, convert to text first: pdftotext requirements.pdf requirements.md
```

---

## Partial Completion and Resume

**Specs written to disk before failure are always preserved.** The atomic write pattern (tmp + rename) ensures that a spec is either fully written or not written at all — there are no partial/corrupt files on disk.

When generation halts (whether from error, interrupt, or budget), the user can resume with the exact same command:

```bash
autospec generate requirements.md
```

The resume mechanism reads `source_hash` from each existing spec's YAML frontmatter and compares it to the current SRS hash. Specs that match are skipped; specs that are missing or have a different hash are regenerated. The resume output celebrates what is preserved:

```
  Resuming previous run (7/11 specs already up-to-date)
  Skipping 7 specs, generating 4. Est. cost: $0.05–$0.20 (saved ~$0.15–$0.60)
```

**`specs/.meta.json` is purely informational.** Resume reads spec frontmatter directly, not the JSON. Deleting `specs/.meta.json` does not impair recovery.

---

## Interrupt Handling (SIGINT / SIGTERM)

When the user presses Ctrl+C or the process receives SIGTERM:

1. The active child subprocess (Claude Code CLI or Gemini CLI) receives SIGTERM and is killed
2. Temp directories (`/tmp/autospec-*`) are cleaned up
3. Resume instructions are printed with the exact command to continue
4. Process exits with code 1

This prevents the most common frustration after interrupted generation: orphaned LLM subprocesses consuming resources, temp files cluttering `/tmp`, and no guidance on how to resume. (Decision #3 — Architect 1 Must-Fix)

---

## Total Retry Cap Calculation

The 5-retry cap applies across all specs in a single run:

- If spec 1 uses 2 retries (rate limit, then success) and spec 5 uses 1 retry (timeout, then success), that's 3 retries used — 2 remain.
- If spec 7 needs 3 retries but only 2 remain in the cap, spec 7 fails after 2 retries and the run halts.

This prevents a systematically failing provider (e.g., network issues that never resolve) from running indefinitely. 5 is sufficient for typical transient failures (a single rate limit burst or two timeouts) while stopping runaway retry loops.

---

## Validation Failures (Step 13)

Step 13 validation failures are different from provider failures — they are detected locally after all LLM calls complete. A validation failure means a generated spec did not meet the quality thresholds:

- **Warn** if a spec is below the minimum line count but has all required sections
- **Warn** if a cross-reference filename does not exist in the output directory
- **Fail** if frontmatter is unparseable
- **Fail** if a required section heading is absent

Validation failure after successful generation exits with code 1 (general error) and lists the failing specs. The user can regenerate individual specs with `autospec generate requirements.md --spec 05_qa_lead` without re-running the full pipeline.

---

## Related Docs

- [Generate Command Pipeline](03_generate_pipeline.md) — where each failure mode occurs in the pipeline
- [LLM Provider Architecture](02_providers.md) — per-provider retry logic and error parsing
- [CLI Architecture Overview](01_architecture.md) — signal handling setup
- [Design Decisions Log](../research/03_design_decisions.md) — decisions #2, #3, #13, #14, #15, #23
