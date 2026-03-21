# Research Report: SpecIt (and LLM-Backed CLI Alternatives)
**Researcher:** C
**Date:** 2026-03-20

---

## 1. What Is SpecIt

**SpecIt** (`specit-cli` on npm, `github.com/Solvely-Colin/SpecIt` on GitHub) is a brand-new tool (first published 2026-03-11, latest version 0.1.2 from 2026-03-16) that runs an adaptive AI interview in a split-pane TUI, captures the conversation into a structured `.spec` YAML file, and exports to multiple AI coding tool formats.

**Tagline:** "One interview. One spec. Every AI tool."

### Implementation Details

- **Language:** Go 1.22+ (Charm TUI libraries for terminal UI)
- **Distribution:** npm wrapper that downloads a platform-specific Go binary via `postinstall` script from GitHub Releases. Also installable via `go install`.
- **npm package:** Only 4 files (install.js, bin/specit shell stub, README.md, package.json) -- the actual binary is downloaded at install time.
- **Author:** Solvely-Colin (colin@solvely.net)
- **License:** MIT
- **Maturity:** Very early (v0.1.2, 3 releases in 5 days)

### What the `.spec` File Contains

The `.spec` is a YAML file with JSON Schema validation containing sections:

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

This is a **project-description spec** (what the project is, what stack it uses, what constraints apply). It is NOT a role-based spec decomposition like AutoSpec produces (product manager spec, backend lead spec, etc.).

---

## 2. LLM Integration Architecture

### SpecIt's Approach

SpecIt auto-detects available AI providers from the environment at first run:

| Provider | Detection Method |
|----------|-----------------|
| Anthropic | `ANTHROPIC_API_KEY` env var OR OAuth via `specit auth anthropic` |
| OpenAI | `OPENAI_API_KEY` env var |
| Google Gemini | OAuth only via `specit auth gemini` |
| GitHub Copilot | OAuth |
| Ollama | Local instance detection (localhost scan) |

On first run, SpecIt shows what providers it found and lets the user pick. No config file needed. The LLM is called during the interview phase to generate adaptive follow-up questions and build the `.spec` preview in real-time (shown in the right pane of the split TUI).

### How Other Tools Call LLMs

#### Aider (Most Mature Multi-Provider Pattern)

Aider uses **litellm** as its abstraction layer, supporting 100+ models across all major providers through a unified `litellm.completion()` call. Architecture:

```
User prompt
  -> Model class (aider/models.py)
    -> litellm.completion() wrapper
      -> Provider API (OpenAI, Anthropic, Google, etc.)
```

**Key design decisions in aider:**
- **Model aliases:** Short names like "sonnet" resolve to full provider/model strings
- **model-settings.yml:** Per-model behavioral config (edit format, repo map support, streaming)
- **model-metadata.json:** Technical specs (context window, pricing)
- **Multi-layered env search:** CLI `--set-env` > CWD `.env` > git root `.env` > home `.env` > `~/.aider/oauth-keys.env`
- **Weak/editor models:** Different (cheaper) models for commit messages, summarization, editing -- cost optimization within a single session

#### ai-scaffold (Simplest Approach)

Direct OpenAI API call via axios. Single model (gpt-4-0613), single env var (`SCAFFOLD_APIKEY`). Reads `prompt.txt`, calls GPT-4, writes files to `builds/` directory. No provider abstraction at all.

#### GitHub Spec Kit (No Direct LLM Calls)

Spec Kit does NOT call LLMs. It generates structured prompt templates that agents consume via their own auth. The tool creates slash commands (`/speckit.specify`, `/speckit.plan`, etc.) that are executed inside whatever AI agent the user has (Claude Code, Copilot, Cursor, etc.). Each agent handles its own API credentials.

#### OpenSpec (No Direct LLM Calls)

Same pattern as Spec Kit: generates structured slash commands (`/opsx:propose`, `/opsx:apply`) that AI assistants interpret. No API keys needed. Works with 20+ AI tools. Node.js CLI that creates markdown artifacts.

#### create-ai-scaffold (Hybrid)

Generates `.ai/` directory structure with `assistant.md`, `buildplan.md`, etc. For the `sync` command, it tries to detect and use:
1. Claude Code CLI (first choice)
2. OpenAI Codex CLI (second choice)
3. Clipboard fallback (copies prompt for manual paste)

Supports `--dry-run` to preview the prompt without invoking AI.

---

## 3. Authentication Model

### Comparison Table

| Tool | Auth Method | Zero-Config Possible? |
|------|------------|----------------------|
| **SpecIt** | Auto-detect env vars + OAuth commands | Yes, if any provider env var is set |
| **Aider** | Env vars (.env cascade) + OAuth tokens | Yes, with .env file |
| **ai-scaffold** | Single env var (`SCAFFOLD_APIKEY`) | No, must set key |
| **Spec Kit** | Delegates to agent (each agent's own auth) | Yes, if agent is logged in |
| **OpenSpec** | No auth needed (no LLM calls) | Yes |
| **create-ai-scaffold** | Delegates to detected CLI tool | Yes, if Claude/Codex CLI is logged in |

### Claude Code CLI Auth (Critical for AutoSpec)

Claude Code supports multiple auth flows:
- `claude auth login` -- Anthropic account (subscription-based)
- `claude auth login --console` -- Anthropic Console (API usage billing)
- `claude auth status` -- Check auth state (exit code 0 = logged in)
- When used as subprocess: `claude -p "prompt"` uses whatever auth is already configured

### GitHub Copilot SDK Auth

- `COPILOT_GITHUB_TOKEN`, `GH_TOKEN`, or `GITHUB_TOKEN` env vars
- OAuth from stored GitHub CLI credentials
- BYOK (Bring Your Own Key) for custom LLM providers
- Requires GitHub Copilot subscription (unless BYOK)
- Communication: JSON-RPC 2.0 over stdio (SDK manages CLI process lifecycle)

### Gemini CLI Auth

- `gemini -p "prompt"` for headless/non-interactive mode
- Authentication configured separately (Google account)
- Output formats: text (default) or JSON (`--output-format json`)

---

## 4. Command Structure

### SpecIt Commands

| Command | Purpose |
|---------|---------|
| `specit init` | Run adaptive interview, generate `.spec` |
| `specit export [--format FORMAT]` | Convert to target framework (specit, gsd, gsd-2) |
| `specit validate [--ci]` | Check codebase compliance with spec |
| `specit diff` | Detect specification drift |
| `specit import` | Reverse-engineer `.spec` from existing configs |
| `specit planning [save/use/list]` | Manage multiple planning profiles |
| `specit plugin [add/list/remove]` | Plugin management |
| `specit auth [provider]` | Configure OAuth for providers |

### Spec Kit Commands (Comparator)

| Command | Purpose |
|---------|---------|
| `specify init [name] --ai [agent]` | Initialize SDD project |
| `specify check` | Verify installed tools |
| `/speckit.specify` | Define requirements (via agent slash command) |
| `/speckit.plan` | Create implementation plan |
| `/speckit.tasks` | Generate task list |
| `/speckit.implement` | Execute tasks |
| `/speckit.clarify` | Address underspecified areas |
| `/speckit.analyze` | Cross-artifact consistency check |

### OpenSpec Commands (Comparator)

| Command | Purpose |
|---------|---------|
| `openspec init` | Initialize in project |
| `/opsx:propose "idea"` | Generate proposal + specs + design + tasks |
| `/opsx:apply` | Implement the tasks |
| `/opsx:archive` | Archive completed work |
| `/opsx:verify` | Verify implementation |
| `/opsx:sync` | Sync state |

---

## 5. User Experience Flow

### SpecIt End-to-End

```
1. npm install -g specit-cli        # Downloads Go binary via postinstall
2. cd my-project
3. specit init                       # Opens split-pane TUI
   ├─ Left pane: Interview questions (adaptive, context-aware)
   ├─ Right pane: Live .spec YAML preview
   ├─ Codebase auto-scanned for context
   ├─ /deep for detailed answers, /brief for quick
   └─ /done to finish
4. specit export --format gsd        # Converts .spec to .planning/ directory
5. specit validate                   # Checks code matches spec
6. specit diff                       # Detects drift over time
```

**Unique:** The interview is a conversation (not a form). The LLM adapts follow-up questions based on previous answers and codebase context. The `.spec` builds incrementally during the interview.

### Aider End-to-End (For Comparison)

```
1. pip install aider-chat
2. export ANTHROPIC_API_KEY=sk-...   # Or any provider key
3. cd my-project
4. aider                             # Opens REPL
   ├─ Auto-detects git repo
   ├─ Builds repo map
   └─ User chats, aider edits files
```

### Claude Code as Subprocess (Key for AutoSpec)

```bash
# Simple prompt -> text output
claude -p "Generate a product spec for: $(cat requirements.txt)"

# Structured JSON output
claude -p --output-format json "Generate specs"

# Streaming JSON (NDJSON)
claude -p --output-format stream-json "Generate specs"

# With custom system prompt
claude --system-prompt-file ./sdd-system-prompt.txt -p "Generate the backend lead spec from: $(cat srs.md)"

# With JSON Schema validation
claude -p --json-schema '{"type":"object","properties":{"spec":{"type":"string"}}}' "Generate spec"

# Budget control
claude -p --max-budget-usd 2.00 "Generate all 10 specs"

# Model selection
claude --model opus -p "Complex reasoning task"
claude --model sonnet -p "Simple formatting task"

# Piping
cat srs.md | claude -p "Convert this SRS to a product manager spec"
```

---

## 6. Broader Pattern: LLM-Backed CLIs

### Three Architecture Patterns Identified

#### Pattern A: Direct API Call (ai-scaffold, custom tools)
```
CLI -> HTTP SDK (openai, @anthropic-ai/sdk) -> Provider API
```
- Simplest to implement
- Requires API key
- Single provider lock-in (unless using litellm)
- Full control over prompts, models, parameters

#### Pattern B: CLI Subprocess Delegation (create-ai-scaffold, what AutoSpec should do)
```
CLI -> spawn("claude", ["-p", prompt]) -> Claude Code handles auth
CLI -> spawn("gemini", ["-p", prompt]) -> Gemini CLI handles auth
CLI -> CopilotSDK.init() -> JSON-RPC -> Copilot CLI handles auth
```
- Zero API key setup if user has existing CLI tools
- Leverages existing auth (subscription, OAuth)
- Output parsing needed (text or JSON)
- Multiple providers via different subprocess commands

#### Pattern C: Prompt Template Generation (Spec Kit, OpenSpec)
```
CLI -> generates .md files with structured prompts
User -> opens AI agent -> runs /slash-command -> agent calls LLM
```
- Zero LLM dependency in the CLI itself
- Works with ANY agent that supports slash commands
- No auth, no API calls, no cost from the CLI
- User must have a separate AI tool
- Cannot be fully automated / CI-integrated

### Multi-Provider Support Patterns

**Aider's litellm approach:** Single abstraction layer that normalizes all providers. Model name prefix determines provider (`anthropic/claude-sonnet-4`, `openai/gpt-4`). Most flexible but adds a Python dependency.

**SpecIt's auto-detect approach:** Scan environment for available provider keys/tools, present options to user. Works at install/first-run time.

**Copilot SDK's BYOK approach:** Default to Copilot's models via GitHub auth, but allow users to bring their own API keys for any provider.

### Structured Output Patterns

| Tool | Output Format |
|------|--------------|
| Claude Code CLI | `--output-format json` (single JSON), `stream-json` (NDJSON), `--json-schema` (validated) |
| Gemini CLI | `--output-format json` (response + stats) |
| Copilot SDK | JSON-RPC responses (structured by protocol) |
| Aider | Diff format or whole-file edits (configurable per model) |

---

## 7. Strengths

### SpecIt
- **Interview-driven UX** is genuinely novel -- conversational spec building rather than form filling
- **Multi-framework export** solves the N-frameworks problem with one canonical `.spec`
- **Auto-detection** of available LLM providers eliminates config friction
- **Validation + drift detection** keeps specs alive post-creation
- **Split-pane TUI** gives immediate feedback as the spec builds

### Spec Kit (GitHub)
- **Massive adoption** (78.9k stars) -- clear market validation for SDD
- **Agent-agnostic** design (25+ supported tools) -- no vendor lock-in
- **Gated workflow** (specify -> plan -> tasks -> implement) prevents premature coding
- **Extension/preset system** allows customization without forking
- **No LLM dependency** in the CLI itself -- pure prompt orchestration

### Aider
- **litellm** provides the gold standard for multi-provider LLM abstraction
- **.env cascade** (CWD -> git root -> home -> oauth) is the most flexible auth model
- **Model aliases** (`sonnet`, `opus`) make CLI UX clean
- **Weak/editor model** pattern enables cost optimization

### OpenSpec
- **Brownfield-first** design (existing codebases, not greenfield) is a smart niche
- **Artifact graph** tracks change state automatically
- **No API keys** needed -- works within whatever agent you already use

---

## 8. Weaknesses / Gaps

### SpecIt
- **Very early** (v0.1.2, 9 days old) -- likely unstable, API surface will change
- **Go binary distribution via npm** is unusual and may cause install issues
- **Limited export formats** (only specit, gsd, gsd-2) -- no Claude Code, Cursor, etc.
- **Single `.spec` file** is flat -- no role decomposition (no separate PM spec, backend spec, etc.)
- **Interview approach** doesn't scale for large/complex requirements documents
- **No headless/non-interactive mode** -- cannot be used in CI/CD

### Spec Kit
- **No direct LLM calls** -- cannot generate specs autonomously; requires human-in-the-loop with an AI agent
- **Slash command dependency** -- needs a compatible agent to actually do work
- **Heavy** -- complex extension/preset system for what could be simpler
- **Python (uv) dependency** -- requires Python ecosystem for a tool that generates markdown

### Aider
- **Coding assistant, not spec generator** -- wrong tool category for AutoSpec's needs
- **Python-only** -- not usable from a Node.js CLI without subprocess
- **litellm is Python** -- cannot be imported into TypeScript/Node.js directly

### OpenSpec
- **No autonomous generation** -- slash commands require manual agent interaction
- **No multi-provider support** -- entirely dependent on host agent's capabilities
- **Proposal-centric** -- one change at a time, not whole-project spec decomposition

### General Gap Across All Tools
**No tool in this landscape does what AutoSpec proposes:** take an SRS/requirements document as input, call an LLM with reasoning power, and output 10 role-based spec files (product manager, backend lead, frontend lead, DevOps, etc.) in a single automated run. This is a genuinely unserved niche.

---

## 9. Key Lessons for AutoSpec

### Lesson 1: Use Pattern B (CLI Subprocess Delegation) as Primary, Pattern A (Direct API) as Fallback

The strongest UX pattern is: detect what the user already has installed and use it.

**Priority order for AutoSpec:**
1. `claude -p` -- if Claude Code CLI is installed and authenticated
2. `gemini -p` -- if Gemini CLI is installed and authenticated
3. Copilot SDK (`@github/copilot-sdk`) -- if GitHub CLI is authenticated
4. Direct Anthropic SDK (`@anthropic-ai/sdk`) -- if `ANTHROPIC_API_KEY` is set
5. Direct OpenAI SDK -- if `OPENAI_API_KEY` is set

Detection: check `which claude`, `which gemini`, `gh auth status`, then env vars.

### Lesson 2: Claude Code's `--json-schema` Flag Is a Game-Changer

Claude Code CLI supports `claude -p --json-schema '{...}' "prompt"` which returns validated structured output. AutoSpec can define a JSON Schema for each spec file type and get guaranteed-parseable output without manual extraction. This is far superior to parsing free-form text.

Combined with `--system-prompt-file`, AutoSpec can:
```bash
claude -p \
  --system-prompt-file ./prompts/backend-lead.txt \
  --json-schema "$(cat ./schemas/backend-spec.json)" \
  --max-budget-usd 1.00 \
  "Generate the backend lead spec from this SRS: $(cat srs.md)"
```

### Lesson 3: Adopt Aider's .env Cascade for API Key Discovery

When falling back to direct API calls, search for keys in this order:
1. CLI flag (`--api-key`)
2. Environment variable (`ANTHROPIC_API_KEY`)
3. CWD `.env` file
4. Git root `.env` file
5. Home directory `.env` file

This matches developer expectations from aider and other tools.

### Lesson 4: SpecIt's Auto-Detection UX Is Worth Copying

On first run, scan for available providers and present a clear summary:
```
Detected LLM providers:
  [check] Claude Code CLI (authenticated as user@example.com)
  [check] ANTHROPIC_API_KEY (set in ~/.env)
  [x] Gemini CLI (not installed)
  [x] GitHub Copilot (not authenticated)

Using: Claude Code CLI (--print mode)
Override with: autospec generate --provider anthropic-sdk
```

### Lesson 5: AutoSpec's Role Decomposition Is Genuinely Novel

No existing tool generates role-based spec decomposition. SpecIt produces a single flat `.spec`. Spec Kit produces a single `spec.md`. OpenSpec produces a single `proposal.md + specs/`. AutoSpec's 10-role decomposition (PM, backend lead, frontend lead, DB architect, DevOps, QA, security, UX, AI/ML, documentation) is a differentiated feature that should be highlighted in positioning.

---

## 10. Sources

### Primary Tools Researched

- [SpecIt on npm](https://npm.im/specit-cli) -- v0.1.2, published 2026-03-16
- [SpecIt on GitHub](https://github.com/Solvely-Colin/SpecIt) -- Solvely-Colin, MIT license
- [GitHub Spec Kit](https://github.com/github/spec-kit) -- 78.9k stars, Apache 2.0
- [OpenSpec (Fission-AI)](https://github.com/Fission-AI/OpenSpec) -- SDD framework, Node.js
- [ai-scaffold](https://github.com/nodesman/ai-scaffold) -- GPT-4 project scaffolder
- [create-ai-scaffold](https://github.com/kylewebdev/create-ai-scaffold) -- AI collaboration layer scaffolder
- [Aider](https://github.com/Aider-AI/aider) -- AI pair programming CLI
- [Aider LLM docs](https://aider.chat/docs/llms.html) -- Multi-provider connection guide
- [Aider Multi-Provider Architecture (DeepWiki)](https://deepwiki.com/Aider-AI/aider/6.3-multi-provider-llm-integration)

### CLI/SDK References

- [Claude Code CLI Reference](https://code.claude.com/docs/en/cli-reference) -- Full flag documentation
- [GitHub Copilot SDK](https://github.com/github/copilot-sdk) -- JSON-RPC, multi-language, technical preview
- [Copilot SDK on npm](https://www.npmjs.com/package/@github/copilot-sdk) -- Node.js SDK
- [Gemini CLI Headless Mode](https://google-gemini.github.io/gemini-cli/docs/cli/headless.html) -- Non-interactive usage
- [Copilot SDK InfoQ Coverage](https://www.infoq.com/news/2026/02/github-copilot-sdk/)

### Market Context

- [Spec Kit GitHub Blog Post](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
- [CLI AI Assistants Compared 2026 (sanj.dev)](https://sanj.dev/post/comparing-ai-cli-coding-assistants)
- [Best Spec-Driven Development Tools (Augment Code)](https://www.augmentcode.com/tools/best-spec-driven-development-tools)
- [Spec Kit Review (vibecoding.app)](https://vibecoding.app/blog/spec-kit-review)
