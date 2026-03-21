# Research Report: OpenSpec
**Researcher:** B
**Date:** 2026-03-20

---

## What Is OpenSpec

"OpenSpec" is not a single product. Three distinct things share or are associated with the name:

### 1. `@fission-ai/openspec` (npm package / Fission-AI project)
The primary, actively-maintained tool. Published by Fission-AI at `github.com/Fission-AI/OpenSpec`. Latest version: **1.2.0** (February 2026). A globally-installed CLI tool for spec-driven development (SDD). It manages structured markdown artifacts (proposals, specs, design docs, task lists) and generates tool-specific slash-command adapters for 24+ AI coding assistants including Claude Code, Cursor, Windsurf, Gemini CLI, GitHub Copilot, Continue, Amazon Q, Cline, RooCode, Codex, and more.

**Critical insight:** OpenSpec does NOT call any LLM itself. It is a pure file-management and instruction-generation layer. It produces local markdown files and injects context into the user's existing AI assistant via that assistant's native slash-command or skill system.

### 2. `openspec-for-copilot` (VS Code extension, by atman-33)
A community-built VS Code extension at `github.com/atman-33/openspec-for-copilot`. It brings spec-driven workflows into VS Code by sending compiled prompts to GitHub Copilot Chat (via `sendPromptToChat()` utility) or optionally to Codex Chat. Not an official Fission-AI product.

### 3. GitHub Copilot SDK (`@github/copilot-sdk`)
Not "OpenSpec" but directly relevant to the no-API-key model this report targets. Official GitHub SDK for embedding Copilot agent capabilities via JSON-RPC into any Node/Python/Go/.NET application.

---

## LLM Integration Architecture

### Path A: `@fission-ai/openspec` — The Prompt-File Delegation Model

OpenSpec uses zero direct LLM calls. Its architecture is:

```
openspec init
    ↓
Scans for existing AI tool directories (.claude/, .cursor/, .gemini/, etc.)
    ↓
CommandAdapterRegistry generates tool-specific files:
  Claude Code  → .claude/commands/opsx/<workflow>.md
  Cursor       → .cursor/commands/opsx-<workflow>.md
  Gemini CLI   → .gemini/commands/opsx/<workflow>.toml
  Windsurf     → .windsurf/workflows/opsx-<workflow>.md
  GitHub Copilot → .github/prompts/opsx-<workflow>.prompt.md
    ↓
Skills layer: .claude/skills/openspec-propose/SKILL.md (universal YAML-fronted markdown)
```

When the user types `/opsx:propose add-auth` in their AI assistant:

```
User types slash command in AI assistant (Claude Code, Cursor, etc.)
    ↓
AI assistant reads the corresponding SKILL.md / command file
    ↓
Skill instructs AI to run CLI queries:
  openspec status --change add-auth --json
  openspec instructions <artifact> --json
    ↓
CLI returns dynamic instructions (templates + rules + context assembled at runtime)
    ↓
AI generates the artifact files (proposal.md, specs/, design.md, tasks.md)
    ↓
AI writes files to disk in openspec/changes/<change-name>/
```

The LLM (whatever one the user's tool runs on) does the generation work. OpenSpec just orchestrates what that LLM is told to do and what files it should read/write. **The CLI itself never makes an LLM API call.**

Key evidence: The package's runtime dependencies are `commander`, `@inquirer/prompts`, `chalk`, `ora`, `yaml`, `zod`, `fast-glob`, and `posthog-node` — no AI/LLM SDK of any kind.

### Path B: `openspec-for-copilot` VS Code Extension — Chat Participant API

This extension uses VS Code's built-in Language Model API to call Copilot's models without API keys.

**Technical flow:**

```
User clicks "Create Spec" or "Start Task" in VS Code sidebar
    ↓
Extension activates SpecManager / CodeLens handler
    ↓
Prompt compiled via Handlebars templates (PromptLoader service):
  Base template
  → Global custom instructions appended
  → Operation-specific instructions (createSpec / startAllTask / runPrompt)
  → Language directive (if non-English)
    ↓
sendPromptToChat(compiledPrompt) called
    ↓
GitHub Copilot Chat extension receives prompt → sends to Copilot backend
    ↓
Response displayed in VS Code Chat panel; user interacts
```

The `sendPromptToChat()` utility invokes Copilot Chat's existing interface rather than calling `vscode.lm.selectChatModels()` directly. The extension relies on Copilot Chat being installed — it delegates all LLM routing to that extension.

**What the VS Code Language Model API actually does (when used directly):**

```typescript
// In a Chat Participant extension that calls the LLM directly:
const [model] = await vscode.lm.selectChatModels({ vendor: 'copilot' });
// model is backed by user's Copilot subscription — no API key needed

const request = model.sendRequest(messages, {}, cancellationToken);
for await (const fragment of request.text) {
  stream.markdown(fragment);  // stream to Chat panel
}
```

The consent/auth is handled by a one-time VS Code dialog ("Extension X wants to use Copilot models — Allow?"). After consent, the extension can call any Copilot-backed model (gpt-4o, claude-3.5-sonnet, o1, etc.) using the user's subscription. No tokens, no environment variables.

### Path C: GitHub Copilot SDK — JSON-RPC subprocess model

For CLI tools that want Copilot access outside VS Code:

```
Your Node.js process
    ↓
new CopilotClient({ useLoggedInUser: true })
await client.start()
    ↓
SDK spawns: copilot --acp --stdio   (NDJSON JSON-RPC over stdin/stdout)
  (formerly --headless --stdio, changed in 2025; SDK v0.1.23+ handles this)
    ↓
SDK sends: session.create JSON-RPC request
CLI responds: session ID + protocol version
    ↓
SDK sends: session.send { prompt: "..." }
CLI streams: assistant.message_delta events (NDJSON chunks over stdout)
CLI sends:  session.idle event when done
    ↓
SDK dispatches typed events to your handlers
    ↓
await client.stop() → graceful CLI shutdown
```

---

## Authentication Model

### `@fission-ai/openspec`
**No authentication whatsoever.** The CLI is a local file management tool. After `npm install -g @fission-ai/openspec`, no login, no token, no account required. It generates files and reads files. The AI assistant that executes the generated slash commands uses its own auth — whether that is a Copilot subscription, an Anthropic API key already configured for Claude Code, or a Gemini CLI token.

### `openspec-for-copilot` VS Code extension
**Zero additional auth.** Requires only that GitHub Copilot Chat extension is already installed and the user has an active Copilot subscription. The VS Code Language Model API's consent dialog (a one-time per-extension popup) is the only gate. No API keys, no environment variables, no separate login.

### GitHub Copilot SDK
**Multiple authentication options, all designed to reuse existing credentials:**

| Method | How It Works | API Key Required? |
|--------|-------------|-------------------|
| `useLoggedInUser: true` (default) | Reuses credentials from `gh auth login` (GitHub CLI) or Copilot CLI login stored in `~/.config` | No |
| `GITHUB_TOKEN` / `GH_TOKEN` env var | Standard GitHub token (PAT or Actions token) | Yes (but often already present in CI) |
| `githubToken` constructor option | Explicit token passed at runtime | Yes |
| BYOK | Pass your own OpenAI/Anthropic/Azure AI key | Yes (your own key, not GitHub's) |

The `useLoggedInUser: true` path (the default) reads existing authentication state from the Copilot CLI or GitHub CLI. If the user has run `copilot auth login` or `gh auth login` at any prior point, the SDK works with no additional configuration.

---

## Command Structure

### `@fission-ai/openspec` CLI Commands

**Setup:**
```
openspec init [path]       # Interactive setup, auto-detects installed AI tools
openspec init --tools claude,cursor,gemini  # Non-interactive
openspec update [path]     # Regenerate config after CLI upgrade
```

**Project browsing:**
```
openspec list [--specs] [--json]
openspec view              # Interactive TUI dashboard
openspec show [item-name] [--type] [--deltas-only]
openspec status [--json]   # Artifact completion progress (called by AI skills)
```

**Instruction retrieval (called by AI skills at runtime):**
```
openspec instructions <artifact> [--json]  # Dynamic instructions assembly
openspec templates                          # Show resolved template paths
openspec schemas                           # List available schemas
```

**Validation & lifecycle:**
```
openspec validate [item-name] [--all] [--strict]
openspec archive [change-name] [-y]
```

**Schema management:**
```
openspec schema init       # Create custom workflow schema
openspec schema fork       # Duplicate existing schema
openspec schema validate
openspec schema which      # Show active schema
```

**Configuration:**
```
openspec config            # View/modify settings (profile: core|custom, delivery mode: skills|commands|both)
openspec feedback          # Submit GitHub Issue with metadata
openspec completion        # Shell completions (Bash, Fish, PowerShell)
```

### Slash commands installed into AI assistants (generated files, executed by AI tool):

```
/opsx:propose <idea>       # Create change + all planning artifacts at once
/opsx:explore <idea>       # Think/brainstorm without committing artifacts
/opsx:apply [change-id]    # Implement tasks from tasks.md
/opsx:archive [change-id]  # Finalize and merge specs

# Extended profile only:
/opsx:new                  # Scaffold change folder + metadata only
/opsx:continue             # Generate next artifact in dependency order
/opsx:ff                   # Fast-forward: generate all artifacts sequentially
/opsx:verify               # Validate implementation against specs
/opsx:sync                 # Merge delta specs into main specs/ dir
/opsx:bulk-archive         # Archive multiple changes, resolving conflicts
/opsx:onboard              # Interactive 15-min tutorial on real codebase
```

Syntax varies by tool: Claude Code uses `/opsx:propose`, Cursor/Copilot use `/opsx-propose`.

### `openspec-for-copilot` VS Code Commands

- Sidebar panels: Specs Explorer, Prompts Explorer, Steering Explorer
- CodeLens: "Start Task" / "Start All Tasks" (appears inline in tasks.md)
- Command palette actions: Create Spec, Generate Design, Generate Issues, Archive Change
- Configuration namespace: `openspec-for-copilot.aiAgent`, `openspec-for-copilot.copilot.specsPath`, per-operation custom instructions

---

## User Experience Flow

### Flow 1: `@fission-ai/openspec` with Claude Code (CLI path)

```
1. npm install -g @fission-ai/openspec@latest

2. cd my-project && openspec init
   → Interactive: detects .claude/ directory exists
   → Asks: select tools → user picks "Claude Code"
   → Generates:
       .claude/commands/opsx/propose.md
       .claude/commands/opsx/apply.md
       .claude/commands/opsx/archive.md
       .claude/skills/openspec-propose/SKILL.md
       openspec/config.yaml
       openspec/specs/     (empty)
       openspec/changes/   (empty)

3. User opens Claude Code in project, types:
   /opsx:propose add JWT authentication

4. Claude Code reads .claude/commands/opsx/propose.md
   → Skill instructs Claude to run: openspec status --json
   → openspec instructions proposal --json
   → CLI returns assembled instructions (templates + project context)
   → Claude generates:
       openspec/changes/add-jwt-authentication/proposal.md
       openspec/changes/add-jwt-authentication/specs/ (delta specs)
       openspec/changes/add-jwt-authentication/design.md
       openspec/changes/add-jwt-authentication/tasks.md

5. User reviews artifacts, refines via conversation with Claude

6. User types: /opsx:apply add-jwt-authentication
   → Claude reads tasks.md, implements each checklist item
   → Writes code to the actual source files

7. User types: /opsx:archive add-jwt-authentication
   → Delta specs merged into openspec/specs/
   → Change folder archived with audit trail
```

**No API keys involved at any step.** Claude Code uses its own auth (the user's Claude subscription or API key already configured separately).

### Flow 2: `openspec-for-copilot` VS Code extension (VS Code path)

```
1. Install "GitHub Copilot Chat" extension → sign in with GitHub account
2. Install "OpenSpec for Copilot" extension from VS Code Marketplace
3. Run: npm install -g @fission-ai/openspec@latest && openspec init --tools copilot
   → Generates .github/prompts/ prompt files
   → Extension reads these automatically

4. In VS Code sidebar, click OpenSpec panel → "Create New Spec"
   → Extension opens dialog: enter summary, product context, constraints
   → PromptLoader compiles Handlebars template with user input
   → sendPromptToChat() sends compiled prompt to Copilot Chat panel
   → GitHub Copilot generates full spec (requirements, design, tasks) in chat

5. User reviews in chat, iterates conversationally

6. Spec files written to openspec/specs/<spec-name>/

7. Open tasks.md → CodeLens shows "Start Task" above each task
   → Click → Copilot Chat opens with task + related spec context
   → Copilot implements the code
```

**No additional auth needed** beyond the pre-existing Copilot subscription.

### Flow 3: GitHub Copilot SDK in a Node.js CLI tool

```
1. User must have run: copilot auth login (or gh auth login)
   → Credentials stored in ~/.config/...

2. npm install @github/copilot-sdk in your tool

3. In your tool's code:
   const client = new CopilotClient();   // useLoggedInUser: true by default
   await client.start();                 // spawns: copilot --acp --stdio
                                         // SDK sends ping(), verifies protocol version

4. const session = await client.createSession({
     model: 'claude-sonnet-4.5',        // or gpt-5, gpt-4.1, etc.
     onPermissionRequest: approveAll,
   });

5. session.on('assistant.message_delta', (e) => process.stdout.write(e.data.deltaContent));
   session.on('session.idle', resolve);
   await session.send({ prompt: 'Generate 10 role-based spec files from this SRS: ...' });

6. await client.stop();   // graceful shutdown of CLI subprocess
```

**No API key in user code.** The Copilot CLI process handles auth using the user's stored GitHub credentials.

---

## The Copilot SDK JSON-RPC Deep Dive

### Protocol: ACP (Agent Client Protocol)

The current protocol (replacing the deprecated `--headless --stdio`) is invoked via:
```
copilot --acp --stdio
```

The format is **NDJSON (Newline-Delimited JSON) JSON-RPC 2.0** over stdin/stdout pipes.

### Transport Modes

**Mode 1: Stdio (default)**
- SDK spawns `copilot --acp --stdio` as a child process
- JSON-RPC messages flow over stdin/stdout pipes
- One message per line (NDJSON)
- Simplest, lowest latency for single-client scenarios

**Mode 2: TCP**
- CLI binds to a port; multiple SDK clients connect to it
- Useful for shared development environments or debugging
- Connect via `new CopilotClient({ cliUrl: 'localhost:8080' })` (no subprocess spawning)

### Startup Handshake

```
SDK → CLI (stdin):   {"jsonrpc":"2.0","method":"ping","id":1}
CLI → SDK (stdout):  {"jsonrpc":"2.0","result":{"protocolVersion":"..."},"id":1}
```

SDK validates protocol version before proceeding.

### Session Lifecycle (JSON-RPC methods)

```
session.create     → Returns session ID
session.send       → Submit a prompt to the session
session.destroy    → Terminate session cleanly
```

### Event Stream (CLI → SDK notifications)

The CLI emits 79+ typed events. Key ones:

| Event | Direction | Payload |
|-------|-----------|---------|
| `assistant.message_delta` | CLI→SDK | `{ deltaContent: string }` — streaming chunk |
| `assistant.message` | CLI→SDK | `{ content: string }` — complete message |
| `session.idle` | CLI→SDK | Empty — processing complete, ready for next prompt |
| `tool.call` | CLI→SDK | `{ handler: string, args: object }` — LLM wants to call a tool |
| `permission.request` | CLI→SDK | Request for user approval of tool execution |
| `session.created` | CLI→SDK | Client-level: new session instantiated |

### Tool Execution (bidirectional)

When the LLM decides to call a custom tool:
```
CLI → SDK: tool.call { handler: "readFile", args: { path: "..." } }
SDK: invokes registered handler function
SDK → CLI: ToolResult { content: "..." }
CLI: incorporates result, continues generation
```

### Authentication Internals

The CLI manages all auth. The SDK passes credentials via:
- Environment variables (`GITHUB_TOKEN`, `GH_TOKEN`, `COPILOT_GITHUB_TOKEN`)
- `githubToken` option in `CopilotClientOptions`
- Default (`useLoggedInUser: true`): CLI reads from `~/.config/gh/hosts.yml` or Copilot's own credential store — the same tokens used by `gh` CLI

### Historical note: Breaking change in 2025

The flags `--headless --stdio` were removed/modified without deprecation notice in a Copilot CLI auto-update (the CLI silently delegates to downloaded binaries under `~/.copilot/pkg/universal/`). The replacement is `--acp --stdio`. SDK v0.1.23+ (PR copilot-sdk#392, February 2026) handles this transparently. Users on older SDK versions can pin behavior with `cliArgs: ['--no-auto-update']`.

---

## Strengths

### `@fission-ai/openspec`

1. **Genuinely zero-API-key design.** The architecture is philosophically correct: OpenSpec is a coordination layer, not an AI provider. It works with whatever LLM the developer already has authenticated.

2. **Universal + tool-specific layer.** The two-layer approach (universal SKILL.md + tool-specific command adapters for 24 tools) is elegant. One canonical skill definition, automatically transformed into each tool's native format.

3. **Dynamic instruction assembly.** Rather than static prompts, the CLI builds instructions at runtime by calling `openspec instructions --json`. This means the prompt adapts to the current state of the project — which artifacts exist, what's pending, what the config says.

4. **Artifact-driven workflow isolation.** Each feature lives in its own `changes/<name>/` directory. Prevents AI from stomping on specs for unrelated features, which is the "catastrophic forgetting" problem in long AI sessions.

5. **Delta spec pattern.** ADDED/MODIFIED/REMOVED markers in spec files give reviewers intent-focused diffs before code is written, and the archive step merges them cleanly into the canonical `specs/` directory.

6. **Wide tool support (24 tools).** Auto-detection of installed tools during `openspec init` lowers friction significantly.

### `openspec-for-copilot` (VS Code extension)

1. **Leverages VS Code Language Model API correctly.** No API keys — uses Copilot subscription via `sendPromptToChat()` / `vscode.lm.selectChatModels()`.

2. **CodeLens integration.** "Start Task" appearing inline in tasks.md is a low-friction UX that keeps the developer in their editor.

### GitHub Copilot SDK

1. **Clean abstraction over JSON-RPC.** The typed event system and Promise-based `sendAndWait()` hide the complexity of the subprocess communication.

2. **Flexible auth hierarchy.** Four options (logged-in user, env var, explicit token, BYOK) make it work in dev, CI, and production without code changes.

3. **Multi-language.** Node.js, Python, Go, .NET — teams aren't forced into a single runtime.

4. **Multi-model.** At session creation, you specify `model: 'claude-sonnet-4.5'` or `model: 'gpt-5'`. The SDK routes accordingly through Copilot's backend.

---

## Weaknesses / Gaps

### `@fission-ai/openspec`

1. **The CLI calls no LLM — this is also a gap.** For a standalone CLI tool like `autospec init --srs requirements.md`, OpenSpec's architecture doesn't apply directly. OpenSpec assumes an interactive AI assistant session (Claude Code, Cursor, etc.) is running. It cannot generate spec files from a requirements document in a single CLI invocation without human-in-the-loop.

2. **No `init` output from SRS input.** OpenSpec does not accept a requirements file as input to `openspec init`. The project must already exist with human-written specs, or the user must interactively drive the AI assistant through the `/opsx:propose` flow.

3. **Copilot support is weakest.** The docs explicitly note: "GitHub Copilot: uses IDE extension recognition; the CLI doesn't currently consume the prompt files directly." For non-IDE (terminal) Copilot usage, OpenSpec's prompt injection has no path.

4. **Telemetry opt-out is not default.** `posthog-node` dependency collects command names and versions by default; CI disables it, but individual developers must explicitly set `OPENSPEC_TELEMETRY=0`.

5. **Node.js 20.19.0+ hard requirement** may block users on older systems.

6. **No verification that the AI tool actually used the skill.** OpenSpec can only generate the files; it cannot confirm the AI assistant read and followed them.

### `openspec-for-copilot` VS Code extension

1. **VS Code + Copilot subscription lock-in.** No path to use the same workflow in a terminal, CI, or another IDE.

2. **Does not register a Chat Participant (`@openspec`).** Instead of a first-class `@openspec` participant (which would appear in Copilot Chat's participant picker), it uses `sendPromptToChat()` — a more fragile approach that injects prompts into the general chat flow. A proper `vscode.chat.createChatParticipant()` implementation would give better UX isolation.

3. **Requires both Copilot Chat extension AND OpenSpec CLI installed globally.** Two installation steps with potential version mismatch.

### GitHub Copilot SDK

1. **Technical Preview status.** Not yet recommended for production.

2. **Requires Copilot CLI to be installed.** Not just a `npm install` — the user must install the Copilot CLI separately (`gh extension install github/gh-copilot` or standalone installer).

3. **ACP protocol is undocumented.** The NDJSON/JSON-RPC message format is not formally published; it is reverse-engineered from the SDK source and issue threads. Breaking changes occur without deprecation (as demonstrated with the --headless→--acp switch).

4. **`useLoggedInUser` and `cliUrl` are mutually exclusive** — you can't reuse credentials with an external server.

5. **BYOK requires key-based auth only** — Microsoft Entra ID and managed identities not supported, limiting enterprise deployment.

---

## Key Lessons for AutoSpec

### Lesson 1: The "prompt-file delegation" model is the right no-API-key pattern for tool integrations

OpenSpec's approach is the correct answer to "how do you support Claude Code and Copilot without API keys": **generate files that those tools natively consume as slash commands or skills.** For AutoSpec, this means:

- For **Claude Code users**: write a `.claude/commands/autospec-init.md` skill that instructs Claude to call the SRS → spec generation logic. Claude Code's own auth handles the LLM call.
- For **Gemini CLI users**: write a `.gemini/commands/autospec-init.toml` equivalent.
- For **Copilot (VS Code)**: write `.github/prompts/autospec-init.prompt.md`.

The CLI's job becomes: detect installed tools, generate the right adapter files, and provide a `--json` inspection API that the AI skill calls at runtime to get enriched instructions.

### Lesson 2: The Copilot SDK JSON-RPC path is the right answer for a non-interactive CLI flow

When `autospec init --srs requirements.md` must run headlessly (no human driving an AI assistant), the Copilot SDK subprocess model is the clean solution for Copilot users:

```typescript
const client = new CopilotClient();  // useLoggedInUser: true
await client.start();
const session = await client.createSession({ model: 'claude-sonnet-4.5' });
await session.send({ prompt: buildSRSPrompt(srsContent) });
// receive streamed spec files
```

No API key required if the user has already run `copilot auth login`. This is the Copilot equivalent of `claude --print "prompt"` for Claude Code users.

### Lesson 3: Use the VS Code Language Model API (not `sendPromptToChat`) for VS Code integrations

If AutoSpec builds a VS Code extension companion, use `vscode.chat.createChatParticipant()` to register a proper `@autospec` participant, then call `vscode.lm.selectChatModels({ vendor: 'copilot' })` directly. This:
- Requires only the user's Copilot subscription (no API key)
- Gives `@autospec generate --srs requirements.md` as a first-class chat participant command
- Streams responses properly via the `ChatResponseStream`
- Works with all models available in the user's Copilot plan (gpt-4o, claude-3.5-sonnet, o1, etc.)

### Lesson 4: Build the provider-agnostic abstraction as a strategy pattern

OpenSpec's strength is supporting 24 tools; its weakness is having no unified execution path. AutoSpec should define a `LLMProvider` interface and implement multiple strategies:

```typescript
interface LLMProvider {
  isAvailable(): Promise<boolean>;
  generate(prompt: string, options: GenerateOptions): AsyncIterable<string>;
}

// Implementations:
class ClaudeCodeProvider implements LLMProvider {
  // spawn: claude --print "prompt"
  // detect: which claude && claude --version
}

class CopilotSDKProvider implements LLMProvider {
  // @github/copilot-sdk, useLoggedInUser: true
  // detect: copilot --version
}

class AnthropicAPIProvider implements LLMProvider {
  // @anthropic-ai/sdk, requires ANTHROPIC_API_KEY
}

class GeminiCLIProvider implements LLMProvider {
  // spawn: gemini --prompt "prompt"
  // detect: which gemini
}
```

`autospec init` auto-detects which providers are available (checking `PATH` for `claude`, `copilot`, `gemini`; checking for `ANTHROPIC_API_KEY` etc.) and selects the best one, with a `--provider` flag to override.

### Lesson 5: Separate the "generate once" CLI path from the "live skills" integration path

OpenSpec only supports the live-skills path (human drives AI assistant interactively). AutoSpec should offer both:

- **`autospec init --srs requirements.md`**: One-shot headless generation using whichever LLM provider is detected. Generates all 10 role spec files in one command. This is the killer feature OpenSpec lacks.
- **`autospec skills --install`**: OpenSpec-style skill file generation for Claude Code / Cursor / Gemini CLI, so users can also run incremental `/autospec:update-spec` commands interactively in their AI assistant.

The CLI path is for onboarding (day 0); the skills path is for iteration (day 1–N).

---

## Sources

- [Fission-AI/OpenSpec GitHub Repository](https://github.com/Fission-AI/OpenSpec)
- [OpenSpec CLI Documentation (docs/cli.md)](https://github.com/Fission-AI/OpenSpec/blob/main/docs/cli.md)
- [OpenSpec Commands Documentation (docs/commands.md)](https://github.com/Fission-AI/OpenSpec/blob/main/docs/commands.md)
- [OpenSpec Supported Tools (docs/supported-tools.md)](https://github.com/Fission-AI/OpenSpec/blob/main/docs/supported-tools.md)
- [OpenSpec Getting Started (docs/getting-started.md)](https://github.com/Fission-AI/OpenSpec/blob/main/docs/getting-started.md)
- [OpenSpec CHANGELOG](https://github.com/Fission-AI/OpenSpec/blob/main/CHANGELOG.md)
- [OpenSpec npm package (`@fission-ai/openspec`)](https://www.npmjs.com/package/@fission-ai/openspec)
- [openspec.dev official site](https://openspec.dev/)
- [OpenSpec Deep Dive: Architecture & Practice (redreamality.com)](https://redreamality.com/garden/notes/openspec-guide/)
- [DeepWiki: Fission-AI/OpenSpec Getting Started](https://deepwiki.com/Fission-AI/OpenSpec/2-getting-started)
- [atman-33/openspec-for-copilot GitHub Repository](https://github.com/atman-33/openspec-for-copilot)
- [OpenSpec for Copilot — VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=atman-dev.openspec-for-copilot)
- [DeepWiki: openspec-for-copilot Core Concepts](https://deepwiki.com/atman-33/openspec-for-copilot/3-core-concepts)
- [github/copilot-sdk GitHub Repository](https://github.com/github/copilot-sdk)
- [copilot-sdk Node.js README](https://github.com/github/copilot-sdk/blob/main/nodejs/README.md)
- [copilot-sdk Getting Started](https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md)
- [DeepWiki: github/copilot-sdk Architecture](https://deepwiki.com/github/copilot-sdk)
- [@github/copilot-sdk npm package](https://www.npmjs.com/package/@github/copilot-sdk)
- [Breaking Change: --headless --stdio removed (copilot-cli issue #1606)](https://github.com/github/copilot-cli/issues/1606)
- [VS Code Chat Participant API Documentation](https://code.visualstudio.com/api/extension-guides/ai/chat)
- [VS Code Language Model API Documentation](https://code.visualstudio.com/api/extension-guides/ai/language-model)
- [Using GitHub Copilot's LLM in your VS Code extension (Elio Struyf)](https://www.eliostruyf.com/github-copilot-llm-code-extension/)
- [GitHub Copilot SDK — Build AI-Powered DevOps Agents (DEV Community)](https://dev.to/pwd9000/github-copilot-sdk-build-ai-powered-devops-agents-for-your-own-apps-3d05)
- [Building AI agents with the GitHub Copilot SDK (InfoWorld)](https://www.infoworld.com/article/4125776/building-ai-agents-with-the-github-copilot-sdk.html)
