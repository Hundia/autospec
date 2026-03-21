---
title: CLI Version Roadmap
created: 2026-03-21
sprint: 29
status: complete
---

# CLI Version Roadmap

AutoSpec's CLI version roadmap is shaped by the research findings and two rounds of architect review. The core principle: ship a small, well-tested surface in v0.2.0, then expand with fast-follow iterations informed by real-user feedback.

---

## v0.2.0 — MVP

**Target:** Sprint 28–29
**Theme:** One SRS in, ten expert specs out — with zero-config auth, atomic writes, resume, and CI support.

### What Ships in v0.2.0

| Feature | Notes |
|---------|-------|
| `autospec generate <file>` | Positional SRS path; primary command |
| `autospec generate -` | Stdin pipe (auto-implies `--yes`) |
| `autospec generate --interview` | 10 fixed questions → intermediate SRS → standard pipeline |
| `autospec generate --spec <name>` | Regenerate a single spec only |
| `autospec doctor` | System readiness: Node version, LLM providers, disk space |
| 3 LLM providers | Claude Code CLI (priority 1), Gemini CLI (priority 2), Anthropic API (priority 3) |
| Provider auto-detection | Priority chain with `--provider` override |
| Hash-based resume | Default behavior; `--force` to override; skips unchanged specs |
| Atomic file writes | Write to `.autospec-tmp`, then `rename()` |
| Signal handling | SIGINT/SIGTERM: kill children, clean temp, print resume hint |
| Pre-generation confirmation | Cost range, full model name, spec count; `--yes` to skip |
| Completion summary | File list with line counts, cost, time, 3 actionable next steps |
| `--dry-run` | Show plan without LLM calls |
| `--fallback` | Opt-in cross-provider fallback |
| `--max-budget <usd>` | Opt-in cost cap (no default) |
| `--quiet` / `-q` | Suppress progress for CI; `CI=true` env var auto-triggers |
| `--verbose` | Show prompts and raw LLM output |
| Per-role validation | Section-presence (primary) + minimum line counts (secondary) |
| YAML frontmatter on all specs | `source_hash`, `generated_by`, `model`, `provider`, `generated_at` |
| Empty/binary SRS detection | Warn <50 words, error on 0 bytes or binary |
| Expanded exit codes | 0-7 for CI differentiation |
| `specs/.meta.json` | Purely informational; not required for any operation |

### What Does NOT Ship in v0.2.0

| Feature | Ships In | Reason Deferred |
|---------|----------|-----------------|
| OpenAI API provider | v0.2.1 | Adds no strategic value over Anthropic API for MVP; saves one sprint |
| Ollama provider | v0.2.1 | Unique timeout/quality concerns needing separate guardrails |
| `--parallel` flag (specs 07-09) | v0.2.1 | Saves 15-30s on 2min run; not worth complexity for MVP |
| `--url <url>` input | v0.3.0 | HTML parsing, auth for private URLs, JS rendering = too much scope |
| GitHub Copilot SDK provider | v0.3.0 | Technical Preview; undocumented ACP protocol; NDJSON fragility |
| `autospec skills --install` | v0.3.0 | Requires adapter file generation for 6+ runtimes |
| `autospec instructions` | v0.3.0 | Depends on Handlebars templates exposed via `--url` skill path |
| Per-role model routing | v0.3.0 | Requires model-per-role config; adds DX complexity |
| Adaptive interview (TUI) | v0.3.0 | Requires significant TUI investment; 10 fixed questions sufficient for MVP |
| SRS chunking (>15K words) | v0.3.0 | Rare edge case; large SRSes still work, just produce larger prompts |
| `autospec validate` | v1.0.0 | LLM-based quality validation beyond structural checks |
| `autospec diff` | v1.0.0 | Delta spec detection (spec drift since last run) |
| Delta updates | v1.0.0 | Regenerate only sections affected by SRS changes |
| LLM-based `--verify` | v1.0.0 | Quality verification beyond structural validation |
| Plugin system for custom roles | v1.0.0 | Custom role definitions beyond the 10 built-in roles |
| VS Code extension | v1.0.0 | Chat Participant API integration; `@autospec` participant |
| Artifact history | v1.0.0 | Version history of generated specs |

---

## v0.2.1 — Fast-Follow

**Target:** Sprint 30
**Theme:** Expand provider coverage; add parallelism.

| Feature | Notes |
|---------|-------|
| OpenAI API provider | Standard `OPENAI_API_KEY`; `openai` npm package; same interface as Anthropic API provider |
| Ollama provider | Local inference on `localhost:11434`; halved line count thresholds (smaller models produce shorter output); warning for models <7B parameters |
| `--parallel` flag | Runs specs 07-09 (marketing, finance, business) in parallel; saves 15-40s; concurrent subprocess management |
| Bug fixes from v0.2.0 | Issues surfaced by real-user feedback |

**Why these three together:** OpenAI API and Ollama are both direct-call providers that share the Anthropic API provider's implementation pattern. `--parallel` is straightforward once the sequential pipeline is proven stable. Sprint 30 is a contained 20-point sprint that adds significant provider coverage without touching the core pipeline.

---

## v0.3.0 — Ecosystem Integration

**Target:** Sprint 31–32
**Theme:** From one-shot generation to living documentation ecosystem.

| Feature | Notes |
|---------|-------|
| `autospec skills --install` | Generates adapter files for installed AI runtimes (Claude Code, Gemini CLI, OpenCode, Cursor) so users can run `/autospec:update-spec` interactively |
| `autospec instructions` | Exposes rendered Handlebars prompt templates for external tooling and skill file construction |
| `--url <url>` input | Accept a URL to a requirements document (markdown file on GitHub, Notion page, Confluence page) |
| GitHub Copilot SDK provider | `@github/copilot-sdk` subprocess via ACP protocol; deferred until SDK reaches stable release |
| Per-role model routing | Configuration to use different models per role (e.g., Opus for PM spec, Sonnet for DevOps spec) |
| Adaptive interview | 10-question interview replaced with LLM-driven adaptive follow-up (like SpecIt's TUI) |
| SRS chunking | Handle SRS documents >15K words by chunking and summarizing for the prompt |

**v0.3.0 is the "living documentation" release.** After v0.2.x proves the one-shot generation value proposition, v0.3.0 connects AutoSpec into the user's daily development workflow via skill files and interactive updates. The `autospec skills --install` command is the OpenSpec-pattern integration that lets users evolve specs over time without re-running the full pipeline.

---

## v1.0.0 — Production-Grade

**Target:** Sprint 35+
**Theme:** Full spec lifecycle management.

| Feature | Notes |
|---------|-------|
| `autospec validate` | LLM-based quality validation: checks specs for completeness, consistency, and project-specificity (not just structural presence) |
| `autospec diff` | Detect spec drift: identify which specs have drifted from the current SRS since last generation |
| Delta updates | Re-run generation for only the sections affected by SRS changes, not the full pipeline |
| LLM-based `--verify` | Cross-check generated specs against SRS for semantic accuracy |
| Plugin system for custom roles | Define custom role files to add roles beyond the 10 built-ins (e.g., `11_ml_lead`, `12_mobile_lead`) |
| VS Code extension | Chat Participant API: `@autospec generate`, `@autospec status`, `@autospec sprint 0` in Copilot Chat |
| Artifact history | Version-controlled history of all generated spec files with diff viewing |

**v1.0.0 is not a big-bang release.** Each feature can ship independently in its own sprint. The v1.0.0 label represents the milestone where AutoSpec is production-ready for teams running continuous SDD workflows, not just one-time spec generation.

---

## Sprint Mapping

| Sprint | Version | Focus |
|--------|---------|-------|
| Sprint 28 | v0.2.0 (core) | Provider interface, Claude Code + Anthropic API providers, pipeline skeleton (14 steps), Handlebars templates, atomic writes, signal handling, resume |
| Sprint 29 | v0.2.0 (polish) | Gemini CLI provider, `generate` command wiring, input validation, confirmation + completion UX, interview mode, validation, all flags, unit tests |
| Sprint 30 | v0.2.1 | OpenAI + Ollama providers, `--parallel`, bug fixes from v0.2.0 user feedback |
| Sprint 31 | v0.3.0 (phase 1) | `autospec skills --install`, `autospec instructions`, adapter file generation for 3+ runtimes |
| Sprint 32 | v0.3.0 (phase 2) | `--url` input, GitHub Copilot SDK provider, per-role model routing, SRS chunking |
| Sprint 35+ | v1.0.0 | `autospec validate`, `autospec diff`, VS Code extension, plugin system |

---

## Version Philosophy

**v0.2.x:** Prove the core value proposition. One SRS in, ten expert specs out. Get it working reliably for Claude Code and Gemini CLI users (the primary early adopter population) with zero API key setup.

**v0.3.0:** Extend into the ecosystem. Connect AutoSpec to the user's existing AI runtime for iterative updates. Support URL inputs and per-role model routing for power users.

**v1.0.0:** Full spec lifecycle. Add validation, drift detection, and delta updates so AutoSpec becomes a continuous tool, not just a one-time scaffolder.

The fastest path to v1.0.0 is shipping v0.2.0 and v0.2.1 with enough real-user feedback to know which v1.0.0 features matter most. The roadmap above is a direction, not a commitment — user feedback from v0.2.0 will reshape priorities.

---

## Related Docs

- [CLI Architecture Overview](01_architecture.md) — Sprint 28-29 implementation structure
- [LLM Provider Architecture](02_providers.md) — provider implementation details for v0.2.0 and v0.2.1
- [Generate Command Pipeline](03_generate_pipeline.md) — pipeline that ships in v0.2.0
- [Error Handling and Recovery](04_error_handling.md) — error handling that ships in v0.2.0
- [Design Decisions Log](../research/03_design_decisions.md) — decisions #1, #8, #17, #18 (deferral rationale)
- [Competitive Analysis](../research/01_competitive_analysis.md) — what competitors ship vs. what AutoSpec targets
