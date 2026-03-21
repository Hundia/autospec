---
title: Design Decisions Log
created: 2026-03-21
sprint: 29
status: complete
---

# Design Decisions Log

This is the full decisions log for AutoSpec v0.2.0 (Sprint 28–29). Every decision is sourced from the research proposal review process: three researcher iterations (v1 → v2 changelog, 18 items) plus two senior architect reviews (v2 → v3 changelog, 17 items). Decisions are reproduced here from the final proposal's Appendix verbatim, with expanded rationale and source attribution.

---

## Decision Table

| # | Decision | Choice | Rationale | Source |
|---|----------|--------|-----------|--------|
| 1 | MVP providers | 3: Claude Code CLI, Gemini CLI, Anthropic API | 5 is too many for a first release. Each provider is ~200-300 lines + edge-case testing. Claude Code and Gemini share 90% of subprocess logic. Ollama has unique timeout/quality concerns needing separate guardrails. OpenAI adds no strategic value over Anthropic API for MVP. | Architect 1 (Must-Fix #1) |
| 2 | File writes | Atomic: write to `.autospec-tmp`, then `rename()` | Prevents data corruption on Ctrl+C, OOM, or power loss. Without atomic writes, a kill mid-write produces a corrupt spec file that resume skips (frontmatter is there, hash matches) but contains truncated content. On startup, clean any orphaned `.autospec-tmp` files. | Architect 1 (Must-Fix #2) |
| 3 | Signal handling | SIGINT/SIGTERM: kill child process, clean temp dirs, print resume instructions, exit 1 | Without handlers, Ctrl+C leaves orphaned subprocesses (Claude Code, Gemini CLI still running), temp files on disk, and no resume guidance. The handler takes 10 lines of code and prevents the most common frustration point. | Architect 1 (Must-Fix #3) |
| 4 | SRS argument form | Positional (primary): `autospec generate requirements.md`. `--srs` kept as alias for `--help` discoverability. | Every major CLI uses positional for primary input: `gcc main.c`, `cat README.md`, `tsc tsconfig.json`. The `--srs` flag adds typing overhead and cognitive load for zero disambiguation benefit — there is no other positional arg competing for that slot. Stdin piping is also cleaner: `cat reqs.md | autospec generate -` vs `cat reqs.md | autospec generate --srs -`. | Architect 2 (Must-Fix #1) |
| 5 | `providers` command | Renamed to `doctor` | Follows `brew doctor`, `flutter doctor`, `npm doctor` convention. `providers` sounds like a read-only list; `doctor` implies "diagnose and tell me what to fix." A single pasteable command for bug reports. Both architects agreed independently. | Architect 1 (#11) + Architect 2 (Must-Fix #5) |
| 6 | Budget cap default | No default (opt-in only via `--max-budget`) | A $5.00 default is a footgun for Opus users: Opus full run estimates $2–$6, so a user running `autospec generate --model opus` would halt at spec 9/11 with "budget exceeded." The confirmation prompt already shows cost range — that is the cost control, not a hidden default. | Architect 1 (#7) + Architect 2 (Must-Fix #4) |
| 7 | Cost display | Ranges, not point estimates | Token counts vary 2-3x based on SRS complexity and LLM verbosity. A 2,847-word SRS about a CRUD app produces very different specs than one about a distributed trading system. Point estimates mislead; ranges set honest expectations. Add footnote: "Actual cost depends on response length. Use --max-budget to set a hard cap." | Architect 1 (#8) |
| 8 | `--parallel` flag | Deferred to v0.2.1 | Running specs 07-09 in parallel saves ~15-30 seconds on a 100-120 second run — not worth the added complexity (concurrent subprocess management, race conditions on cost tracking, harder error handling, harder debugging) for the MVP. Nobody's first complaint about a 2-minute CLI run is "it should be 90 seconds." | Architect 1 (#9) |
| 9 | `@anthropic-ai/sdk` dependency type | Regular dependency, loaded via dynamic `import()` only when Anthropic API provider is selected | Optional peer dependencies are an npm footgun. When `npm install -g autospec` succeeds but the peer dep isn't installed, `autospec generate` fails at runtime with a confusing import error. Regular dep eliminates this class of "works on my machine" issues. Bundle size impact: ~200KB — acceptable. | Architect 1 (#10) |
| 10 | `generateJSON()` method on provider interface | Removed. Pipeline layer handles JSON parsing. Providers only implement `generate()`. | Optional methods on interfaces (`generateJSON?<T>()`) require every call site to check `if (provider.generateJSON)` with a fallback path. Simpler: all providers implement `generate()` (text output). Pipeline's metadata extraction step (Step 1) appends "respond in valid JSON" to the prompt and parses JSON from text using `parseMetadataFromText()`. Providers that support native JSON mode can use it internally as an optimization. | Architect 1 (#5) |
| 11 | `summarizeSpec()` algorithm | Headers + first sentence of each section + tables (first 3). No entity-extraction regexes. | The entity regex approach (`/(?:persona|user|role|actor|stakeholder)[:\s]+["']?([A-Z][a-z]+)/gi`) misses most real-world patterns: personas in tables, "the admin user" phrasing, non-English names. The simplified approach (headers + first sentences + tables) covers 80% of cross-spec coherence needs without brittle regexes. Entity extraction is a v0.3.0 enhancement once real generated specs exist to test against. | Architect 1 (#6) |
| 12 | Metadata file location | `specs/.meta.json` (inside specs dir, not project root) | The project root already has `.autospecrc.json` for user configuration. Two similarly-named dotfiles in the root is confusing. Moving generation metadata inside `specs/` keeps it co-located with what it describes and out of the user's face. | Architect 1 (#14) |
| 13 | Stdin pipe behavior | Auto-implies `--yes` (skip confirmation prompt) | `cat reqs.md | autospec generate -` cannot interact with a confirmation prompt — stdin is already occupied by the pipe. Detect `!process.stdin.isTTY` and skip confirmation automatically. Hanging indefinitely on a closed pipe is a worse experience than skipping a prompt. | Architect 2 (#10) |
| 14 | Exit codes | Expanded to 0-7 for CI differentiation | CI pipelines need distinct exit codes to decide whether to retry (code 7: timeout) vs. alert on-call (code 5: auth failure) vs. fix configuration (code 4: no provider). The original codes 0-3 were insufficient. Full table: 0=success, 1=general error, 2=invalid arguments/config, 3=file not found, 4=no provider, 5=auth failure, 6=budget exceeded (partial), 7=timeout/network. | Architect 2 (#12) |
| 15 | Quiet mode | `--quiet` / `-q` flag + `CI=true` env var auto-detection | Streaming progress bars and banners are correct for interactive users, noise for CI pipelines. `--quiet` suppresses progress bars, provider detection banner, and confirmation prompt (implies `--yes`). `CI=true` env var (set by GitHub Actions, GitLab CI, CircleCI, etc.) also triggers quiet mode automatically. | Architect 2 (#6) |
| 16 | Completion output | File list + cost + time + 3 actionable next steps | Users who wait 2 minutes watching progress bars need a dopamine hit and clear guidance when generation finishes. Without a completion summary, users stare at a cursor wondering "did it work? what now?" The three next steps (`ls specs/`, `autospec status`, `autospec sprint 0`) provide a clear ramp to the next action. | Architect 2 (Must-Fix #2) |
| 17 | GitHub Copilot SDK provider | Deferred to v0.3.0 | Three independent reasons from all reviewers: (1) Technical Preview status — not recommended for production. (2) ACP protocol is undocumented — `copilot --acp --stdio` NDJSON JSON-RPC format is reverse-engineered from source code, not formal docs. (3) NDJSON fragility — breaking changes occur without deprecation (the `--headless --stdio` → `--acp --stdio` switch in 2025 was undocumented). | All 3 researchers + both architects |
| 18 | `--url <url>` input | Deferred to v0.3.0 | HTML parsing, auth for private URLs, JavaScript rendering for SPAs — too much scope for MVP. The common case (requirements in a Markdown file) is well served by the file input path. URL input is a power-user feature that can wait for v0.3.0 alongside `autospec skills --install`. | Researcher C |
| 19 | Cross-provider fallback | Opt-in via `--fallback` flag. Default: halt on failure. | Silent fallback can incur unexpected charges (e.g., auto-falling back from zero-cost Gemini CLI to paid Anthropic API). Users must explicitly opt in with `--fallback`. When fallback triggers, display a visible warning: "Claude Code CLI failed: rate limit exceeded. Falling back to Anthropic API." | Researcher A |
| 20 | Interview mode | 10 fixed sequential questions via `@inquirer/prompts` | Adaptive interview (like SpecIt's TUI) requires major investment: Go TUI libraries, adaptive question generation, partial-session persistence. For MVP, 10 fixed questions covering name, description, domain, users, core features, tech stack, constraints, deployment, integrations, and success criteria give the LLM enough context. The interview output is an intermediate SRS at `specs/.interview-srs.md` that feeds the standard pipeline — not a separate code path. | Researcher C |
| 21 | Resume mechanism | Hash-based (sha256 of SRS file) stored in YAML frontmatter of each spec. Default behavior; `--force` overrides. | File existence alone doesn't detect SRS changes — a user could edit requirements.md after partial generation, and AutoSpec would incorrectly skip specs generated from the old SRS. Storing `source_hash: sha256:abc123...` in frontmatter enables precise detection: hash mismatch → regenerate. Deleting `specs/.meta.json` does not break resume (resume reads frontmatter from spec files, not the JSON). | Researchers A and C |
| 22 | ESM/CJS build compatibility | Verify `tsup` bundles `execa@9` (ESM-only) + `handlebars` (CJS-only) before sprint starts; fallback plan is `execa@8` | `execa@9`, `chalk@5`, `ora@8` are ESM-only. `handlebars`, `fs-extra` are CJS-only. This CJS/ESM mix is a known `tsup` pain point. A build that doesn't compile is not shippable. The first task in Sprint 28 is build verification. If `tsup` cannot bundle cleanly, pin `execa` to v8 (last CJS-compatible version). | Architect 1 (Must-Fix #4) |
| 23 | Empty/binary SRS detection | Warn below 50 words (do not block). Error on 0 bytes or binary file. | Below 50 words: LLM can still produce something from a short brief, so blocking is overly paternalistic. A warning sets expectations. At 0 bytes: nothing to generate from — error with link to `--interview`. Binary files: detect and error with format guidance (Markdown, plain text, YAML accepted; convert PDF with `pdftotext`). | Architect 2 (Must-Fix #3) |
| 24 | Model name in confirmation prompt | Show full identifier: "Claude Sonnet 4 (claude-sonnet-4-20250514)" | New users won't know what "sonnet" maps to in terms of quality and cost. The confirmation prompt is the moment users make the decision to proceed — show them exactly what model they are using. | Architect 2 (observation) |
| 25 | Resume celebration message | When resume kicks in, show specs skipped and estimated savings | The resume mechanism is a genuine differentiator — no competitor has it. When it triggers, celebrate it loudly: "Resuming previous run (4/11 specs already up-to-date). Skipping 4 specs, generating 7. Est. cost: $0.12–$0.45 (saved ~$0.08–$0.35)." This reinforces the value of the feature and sets cost expectations for the partial run. | Architect 2 (observation) |
| 26 | System prompt format | Handlebars templates with XML-tagged sections (`<role>`, `<output_format>`, `<constraints>`, `<project_metadata>`, `<prior_spec_summaries>`, `<input_document>`) | GSD's research demonstrated that Claude's training treats XML tags as structural boundaries, improving multi-step instruction reliability. Handlebars enables `autospec instructions` in v0.3.0 (skill files that reference the same templates). Templates stored in `cli/src/prompts/system/*.hbs`. | Researcher A (Lesson 4) |
| 27 | No default for `--parallel` gap between API-only and zero-config users | Anthropic API as third-tier fallback (not second) | Gemini CLI ranks above Anthropic API because zero-config (existing auth) is always preferable to requiring an API key. A user who has Gemini CLI installed but not Anthropic API key gets a working experience without any key setup. The priority chain always prefers subprocess (zero-config) over SDK (key required). | Research proposal v1, maintained in v2/v3 |

---

## Changelog Reference

### v1 → v2 (Researcher Feedback, 18 items)

The most significant v1 → v2 changes (beyond individual decisions above):
- Cross-provider fallback made opt-in (Decision #19)
- Copilot SDK deferred (Decision #17)
- Subprocess robustness: prompts via stdin, per-provider timeouts, temp file cleanup, NDJSON parse guards (implemented in Sprint 28.3 and 28.4)
- Resume made default behavior (Decision #21)
- Validation thresholds made per-role with section-presence as primary check

### v2 → v3 (Architect Feedback, 17 items)

All Must-Fix items (Decisions #1-5) plus Should-Fix items (Decisions #6-16) and observations (Decisions #24-25) incorporated from Architect 1 (Systems) and Architect 2 (DX) reviews.

---

## Related Docs

- [Provider Architecture Decisions](02_provider_architecture.md) — deeper analysis of provider choices
- [CLI Architecture Overview](../cli/01_architecture.md) — source file structure
- [LLM Provider Architecture](../cli/02_providers.md) — TypeScript implementation
- [Generate Command Pipeline](../cli/03_generate_pipeline.md) — pipeline steps and atomic writes
- [Error Handling and Recovery](../cli/04_error_handling.md) — exit codes and failure modes
