# Research Report: GSD (Get Shit Done)
**Researcher:** A
**Date:** 2026-03-20

---

## What Is GSD

GSD — "Get Shit Done" — is a meta-prompting, context engineering, and spec-driven development system. It transforms AI coding assistants (Claude Code, Gemini CLI, Codex, OpenCode, Copilot, Antigravity) into reliable, structured development pipelines by managing context windows, orchestrating specialized sub-agents, and persisting project state to disk.

There are two generations of the project:

**GSD v1 / `get-shit-done-cc`** (`npm: get-shit-done-cc`, latest `1.27.0` as of 2026-03-20, 177 published versions, actively maintained — last publish was 5 hours before research time). This is the original "prompt-framework" variant: ~50 Markdown files installed as slash commands into `~/.claude/commands/gsd/` (or equivalent runtime config dirs). The LLM reads those Markdown instruction files and executes a structured workflow. No proprietary runtime — entirely built on top of existing AI assistants.

**GSD v2 / `gsd-2`** (`npm: gsd-pi`, requires Node ≥ 22). This is a full TypeScript CLI harness built on the Pi SDK. It controls the LLM session directly: clears context between tasks, injects exactly the right files at dispatch, manages git branches, tracks token cost, detects stuck loops, recovers from crashes, and auto-advances through entire milestones without human intervention.

Both share the same underlying SDD philosophy: discuss → plan → execute → verify, with persistent state in structured Markdown files. This report covers both generations, noting where they differ.

**Scale:** 23k+ GitHub stars as of March 2026. Arguably the most widely adopted Spec-Driven Development tool in the AI-coding ecosystem.

---

## LLM Integration Architecture

### GSD v1 (get-shit-done-cc) — Pure Prompt Framework

GSD v1 does **not call LLMs directly**. Instead, it installs Markdown command files into the config directories of AI runtimes the user already has installed. The runtime's own LLM integration does the actual calling.

**Mechanism:**
1. The installer copies ~50 `.md` command files to `~/.claude/commands/gsd/` (for Claude Code), `~/.config/opencode/command/` (for OpenCode), `~/.gemini/commands/` (for Gemini), etc.
2. Each file contains YAML frontmatter and a Markdown body with `<objective>`, `<execution_context>`, and `<process>` XML sections.
3. When the user runs `/gsd:plan-phase 1` inside Claude Code, Claude Code reads that `.md` file and executes it as a prompt — using its own LLM connection (Anthropic API via Claude Code subscription).
4. GSD uses the `Task` tool (Claude Code's native sub-agent spawner) to spawn parallel agents with fresh contexts.

**Prompt structure example (XML-tagged):**
```xml
<objective>
  Research the codebase and produce a phase research document.
</objective>
<execution_context>
  @./PROJECT.md
  @./REQUIREMENTS.md
  @./.planning/STATE.md
</execution_context>
<process>
  Spawn 4 parallel researchers. Each writes to a separate output file.
  A synthesizer reads all 4 files and creates RESEARCH.md.
</process>
```

The XML tags are chosen deliberately: Claude's training treats them as structural boundaries, making instruction-following more reliable. The `@./` references inject file contents at dispatch time — the orchestrator loads only file paths, not raw content, until an agent actually reads them.

**Multi-agent orchestration pattern:**
- **Researchers** (4 parallel) — investigate domain, stack, architecture, pitfalls
- **Planner** — creates atomic task plans in XML structure
- **Plan Checker** — validates plans against REQUIREMENTS.md (max 2 iterations)
- **Executors** (parallel waves) — implement tasks with fresh 200k-token contexts
- **Verifier** — checks codebase against goals; spawns debuggers on failure
- **Orchestrator** — thin coordinator; spawns agents but does no heavy lifting itself

**Key engineering principle:** "Deterministic logic belongs in code, not in prompts." File existence checks, config calculations, and state updates run via Bash scripts that return JSON. The LLM never evaluates whether a file exists — a script does that.

### GSD v2 (gsd-2) — TypeScript Harness (Pi SDK)

GSD v2 calls LLMs via the **Pi SDK** — a multi-provider TypeScript SDK that supports 20+ providers (Anthropic, OpenAI, Google, OpenRouter, GitHub Copilot, Amazon Bedrock, Azure, and more). The SDK wraps provider-specific APIs behind a unified interface.

**Model routing by phase (configurable):**
```yaml
research:  claude-sonnet-4-6
planning:  claude-opus-4-6     # fallbacks: openrouter/z-ai/glm-5, ...
execution: claude-sonnet-4-6
completion: claude-sonnet-4-6
```

**Auto mode execution loop:**
1. Reads `.gsd/STATE.md` to determine next work unit
2. Creates a fresh agent session (clears context)
3. Pre-inlines task plan, prior summaries, dependency graph, roadmap excerpt, and decisions register into the dispatch prompt
4. Sends assembled prompt to LLM via Pi SDK
5. LLM executes; writes results to `.gsd/tasks/T01-SUMMARY.md`
6. Harness reads disk state again and dispatches next unit

**Crash recovery:** Lock files track current unit. On crash, next invocation reads surviving session file and synthesizes a recovery briefing. Transient errors (429, 500, 503) auto-retry; permanent errors (auth, billing) pause for manual review.

**Stuck detection:** If the same work unit dispatches twice, it retries once with diagnostics, then halts with the exact missing artifact identified.

---

## Authentication Model

### GSD v1 — Zero-Auth (Piggybacks on Existing CLI Auth)

This is GSD v1's most significant design decision: **it requires no authentication of its own**.

The installer (`npx get-shit-done-cc@latest`) detects which AI runtimes are installed by checking environment variables and well-known config directories:

| Runtime | Detection Logic |
|---------|----------------|
| Claude Code | `$CLAUDE_CONFIG_DIR` or `~/.claude` |
| OpenCode | `$OPENCODE_CONFIG_DIR`, `$XDG_CONFIG_HOME`, or `~/.config/opencode` |
| Gemini CLI | `$GEMINI_CONFIG_DIR` or `~/.gemini` |
| Codex | `$CODEX_HOME` or `~/.codex` |
| Copilot | `$COPILOT_CONFIG_DIR` or `~/.copilot` |
| Antigravity | `$ANTIGRAVITY_CONFIG_DIR` or `~/.gemini/antigravity` |

If you already have Claude Code running (with your Anthropic subscription's auth stored in `~/.claude/`), GSD just works. No API key setup. No `.env` file. No OAuth flow. The user's existing subscription handles billing and rate limits.

This means: a user with a Claude Max subscription installs GSD in 30 seconds and immediately has access to Opus-level planning without ever handling an API key.

### GSD v2 — OAuth + API Key via Pi SDK Setup Wizard

GSD v2 runs a setup wizard on first launch (`gsd` with no arguments):
1. Select LLM provider from a list of 20+
2. For subscription-based providers (Claude Max, GitHub Copilot): Pi SDK handles OAuth automatically
3. For API providers (Anthropic direct, OpenAI, etc.): paste API key at the prompt
4. Optional: configure tool API keys (Brave Search, Context7, Jina, Slack, Discord)

Stored in project's `.gsd/config.json`. Re-run anytime with `gsd config`.

---

## Command Structure

### GSD v1 Commands (slash-command style, invoked inside AI runtime)

**Project lifecycle:**
| Command | Purpose | Time |
|---------|---------|------|
| `/gsd:new-project` | Interview → research → requirements → roadmap | 10-15 min |
| `/gsd:map-codebase` | Analyze existing codebase before planning | 5-10 min |
| `/gsd:discuss-phase N` | Capture implementation decisions for phase N | 5 min |
| `/gsd:plan-phase N` | Research → 2-3 atomic task plans (XML) | 5-10 min |
| `/gsd:execute-phase N` | Parallel wave execution with atomic git commits | 10-15 min |
| `/gsd:verify-work N` | Goal-backward QA; spawns debuggers on failure | 3-5 min |
| `/gsd:complete-milestone` | Archive and tag release | 2 min |
| `/gsd:new-milestone name` | Start next version cycle | 2 min |

**Ad-hoc / utility:**
| Command | Purpose |
|---------|---------|
| `/gsd:quick [--discuss] [--research] [--full]` | Ad-hoc tasks without full planning |
| `/gsd:fast <text>` | Inline trivial tasks, skips planning entirely |
| `/gsd:ship N` | Create PR with auto-generated description |
| `/gsd:next` | Auto-detect next workflow step |
| `/gsd:progress` | View current status and next steps |
| `/gsd:resume-work` | Multi-session continuation |
| `/gsd:debug` | Systematic debugging with persistent state |
| `/gsd:help` | Show all 30+ commands with GSD banner |

### GSD v2 Commands (standalone CLI)

```bash
gsd            # Step mode — pause between work units
gsd auto       # Autonomous mode — runs to completion
gsd next       # Explicit next-step alias
gsd quick      # Fast task execution
gsd headless [cmd]  # CI/scripting mode (no TUI)
gsd discuss    # Architecture dialogue (works during auto)
gsd status     # Real-time progress dashboard
gsd queue      # Queue future milestones
gsd prefs      # Configure models, timeouts, budgets
gsd migrate    # Convert v1 .planning/ to v2 .gsd/
gsd export --html  # Generate HTML reports
gsd config     # Re-run provider setup wizard
```

---

## User Experience Flow

### Installation (v1, most common)

```bash
npx get-shit-done-cc@latest
# Interactive: choose runtime(s) and scope
# OR non-interactive:
npx get-shit-done-cc --claude --global
npx get-shit-done-cc --all --global
```

The installer detects runtimes, applies format transformations (YAML frontmatter for Claude, TOML for Codex, JSON for OpenCode, tool-name remapping for Gemini), and copies ~50 command files and ~12 agent files to the appropriate config directories. Takes under 30 seconds.

### New Project Flow (v1)

1. **User opens Claude Code** in a project directory and types `/gsd:new-project`
2. **Interview phase:** Claude quizzes the user about goals, tech stack, constraints, preferences. Answers populate `PROJECT.md`.
3. **Research phase:** Four parallel researcher sub-agents each investigate a domain (stack, existing codebase, domain best practices, potential pitfalls). Each writes to a separate file. A synthesizer agent reads all four and produces `PHASE-RESEARCH.md`.
4. **Requirements extraction:** A planner reads the interview answers and research synthesis, extracts must-haves vs nice-to-haves, and writes `REQUIREMENTS.md` with phase mapping.
5. **Roadmap generation:** A roadmapper produces `ROADMAP.md` with phases and phase-to-requirement traceability.
6. **Output:** `PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.MD`, `STATE.md`, `.planning/research/*.md`

### Phase Execution Flow (v1)

For each phase N:

1. `/gsd:discuss-phase N` → Claude asks targeted questions about implementation preferences. Answers saved to `N-CONTEXT.md`.
2. `/gsd:plan-phase N` → Parallel researchers study the phase scope. Planner creates 2-3 atomic task plans in XML format. Plan checker validates against REQUIREMENTS.md. Output: `N-01-PLAN.md`, `N-02-PLAN.md`.
3. `/gsd:execute-phase N` → Each plan spawned as a sub-agent with fresh 200k context. Independent plans run in parallel waves; dependent plans wait. Each completed task gets its own atomic `git commit`. Output: `N-01-SUMMARY.md`, `N-02-SUMMARY.md`.
4. `/gsd:verify-work N` → Verifier agent extracts testable deliverables from REQUIREMENTS.md and checks them. Spawns debugger sub-agents on failures. Output: `N-VERIFICATION.md`, `N-UAT.md`.
5. If verification passes → loop to next phase. On final phase: `/gsd:complete-milestone`.

### Task Plan XML Structure

The atomic task plan format (what plan files contain, also what executor agents receive as their primary prompt):

```xml
<task type="auto">
  <name>Create authentication endpoint</name>
  <files>src/app/api/auth/login/route.ts</files>
  <action>
    Use jose for JWT (not jsonwebtoken).
    Validate credentials against users table.
    Return httpOnly cookie on success.
  </action>
  <verify>curl -X POST localhost:3000/api/auth/login returns 200 + Set-Cookie</verify>
  <done>Valid credentials return cookie, invalid return 401</done>
</task>
```

### Files Created (v1)

```
.planning/
├── research/           # Domain investigation from researchers
├── quick/              # Ad-hoc task tracking
├── threads/            # Persistent context threads
├── todos/              # Captured ideas for later
└── seeds/              # Forward-looking ideas

PROJECT.md              # Vision (always loaded in every agent prompt)
REQUIREMENTS.md         # Scoped v1/v2/deferred with phase mapping
ROADMAP.md              # Progress tracking (checkbox format)
STATE.md                # Decisions, blockers, current position

{phase}-CONTEXT.md      # Implementation decisions (from discuss phase)
{phase}-RESEARCH.md     # Research findings
{phase}-{N}-PLAN.md     # Atomic task plan (XML structure)
{phase}-{N}-SUMMARY.md  # What happened, commits made
{phase}-VERIFICATION.md # Deliverable goal verification results
{phase}-UAT.md          # User acceptance testing checklist
```

---

## Strengths

**1. Zero-friction authentication via runtime piggybacking.** GSD v1 requires no API key, no `.env` file, no OAuth configuration by the user. If Claude Code or Copilot is installed and authenticated, GSD inherits that auth entirely. This eliminates the single biggest friction point in most AI CLI tools.

**2. Context rot elimination by design.** The 200k-token context window is not one long session — it's a sequence of fresh sessions, each receiving only the files it needs. This keeps every executor in the "0-30% sweet spot" where LLM quality is highest, regardless of project complexity.

**3. Multi-runtime portability without code duplication.** A single installer handles Claude Code, OpenCode, Gemini CLI, Codex, Copilot, and Antigravity by applying format transformations at install time (YAML → TOML, tool-name remapping, path rewriting). Same prompt logic reaches six different runtimes.

**4. State persists to human-readable Markdown.** All project state (`PROJECT.md`, `REQUIREMENTS.md`, `STATE.md`, plan files, summary files) is readable, editable, and version-controllable. There is no binary state, no database, no proprietary format. A user can read exactly what the system knows at any point.

**5. Deterministic scaffolding via code, not prompts.** File checks, config lookups, and state mutations run as Bash scripts returning JSON. The LLM is never asked to determine whether a file exists or what phase number to use — code does that. This makes the system reliable and predictable.

**6. Wave-based parallel execution.** Independent tasks in the same phase run simultaneously as parallel sub-agents. Dependent tasks wait. This mirrors how a senior engineering team would execute a sprint — not serially, not randomly, but dependency-ordered with maximum parallelism.

**7. Atomic git commits per task.** Every executor ends with a `git commit`. The resulting history is fully bisectable — each commit represents one atomic deliverable, not "implemented stuff in session 3."

**8. Tiered cost management.** Three model profiles (quality/balanced/budget) let users trade cost against quality. The balanced profile (Opus for planning, Sonnet for execution) is the default and what most real-world usage targets.

---

## Weaknesses / Gaps

**1. Token cost is high.** One frequently cited observation is a ~4:1 overhead ratio versus single-session prompting. The Claude Max plan ($100-200/month) is considered the minimum for regular serious use. Budget-tier users on the Pro plan ($20/month) face rate limits quickly. GSD's parallel agent model multiplies token consumption.

**2. Overkill for small tasks.** The full discuss → plan → execute → verify cycle is 25-45 minutes for a simple feature. Color changes, typo fixes, and single-file edits have no business going through the full pipeline. GSD offers `/gsd:quick` and `/gsd:fast` as escapes, but the mental context switch between "when do I use full GSD vs. quick" adds cognitive overhead.

**3. Spec generation is not the entry point — it is embedded mid-workflow.** GSD does not offer a command like `autospec init --srs requirements.md` that accepts an existing requirements document and generates structured spec files from it. The `/gsd:new-project` command _creates_ requirements from scratch through an interview. Users with an existing SRS or PRD document cannot feed it in directly as a primary input — they must convert it mentally into interview answers or paste it into context manually.

**4. No standalone CLI invocation without an AI runtime.** GSD v1 does not work as a standalone CLI (`autospec init --srs ...`). It requires the user to already be inside Claude Code, OpenCode, Gemini CLI, etc. This means the tool is always subordinate to the runtime, not a peer of it.

**5. `.planning/` directory hygiene is the user's responsibility.** If the user deletes files, renames phases, or edits Markdown manually in ways that break the expected schema, GSD has no recovery path. There is no schema validation on state files.

**6. Brownfield projects require an extra step.** GSD's default assumes greenfield. For existing codebases, users must run `/gsd:map-codebase` before anything else — and skipping this step causes planning conflicts with existing patterns. This should arguably be automatic detection, not an opt-in command.

**7. Discussion phase is easy to rush.** The quality of all downstream artifacts depends entirely on how carefully the user answers the discussion questions. The system cannot enforce or rate the quality of user answers. Vague answers produce vague requirements and plans.

**8. v1 vs v2 fragmentation.** Two separate tools with different installation paths, different file structures (`.planning/` vs `.gsd/`), different command syntax, and different auth models create ecosystem confusion. Users searching for GSD may land on v1 when v2 would serve them better, or vice versa.

---

## Key Lessons for AutoSpec

**1. Piggyback on existing CLI auth — do not require API keys for users who have Claude Code or Copilot.**

GSD v1's most elegant decision is its auth model. AutoSpec should detect existing CLI tools with the same logic: check `$CLAUDE_CONFIG_DIR` / `~/.claude`, `$COPILOT_CONFIG_DIR` / `~/.copilot`, etc. If found, use `claude --print` (subprocess) to call the LLM. Only fall back to SDK + API key if no runtime is detected. This means users who already paid for Claude Max or GitHub Copilot get `autospec init` working in 30 seconds with no additional setup.

**2. Make an existing SRS/PRD/requirements document the primary input — this is the gap GSD doesn't fill.**

GSD builds requirements from scratch via interview. AutoSpec's value proposition is the opposite: `autospec init --srs requirements.md` accepts an existing artifact and generates 10 role-based spec files from it. No other widely-adopted tool in the ecosystem targets this specific workflow. This is a genuine white space. The input document should be injectable directly into the LLM dispatch prompt as `@./requirements.md` — the same way GSD injects `PROJECT.md` into every agent prompt.

**3. Use structured Markdown with YAML frontmatter for all output — no binary formats, no proprietary schemas.**

GSD stores all state in human-readable Markdown files that can be version-controlled, read by humans, and edited manually without breaking the system. AutoSpec's 10 role spec files should follow the same convention: YAML frontmatter (role, version, sprint-ref, generated-by) and Markdown body. This makes the output useful beyond AutoSpec itself.

**4. XML-tagged sections in prompts improve instruction reliability — adopt the pattern.**

GSD uses `<objective>`, `<execution_context>`, and `<process>` XML tags in all its command Markdown files. The design rationale is well-documented: Claude's training treats these as structural boundaries, making multi-step instruction-following more reliable. AutoSpec's LLM prompts for spec generation should use the same pattern: `<role>`, `<input_document>`, `<output_format>`, `<constraints>`.

**5. Deterministic scaffolding in code, not in the LLM prompt.**

GSD's installer does format conversion (YAML → TOML, tool name mapping, path resolution) in Node.js code, not in LLM prompts. AutoSpec should follow the same principle: the CLI scaffolds the output directory, writes YAML frontmatter, and names files deterministically (`01_product_manager.md`, `02_backend_lead.md`, etc.) — the LLM only fills in the content of each file, not its structure. Never ask the LLM to decide file names or output paths.

---

## Sources

- [GitHub — gsd-build/get-shit-done (v1)](https://github.com/glittercowboy/get-shit-done)
- [GitHub — gsd-build/gsd-2 (v2)](https://github.com/gsd-build/gsd-2)
- [GSD Getting Started Guide (gsd-2 docs)](https://github.com/gsd-build/gsd-2/blob/main/docs/getting-started.md)
- [DeepWiki — gsd-build/get-shit-done architecture](https://deepwiki.com/gsd-build/get-shit-done)
- [DeepWiki — Installation guide (2.1)](https://deepwiki.com/gsd-build/get-shit-done/2.1-installation)
- [npm — get-shit-done-cc package](https://www.npmjs.com/package/get-shit-done-cc)
- [Codecentric — The Anatomy of Claude Code Workflows: Turning Slash Commands into an AI Development System](https://www.codecentric.de/en/knowledge-hub/blog/the-anatomy-of-claude-code-workflows-turning-slash-commands-into-an-ai-development-system)
- [GSD Framework: Spec-Driven Development for Claude Code — CC for Everyone](https://ccforeveryone.com/gsd)
- [The Complete Beginner's Guide to GSD — DEV Community](https://dev.to/alikazmidev/the-complete-beginners-guide-to-gsd-get-shit-done-framework-for-claude-code-24h0)
- [GSD Framework Turns Claude Code Into a Full Development Workflow Engine — AI:PRODUCTIVITY](https://aiproductivity.ai/news/gsd-claude-code-workflow-system/)
- [A GSD System for Claude Code — Esteban Torres](https://estebantorr.es/blog/2026/2026-02-03-a-gsd-system-for-claude-code/)
- [Stop Prompting, Start Engineering: GSD Spec-Driven Development — typevar.dev](https://typevar.dev/articles/gsd-build/get-shit-done)
- [6 Best Spec-Driven Development Tools for AI Coding in 2026 — Augment Code](https://www.augmentcode.com/tools/best-spec-driven-development-tools)
- [Spec-driven development with AI: GitHub Blog](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
- [GSD for OpenCode — rokicool/gsd-opencode](https://github.com/rokicool/gsd-opencode)
