---
title: Competitive Analysis — GSD, OpenSpec, SpecIt
created: 2026-03-21
sprint: 29
status: complete
---

# Competitive Analysis — GSD, OpenSpec, SpecIt

This document summarizes the competitive landscape for AI-assisted spec generation tools as of March 2026. Research was conducted by Researchers A (GSD), B (OpenSpec), and C (SpecIt) and synthesized in the final proposal reviewed by two senior architects.

---

## Tools Analyzed

### GSD (Get Shit Done)

**Two generations; wildly different architectures.**

**GSD v1 — `get-shit-done-cc`** (npm, latest 1.27.0, 177 published versions, 23k+ GitHub stars as of March 2026). A pure prompt-framework: roughly 50 Markdown command files installed into `~/.claude/commands/gsd/` (or equivalent runtime config directories for OpenCode, Gemini CLI, Codex, Copilot, Antigravity). The LLM reads those Markdown files and executes a structured workflow. No proprietary runtime, no API key — entirely built on top of existing AI assistants. The installer (`npx get-shit-done-cc@latest`) detects installed runtimes by checking `$CLAUDE_CONFIG_DIR` / `~/.claude`, `$OPENCODE_CONFIG_DIR`, `$GEMINI_CONFIG_DIR`, etc. and applies format transformations (YAML frontmatter for Claude Code, TOML for Codex, JSON for OpenCode, tool-name remapping for Gemini) at install time.

**GSD v2 — `gsd-2` / `gsd-pi`** (npm package `gsd-pi`, requires Node ≥ 22). A full TypeScript CLI harness built on the Pi SDK. Controls the LLM session directly: clears context between tasks, injects exactly the right files at dispatch, manages git branches, tracks token cost, detects stuck loops, recovers from crashes, and auto-advances through entire milestones without human intervention. Supports 20+ LLM providers (Anthropic, OpenAI, Google, OpenRouter, GitHub Copilot, Amazon Bedrock, Azure, and more) via a unified SDK interface. Auth is handled by a setup wizard on first launch: OAuth for subscription-based providers (Claude Max, GitHub Copilot), API key paste for direct providers.

**Key GSD design patterns:**
- Multi-agent orchestration: Researchers (4 parallel) → Planner → Plan Checker → Executors (parallel waves) → Verifier → Orchestrator
- Deterministic logic in code, not prompts: file checks, config lookups, and state mutations run as Bash scripts returning JSON
- XML-tagged prompt sections (`<objective>`, `<execution_context>`, `<process>`) for structural instruction reliability
- All project state in human-readable Markdown files (`PROJECT.md`, `REQUIREMENTS.md`, `STATE.md`)
- Atomic git commits per task for bisectable history

**Critical gap:** GSD does not accept an existing SRS or PRD document as primary input. `/gsd:new-project` creates requirements from scratch through an interview. Users with an existing requirements document cannot feed it in directly — they must convert it manually into interview answers or paste it into context.

---

### OpenSpec

**Three distinct things share or are associated with the name.**

**`@fission-ai/openspec`** (npm, v1.2.0, February 2026, by Fission AI at `github.com/Fission-AI/OpenSpec`). A globally-installed CLI tool for spec-driven development. Manages structured Markdown artifacts (proposals, specs, design docs, task lists) and generates tool-specific slash-command adapters for 24+ AI coding assistants including Claude Code, Cursor, Windsurf, Gemini CLI, GitHub Copilot, Continue, Amazon Q, Cline, RooCode, Codex, and more.

**Critical insight:** `@fission-ai/openspec` does NOT call any LLM itself. It is a pure file-management and instruction-generation layer. Runtime dependencies are `commander`, `@inquirer/prompts`, `chalk`, `ora`, `yaml`, `zod`, `fast-glob`, and `posthog-node` — no AI/LLM SDK of any kind. The CLI generates adapter files that instruct whatever AI assistant the user already has installed.

**`openspec-for-copilot`** — A community-built VS Code extension (`github.com/atman-33/openspec-for-copilot`). Not an official Fission-AI product. Uses VS Code's Language Model API (`sendPromptToChat()`) to send compiled Handlebars prompts to GitHub Copilot Chat. Requires only an active Copilot subscription — no API keys. However, it uses `sendPromptToChat()` rather than registering a proper `@openspec` Chat Participant, which is a more fragile integration pattern.

**GitHub Copilot SDK** (`@github/copilot-sdk`) — Not "OpenSpec" but directly relevant to no-API-key LLM access from CLIs. Spawns `copilot --acp --stdio` as a subprocess and communicates via NDJSON JSON-RPC 2.0. Auth via `useLoggedInUser: true` (reuses stored `gh auth login` credentials, no API key). Status: Technical Preview. The ACP protocol is undocumented and has had breaking changes without deprecation (the `--headless --stdio` → `--acp --stdio` switch in 2025).

**Critical gap:** `@fission-ai/openspec` has no `init` path that accepts a requirements document. The project must already exist with human-written specs, or the user must interactively drive the AI assistant through `/opsx:propose`. OpenSpec is a delta-change tool (one change at a time), not a whole-project spec decomposition tool.

---

### SpecIt

**`specit-cli`** (npm, v0.1.2, published 2026-03-11, latest 2026-03-16 by Solvely-Colin, MIT license). A Go 1.22+ binary distributed via npm wrapper that downloads a platform-specific binary via `postinstall` script from GitHub Releases. Runs an adaptive AI interview in a split-pane TUI (Charm TUI libraries), captures the conversation into a structured `.spec` YAML file, and exports to multiple AI coding tool formats.

**The `.spec` YAML output:**
```yaml
version: "1.0"
project:
  name, description, goals, non_goals
domain:
  context, terminology
architecture:
  patterns, structure, data_flow
stack:
  languages, frameworks, databases, deployment
constraints:
  always, never, security, performance
style:
  formatting, naming, patterns
planning:
  active_profile, profiles
```

This is a **project-description spec** — not a role-based spec decomposition. SpecIt produces one flat `.spec` file covering what the project is and what constraints apply. It does NOT produce separate specs for product manager, backend lead, frontend lead, DevOps, etc.

**LLM integration:** Auto-detects available providers from the environment at first run (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `specit auth gemini`, `specit auth anthropic`, Ollama via localhost scan). The LLM adapts follow-up questions based on previous answers and codebase context. The `.spec` builds incrementally during the interview (shown in real-time in the right pane).

**Commands:** `specit init` (run adaptive interview), `specit export --format [specit|gsd|gsd-2]`, `specit validate [--ci]`, `specit diff` (detect spec drift), `specit import` (reverse-engineer from existing configs), `specit auth [provider]`.

**Critical gaps:** No headless/non-interactive mode (cannot be used in CI/CD). Does not accept an existing SRS document as input — the interview *is* the input mechanism. Export formats limited to specit, gsd, gsd-2 (no Claude Code, Cursor, etc.). Very early (v0.1.2, 3 releases in 5 days) — API surface likely to change.

---

## Feature Comparison Matrix

| Capability | GSD | OpenSpec | SpecIt | AutoSpec |
|-----------|-----|---------|--------|----------|
| Accepts existing SRS/PRD as input | No | No | No | **Yes** |
| Role-decomposed specs (10 roles) | No | No | No | **Yes** |
| Standalone CLI (no AI assistant needed) | No (v1) / Yes (v2) | No | Yes | **Yes** |
| Zero-API-key for CLI tool users | Yes | Yes | Partial | **Yes*** |
| Headless CI/CD support | No | No | No | **Yes** |
| Sprint-ready backlog generation | No | No | Partial | **Yes** |
| Resume on interruption | No | No | No | **Yes** |
| Adaptive interview | No | No | Yes | v0.3.0 |
| Multi-framework adapter export | Yes (v1, 6 runtimes) | Yes (24 tools) | Limited (3) | v0.3.0 |
| Spec drift detection | No | No | Yes | v1.0.0 |
| Plugin system for custom roles | No | Yes (schemas) | Yes | v1.0.0 |
| Atomic file writes | N/A | N/A | Unknown | Yes |
| Cost tracking | Yes (v2) | N/A | No | Yes |

*\*When Claude Code or Gemini CLI is installed; API key needed for Anthropic API fallback.*

---

## Three Architecture Patterns Identified

Researcher C identified three distinct patterns across the LLM-backed CLI ecosystem:

### Pattern A: Direct API Call

```
CLI → HTTP SDK (@anthropic-ai/sdk, openai) → Provider API
```

Used by: ai-scaffold (single provider, single env var). Simplest to implement. Requires API key. Full control over prompts and models. Single provider unless using litellm abstraction (Python only). **AutoSpec uses this for the Anthropic API provider (fallback).**

### Pattern B: CLI Subprocess Delegation

```
CLI → spawn("claude", [...args]) → Claude Code handles auth
CLI → spawn("gemini", [...args]) → Gemini CLI handles auth
```

Used by: create-ai-scaffold (Claude Code first, Codex second, clipboard fallback). Zero API key setup if the user has existing CLI tools. Leverages existing auth (subscription, OAuth). Requires output parsing (text or NDJSON). **AutoSpec uses this for Claude Code CLI and Gemini CLI providers (priority 1 and 2).**

### Pattern C: Prompt Template Generation

```
CLI → generates .md files with structured prompts
User → opens AI agent → runs /slash-command → agent calls LLM
```

Used by: GSD v1, OpenSpec, GitHub Spec Kit. Zero LLM dependency in the CLI itself. Works with any agent that supports slash commands. Cannot be fully automated or CI-integrated. **AutoSpec will support this via `autospec skills --install` in v0.3.0, but the primary path is Pattern B + A.**

---

## What AutoSpec Does Differently

**"One SRS in, ten expert specs out."**

No tool in the landscape does what AutoSpec proposes: accept an existing SRS/requirements document as the primary input, call an LLM with reasoning capability, and output 10 role-based spec files (product manager, backend lead, frontend lead, DB architect, QA lead, DevOps lead, marketing lead, finance lead, business lead, UI designer) plus a sprint-ready backlog — in a single automated CLI invocation.

- GSD builds requirements from scratch through an interview; it cannot accept an existing SRS.
- OpenSpec manages delta changes to an existing spec set; it does not generate role-decomposed specs from a document.
- SpecIt interviews the user to produce a single flat `.spec` file; it has no role decomposition and no headless mode.
- GitHub Spec Kit, aider, and create-ai-scaffold are all coding assistants or workflow coordinators, not spec generators.

The role decomposition is the key differentiator. SpecIt produces one `.spec`. Spec Kit produces one `spec.md`. OpenSpec produces one `proposal.md` plus delta `specs/`. AutoSpec produces 10 distinct role-perspective documents, each written from the viewpoint of a different team member who will execute the project — enabling each role to proceed independently with a spec tailored to their concerns.

---

## Sources

- `research-gsd.md` — Researcher A analysis of GSD v1 and v2
- `research-openspec.md` — Researcher B analysis of OpenSpec, openspec-for-copilot, and GitHub Copilot SDK
- `research-specit.md` — Researcher C analysis of SpecIt, Spec Kit, aider, and LLM-backed CLI patterns
- `research-proposal-final.md` — Final proposal v3.0 incorporating all researcher and architect feedback
- [npm: get-shit-done-cc](https://www.npmjs.com/package/get-shit-done-cc)
- [npm: @fission-ai/openspec v1.2.0](https://www.npmjs.com/package/@fission-ai/openspec)
- [npm: specit-cli v0.1.2](https://npm.im/specit-cli)
- [GitHub: Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec)
- [GitHub: Solvely-Colin/SpecIt](https://github.com/Solvely-Colin/SpecIt)
