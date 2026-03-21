# AutoSpec CLI LLM Integration — Proposal v1
**Author:** Head Researcher
**Date:** 2026-03-20
**Based on:** Research reports from Researchers A (GSD), B (OpenSpec), C (SpecIt)

## Executive Summary

AutoSpec occupies a genuine white space in the SDD ecosystem: no existing tool accepts an SRS/requirements document and generates 10 role-based spec files in a single automated CLI invocation. GSD builds requirements from scratch via interview; OpenSpec and Spec Kit delegate all generation to the user's interactive AI session; SpecIt produces a single flat `.spec` file. AutoSpec's `autospec generate --srs requirements.md` command — producing `01_product_manager.md` through `10_ui_designer.md` plus `backlog.md` — is a differentiated, unserved workflow. The CLI should detect the user's existing AI tooling (Claude Code, Gemini CLI, Copilot) and piggyback on their authentication, falling back to direct API keys only when no CLI tool is installed.

---

## 1. Provider Architecture

### Detection Priority Order

When `autospec generate` runs, it resolves an LLM provider using this priority chain. The first available provider wins, unless overridden by `--provider`.

| Priority | Provider | Detection Method | Mechanism | Latency |
|----------|----------|-----------------|-----------|---------|
| 1 | Claude Code CLI | `which claude` exits 0 AND `claude auth status` exits 0 | Subprocess: `claude -p --system-prompt-file ... --max-budget-usd ...` | ~5-30s per spec |
| 2 | Gemini CLI | `which gemini` exits 0 | Subprocess: `gemini -p "prompt"` | ~5-20s per spec |
| 3 | GitHub Copilot | `which copilot` exits 0 OR `gh auth status` exits 0 | `@github/copilot-sdk` JSON-RPC over stdio | ~5-20s per spec |
| 4 | Anthropic API | `ANTHROPIC_API_KEY` env var set | `@anthropic-ai/sdk` direct HTTP | ~5-15s per spec |
| 5 | OpenAI API | `OPENAI_API_KEY` env var set | `openai` npm SDK direct HTTP | ~5-15s per spec |
| 6 | Ollama (local) | `curl -s http://localhost:11434/api/tags` succeeds | HTTP to local Ollama API | ~10-60s per spec |

### Provider Interface (Strategy Pattern)

All providers implement a single interface. The CLI never interacts with provider-specific APIs directly.

```typescript
interface LLMProvider {
  readonly name: string;
  readonly requiresApiKey: boolean;

  /** Check if this provider is available on the current system */
  isAvailable(): Promise<boolean>;

  /** Generate text from a prompt, streaming chunks */
  generate(prompt: string, options: GenerateOptions): AsyncIterable<string>;

  /** Optional: generate with validated JSON output */
  generateJSON?<T>(prompt: string, schema: JSONSchema, options: GenerateOptions): Promise<T>;
}

interface GenerateOptions {
  systemPrompt?: string;
  model?: string;          // e.g., "opus", "sonnet", "gpt-4o"
  maxBudgetUsd?: number;   // cost cap (Claude Code only)
  temperature?: number;
  maxTokens?: number;
}
```

### Implementation per Provider

**ClaudeCodeProvider** — subprocess delegation, zero API key:
```typescript
class ClaudeCodeProvider implements LLMProvider {
  readonly name = 'claude-code';
  readonly requiresApiKey = false;

  async isAvailable(): Promise<boolean> {
    try {
      const { exitCode } = await execa('claude', ['auth', 'status']);
      return exitCode === 0;
    } catch { return false; }
  }

  async *generate(prompt: string, opts: GenerateOptions): AsyncIterable<string> {
    const args = ['-p', '--output-format', 'stream-json'];
    if (opts.systemPrompt) {
      // Write system prompt to temp file, pass via --system-prompt-file
      const tmpFile = await writeTempFile(opts.systemPrompt);
      args.push('--system-prompt-file', tmpFile);
    }
    if (opts.maxBudgetUsd) args.push('--max-budget-usd', String(opts.maxBudgetUsd));
    if (opts.model) args.push('--model', opts.model);

    const proc = execa('claude', [...args, prompt], { stdout: 'pipe' });
    for await (const line of readline(proc.stdout!)) {
      const event = JSON.parse(line);
      if (event.type === 'assistant' && event.content) yield event.content;
    }
  }

  async generateJSON<T>(prompt: string, schema: JSONSchema, opts: GenerateOptions): Promise<T> {
    const args = ['-p', '--json-schema', JSON.stringify(schema)];
    if (opts.systemPrompt) {
      const tmpFile = await writeTempFile(opts.systemPrompt);
      args.push('--system-prompt-file', tmpFile);
    }
    if (opts.maxBudgetUsd) args.push('--max-budget-usd', String(opts.maxBudgetUsd));
    const { stdout } = await execa('claude', [...args, prompt]);
    return JSON.parse(stdout);
  }
}
```

**GeminiCLIProvider** — subprocess delegation, zero API key:
```typescript
class GeminiCLIProvider implements LLMProvider {
  readonly name = 'gemini-cli';
  readonly requiresApiKey = false;

  async isAvailable(): Promise<boolean> {
    try {
      await execa('gemini', ['--version']);
      return true;
    } catch { return false; }
  }

  async *generate(prompt: string, opts: GenerateOptions): AsyncIterable<string> {
    const { stdout } = await execa('gemini', ['-p', prompt]);
    yield stdout;
  }
}
```

**CopilotSDKProvider** — JSON-RPC via `@github/copilot-sdk`:
```typescript
class CopilotSDKProvider implements LLMProvider {
  readonly name = 'copilot-sdk';
  readonly requiresApiKey = false;

  async isAvailable(): Promise<boolean> {
    try {
      const { exitCode } = await execa('gh', ['auth', 'status']);
      return exitCode === 0;
    } catch { return false; }
  }

  async *generate(prompt: string, opts: GenerateOptions): AsyncIterable<string> {
    const { CopilotClient } = await import('@github/copilot-sdk');
    const client = new CopilotClient({ useLoggedInUser: true });
    await client.start();
    const session = await client.createSession({
      model: opts.model ?? 'claude-sonnet-4.5',
    });

    const chunks: string[] = [];
    session.on('assistant.message_delta', (e: any) => {
      chunks.push(e.data.deltaContent);
    });

    await new Promise<void>((resolve) => {
      session.on('session.idle', resolve);
      session.send({ prompt });
    });

    await client.stop();
    yield chunks.join('');
  }
}
```

**AnthropicAPIProvider** — direct SDK, requires API key:
```typescript
class AnthropicAPIProvider implements LLMProvider {
  readonly name = 'anthropic-api';
  readonly requiresApiKey = true;

  async isAvailable(): Promise<boolean> {
    return !!this.resolveApiKey();
  }

  private resolveApiKey(): string | undefined {
    // Aider-style .env cascade
    return process.env.ANTHROPIC_API_KEY
      ?? readDotEnv(process.cwd())?.ANTHROPIC_API_KEY
      ?? readDotEnv(gitRoot())?.ANTHROPIC_API_KEY
      ?? readDotEnv(os.homedir())?.ANTHROPIC_API_KEY;
  }

  async *generate(prompt: string, opts: GenerateOptions): AsyncIterable<string> {
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const client = new Anthropic({ apiKey: this.resolveApiKey() });
    const stream = client.messages.stream({
      model: opts.model ?? 'claude-sonnet-4-20250514',
      max_tokens: opts.maxTokens ?? 8192,
      system: opts.systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    });
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text;
      }
    }
  }
}
```

### Provider Resolution

```typescript
async function resolveProvider(override?: string): Promise<LLMProvider> {
  if (override) {
    const provider = PROVIDERS.find(p => p.name === override);
    if (!provider) throw new Error(`Unknown provider: ${override}`);
    if (!(await provider.isAvailable())) {
      throw new Error(`Provider ${override} is not available. Check auth/installation.`);
    }
    return provider;
  }

  for (const provider of PROVIDERS) {
    if (await provider.isAvailable()) return provider;
  }

  throw new Error(
    'No LLM provider found.\n\n' +
    'Install one of:\n' +
    '  • Claude Code CLI: npm install -g @anthropic-ai/claude-code\n' +
    '  • Gemini CLI: npm install -g @google/gemini-cli\n' +
    '  • GitHub Copilot: gh auth login\n' +
    '  • Or set ANTHROPIC_API_KEY / OPENAI_API_KEY\n'
  );
}
```

### Fallback Chain

If the primary provider fails mid-generation (rate limit, auth expired, network error):

1. **Transient errors** (429, 500, 503): retry 3 times with exponential backoff (1s, 3s, 9s)
2. **Auth errors** (401, 403): skip to next provider in priority chain
3. **Permanent errors** (invalid model, billing exhausted): halt with clear error message
4. **Partial completion**: specs already written to disk are preserved; re-running skips completed specs (idempotent)

---

## 2. Authentication Strategy

### Zero-Config Principle

The defining UX goal: **a user who already has Claude Code, Gemini CLI, or GitHub Copilot authenticated should get `autospec generate` working with zero additional setup.** No `.env` file, no API key, no OAuth flow.

### Per-Provider Auth Mechanism

| Provider | Auth Source | User Action Required |
|----------|-----------|---------------------|
| Claude Code CLI | Claude Code's own auth store (`~/.claude/`) | None — already logged in via `claude auth login` |
| Gemini CLI | Google account stored by Gemini CLI | None — already logged in via `gemini auth login` |
| Copilot SDK | GitHub CLI credentials (`~/.config/gh/hosts.yml`) | None — already logged in via `gh auth login` |
| Anthropic API | `ANTHROPIC_API_KEY` env var or `.env` file | Must set API key once |
| OpenAI API | `OPENAI_API_KEY` env var or `.env` file | Must set API key once |
| Ollama | No auth (local) | Must have Ollama running |

### API Key Discovery Cascade (for direct-API fallback)

Adopted from Aider's proven pattern:

1. `--api-key <key>` CLI flag (highest priority)
2. `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` environment variable
3. `.env` in current working directory
4. `.env` in git root directory
5. `~/.autospec/.env` in home directory

### Environment Variable Naming

```bash
# Provider-specific keys (only needed if no CLI tool installed)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# AutoSpec configuration
AUTOSPEC_PROVIDER=claude-code     # Override auto-detection
AUTOSPEC_MODEL=opus               # Override default model
AUTOSPEC_MAX_BUDGET=5.00          # Max cost per generation run (USD)
AUTOSPEC_DEBUG=1                  # Verbose logging
NO_COLOR=1                       # Disable terminal colors
```

### First-Run Detection UX

On first invocation, display discovered providers (inspired by SpecIt):

```
  autospec — LLM Provider Detection

  ✓ Claude Code CLI    authenticated (user@example.com)
  ✓ ANTHROPIC_API_KEY  found in ~/.env
  ✗ Gemini CLI         not installed
  ✗ GitHub Copilot     not authenticated

  Using: Claude Code CLI (subprocess mode)
  Override: autospec generate --provider anthropic-api
```

---

## 3. Command Design

### Command Structure

The CLI exposes three tiers of commands: **generate** (the killer feature), **manage** (existing scaffolding), and **inspect** (status/info).

```bash
# ═══════════ TIER 1: Generate (NEW — LLM-backed) ═══════════

autospec generate --srs <file>          # Generate 10 specs + backlog from SRS document
autospec generate --srs <file> --spec 02_backend_lead   # Regenerate single spec
autospec generate --interview           # Interactive interview mode (SpecIt-inspired)
autospec generate --url <url>           # Fetch requirements from URL, then generate

# ═══════════ TIER 2: Manage (existing, enhanced) ═══════════

autospec init                           # Scaffold project (template-based, no LLM)
autospec init --from-specs              # Scaffold from already-generated specs
autospec sprint <N>                     # Generate sprint execution prompt
autospec spec <name>                    # Generate a feature spec (LLM-backed)

# ═══════════ TIER 3: Inspect ═══════════

autospec status [sprint]                # Sprint progress from backlog
autospec providers                      # List detected LLM providers
autospec version                        # CLI version
```

### The `generate` Command — Primary Interface

```bash
autospec generate --srs requirements.md [options]
```

| Option | Description | Default |
|--------|-------------|---------|
| `--srs <file>` | Path to SRS/PRD/requirements document | Required (unless `--interview`) |
| `--interview` | Interactive interview mode (no SRS file needed) | `false` |
| `--url <url>` | Fetch requirements from URL | — |
| `--provider <name>` | Force specific LLM provider | Auto-detect |
| `--model <name>` | Model override (opus, sonnet, gpt-4o) | Provider default |
| `--spec <name>` | Generate only one spec file | All 10 + backlog |
| `--output <dir>` | Output directory | `./specs/` |
| `--max-budget <usd>` | Maximum cost cap in USD | `5.00` |
| `--format <fmt>` | Output format (markdown, yaml) | `markdown` |
| `--dry-run` | Show what would be generated, don't call LLM | `false` |
| `--force` | Overwrite existing spec files | `false` |
| `--verbose` | Show prompts and raw LLM output | `false` |

### Input Formats

1. **SRS file** (`--srs requirements.md`): Markdown, plain text, or YAML. The file is read in full and injected into the generation prompt.
2. **Interactive interview** (`--interview`): Adaptive questioning in the terminal (like SpecIt but without the split-pane TUI). Questions adapt based on previous answers. Produces an intermediate SRS before generating specs.
3. **URL** (`--url https://...`): Fetches the page, extracts text content, uses it as SRS input. Useful for Google Docs, Notion pages, GitHub issues.
4. **Stdin pipe**: `cat requirements.md | autospec generate --srs -` reads from stdin.

### Output Structure

All generated files go to `specs/` (or `--output` override):

```
specs/
├── 01_product_manager.md     # Vision, personas, user stories
├── 02_backend_lead.md        # API design, services, architecture
├── 03_frontend_lead.md       # Components, state, routing
├── 04_db_architect.md        # Schema, migrations, indexes
├── 05_qa_lead.md             # Test strategy, coverage
├── 06_devops_lead.md         # CI/CD, infrastructure
├── 07_marketing_lead.md      # Go-to-market, positioning
├── 08_finance_lead.md        # Pricing, cost estimates
├── 09_business_lead.md       # Strategy, competition
├── 10_ui_designer.md         # Screens, wireframes, accessibility
├── backlog.md                # Sprint-decomposed tickets
└── .autospec-meta.json       # Generation metadata (model, cost, timestamp, SRS hash)
```

Each generated file includes YAML frontmatter:

```yaml
---
role: backend_lead
spec_version: 1.0
generated_by: autospec v0.2.0
model: claude-sonnet-4-20250514
provider: claude-code
source_srs: requirements.md
source_hash: sha256:abc123...
generated_at: 2026-03-20T14:30:00Z
---
```

### Progress UX

```
  autospec generate — 10 specs + backlog from requirements.md

  Provider: Claude Code CLI (sonnet)
  Input: requirements.md (2,847 words)

  [1/11] 01_product_manager.md    ████████████████████ done  (4.2s, 1,247 tokens)
  [2/11] 02_backend_lead.md       ████████████░░░░░░░░ 62%   streaming...
  [3/11] 03_frontend_lead.md      ░░░░░░░░░░░░░░░░░░░░ queued
  ...
  [11/11] backlog.md              ░░░░░░░░░░░░░░░░░░░░ queued

  Estimated cost: ~$0.45 | Elapsed: 12s
```

- **Spinner** for single-spec generation
- **Multi-line progress** for full generation (11 items)
- **Streaming** display when `--verbose` is set
- **Cost tracking** displayed at completion (from token counts)

---

## 4. Spec Generation Pipeline

### Architecture: Chained Calls (NOT Single Mega-Prompt)

A single mega-prompt asking for all 10 specs would exceed quality thresholds. Instead, the pipeline uses **chained sequential calls** — one LLM call per spec file, each receiving the SRS plus a role-specific system prompt.

```
SRS Document
    │
    ▼
[1] Extract project metadata (name, type, stack, domain)
    │  → Small, fast call. Output: structured JSON.
    │  → Used as context for all subsequent calls.
    │
    ▼
[2] Generate spec 01_product_manager.md
    │  System prompt: role definition + output format + constraints
    │  User prompt: SRS + project metadata
    │  → Write to disk immediately
    │
    ▼
[3] Generate spec 02_backend_lead.md
    │  System prompt: role definition + output format + constraints
    │  User prompt: SRS + project metadata + 01_product_manager.md summary
    │  → Write to disk immediately
    │
    ▼
[4-10] Generate specs 03-10 (same pattern)
    │  Each receives: SRS + metadata + summaries of previously generated specs
    │
    ▼
[11] Generate backlog.md
    │  System prompt: backlog rules (from 02-specs.md)
    │  User prompt: SRS + ALL 10 generated specs (or their summaries)
    │  → Write to disk
    │
    ▼
[12] Validate (local, no LLM)
    │  → Check all 11 files exist
    │  → Check YAML frontmatter parses
    │  → Check minimum line counts (300+ per spec)
    │  → Check backlog table format
    │  → Check cross-references resolve
    │
    ▼
[13] Write metadata
    → .autospec-meta.json with costs, timing, hashes
```

### Why Chained, Not Parallel

1. **Quality**: Later specs benefit from earlier ones. The backend spec references personas from the PM spec. The QA spec references API endpoints from the backend spec. The backlog references all 10 specs.
2. **Context window**: Each call gets ~3-5K tokens of SRS + ~2-3K tokens of prior spec summaries + ~1K system prompt = well within any model's sweet spot.
3. **Cost control**: If the user cancels mid-run, completed specs are on disk and usable. Partial generation is useful.
4. **Error recovery**: If spec #5 fails, we retry it without re-generating specs #1-4.

### Why Not Fully Sequential with Full Prior Specs

Feeding the full text of all prior specs into each subsequent call would balloon context. Instead, a **summary extraction** step runs after each spec generation:

```typescript
async function summarizeSpec(specContent: string): Promise<string> {
  // Deterministic extraction — NOT an LLM call
  // Extract: section headers, key decisions, entity names, API endpoints
  const headers = specContent.match(/^#{1,3} .+$/gm) ?? [];
  const tables = extractMarkdownTables(specContent);
  const codeBlocks = specContent.match(/```[\s\S]*?```/g) ?? [];
  return [
    '## Key Sections', headers.join('\n'),
    '## Tables', tables.slice(0, 3).join('\n'),
    '## Code Samples', codeBlocks.slice(0, 2).join('\n'),
  ].join('\n\n');
}
```

This keeps each LLM call's input under ~8K tokens total while preserving cross-spec coherence.

### System Prompt Architecture

Each spec role has a dedicated system prompt. The prompts use XML-tagged sections (proven by GSD research):

```xml
<role>
You are the Backend Lead for the project described below.
You are writing spec 02_backend_lead.md for this project.
</role>

<output_format>
Generate a Markdown document of 300-800 lines.
Start with YAML frontmatter (role, spec_version, generated_by, etc.).
Include these sections: [list from 02-specs.md requirements].
Use ASCII diagrams for architecture.
Include complete API endpoint tables with request/response examples.
</output_format>

<constraints>
- Be specific to THIS project, not generic.
- Reference specs/01_product_manager.md personas by name.
- Every API endpoint must include auth requirements.
- Use the tech stack specified in the project metadata.
- Cross-reference other spec files by filename where relevant.
</constraints>

<project_metadata>
{{projectMetadataJSON}}
</project_metadata>

<prior_spec_summaries>
{{summariesOfSpecsGeneratedSoFar}}
</prior_spec_summaries>

<input_document>
{{fullSRSContent}}
</input_document>
```

System prompts are stored as Handlebars templates in `cli/src/prompts/` and compiled at runtime. This follows GSD's principle: deterministic scaffolding in code, not in the LLM.

### Structured Output Mechanism

**Primary (Claude Code CLI)**: Use `--json-schema` for the metadata extraction step (step 1). Use plain text output for spec content (Markdown is the target format — JSON wrapping would add complexity without benefit).

**Fallback (direct API)**: Use Anthropic's tool-use / function-calling to extract structured metadata. Spec content is always plain Markdown.

**Validation (local, post-generation)**:

```typescript
interface SpecValidation {
  file: string;
  checks: {
    exists: boolean;
    frontmatterValid: boolean;
    lineCount: number;
    lineCountOk: boolean;       // >= 300
    requiredSections: string[];  // sections that must exist
    missingSections: string[];   // sections not found
    crossRefsValid: boolean;    // referenced files exist
  };
}

async function validateSpecs(specsDir: string): Promise<SpecValidation[]> {
  // Run after all specs generated
  // On failure: report which specs need regeneration
  // User can re-run: autospec generate --srs ... --spec 02_backend_lead
}
```

### Quality Assurance: Re-Generation on Error

If validation fails for a spec:
1. Report the specific failures (missing sections, too short, broken cross-refs)
2. Offer `autospec generate --srs ... --spec <failed_spec> --force` to regenerate just that spec
3. The re-generation prompt includes the validation errors as additional context: "Your previous attempt was missing sections X, Y. Include them this time."

---

## 5. Competitive Positioning

### What AutoSpec Does Differently

| Capability | GSD | OpenSpec | Spec Kit | SpecIt | **AutoSpec** |
|-----------|-----|---------|----------|--------|------------|
| Accepts existing SRS as input | No (interview only) | No | No | No (interview only) | **Yes** |
| Generates role-based spec decomposition | No (single requirements doc) | No (single proposal) | No (single spec) | No (single .spec) | **Yes (10 roles)** |
| Standalone CLI generation (no AI assistant needed) | No (requires Claude Code etc.) | No (requires AI assistant) | No (requires AI agent) | Yes (but flat output) | **Yes** |
| Zero-API-key for CLI users | Yes (v1 only) | Yes | Yes | Partial | **Yes** |
| Works headlessly in CI/CD | No (v1), Yes (v2) | No | No | No | **Yes** |
| Generates backlog from specs | No | No | Yes (tasks.md) | No | **Yes (sprint-decomposed)** |

### The AutoSpec Value Proposition

**"One SRS in, ten expert specs out."**

AutoSpec is the only tool that:

1. **Accepts an existing requirements document** — you don't start from scratch or sit through an interview (unless you want to)
2. **Produces role-decomposed specifications** — 10 specialist perspectives, not one monolithic document
3. **Generates a sprint-ready backlog** — tickets extracted from all 10 specs, estimated, dependency-mapped
4. **Requires zero API key setup** for users who already have Claude Code, Gemini CLI, or Copilot
5. **Runs in one command** — `autospec generate --srs requirements.md` → done

### Target Audience Hierarchy

1. **Solo devs using AI coding assistants** (Claude Code, Cursor, Copilot) who want structured specs before coding
2. **Teams adopting SDD** who have a PRD/SRS and want to decompose it into actionable role-based specs
3. **OSS maintainers** who want AI contributors to follow a spec structure
4. **CI/CD pipelines** that generate specs from product documents automatically

---

## 6. Technical Stack

### New Dependencies (to add to `cli/package.json`)

```json
{
  "dependencies": {
    // Existing (keep)
    "@inquirer/prompts": "^5.5.0",
    "chalk": "^5.3.0",
    "commander": "^12.1.0",
    "fs-extra": "^11.2.0",
    "handlebars": "^4.7.8",
    "ora": "^8.0.1",
    "yaml": "^2.4.5",

    // NEW: LLM providers (all optional at runtime via dynamic import)
    "execa": "^9.0.0",            // Subprocess management (claude -p, gemini -p)
    "dotenv": "^16.4.0",          // .env file parsing for API key cascade
    "zod": "^3.23.0",             // Schema validation for generated specs + config

    // OPTIONAL (peer dependencies — installed only if provider is used)
    // "@anthropic-ai/sdk": "^0.30.0"   — only if direct API fallback
    // "@github/copilot-sdk": "^0.2.0"  — only if Copilot provider
  }
}
```

### Why These Choices

- **`execa`**: The standard for subprocess management in Node.js ESM. Handles streaming stdout, exit codes, timeouts. Required for Claude Code and Gemini CLI subprocess providers.
- **`dotenv`**: For Aider-style `.env` cascade. Lightweight, zero-dependency.
- **`zod`**: Already used by OpenSpec. Validates generated spec frontmatter, config files, and CLI input. Catches malformed LLM output before writing to disk.
- **Optional SDK dependencies**: `@anthropic-ai/sdk` and `@github/copilot-sdk` are dynamically imported only when their provider is selected. They are NOT bundled — users who use Claude Code CLI never download the Anthropic SDK.

### Build Considerations

The existing `tsup` build pipeline remains. Key changes:

```json
{
  "scripts": {
    "build": "tsup src/index.ts --format esm --dts --clean --external @inquirer/prompts --external chalk --external commander --external fs-extra --external handlebars --external ora --external yaml --external execa --external dotenv --external zod --external @anthropic-ai/sdk --external @github/copilot-sdk"
  }
}
```

All provider SDKs are externalized — they are optional peer dependencies, not bundled.

### New Source File Structure

```
cli/src/
├── index.ts                          # CLI entry, commander setup
├── commands/
│   ├── init.ts                       # Existing: template scaffolding
│   ├── generate.ts                   # NEW: LLM-backed spec generation
│   ├── status.ts                     # Existing: sprint status
│   ├── sprint.ts                     # Existing: sprint prompt generation
│   ├── spec.ts                       # Existing: feature spec
│   ├── providers.ts                  # NEW: list detected providers
│   └── dashboard.ts                  # Existing: TUI dashboard
├── providers/
│   ├── interface.ts                  # LLMProvider interface + GenerateOptions
│   ├── resolver.ts                   # Auto-detection + priority chain
│   ├── claude-code.provider.ts       # Subprocess: claude -p
│   ├── gemini-cli.provider.ts        # Subprocess: gemini -p
│   ├── copilot-sdk.provider.ts       # JSON-RPC via @github/copilot-sdk
│   ├── anthropic-api.provider.ts     # Direct SDK
│   ├── openai-api.provider.ts        # Direct SDK
│   └── ollama.provider.ts            # Local HTTP
├── pipeline/
│   ├── generate-specs.ts             # Orchestrates the 13-step pipeline
│   ├── extract-metadata.ts           # Step 1: project metadata from SRS
│   ├── generate-single-spec.ts       # Steps 2-10: one spec at a time
│   ├── generate-backlog.ts           # Step 11: backlog from all specs
│   ├── validate-specs.ts             # Step 12: local validation
│   └── summarize-spec.ts             # Deterministic spec summary extraction
├── prompts/
│   ├── system/
│   │   ├── 01_product_manager.hbs    # System prompt template for PM spec
│   │   ├── 02_backend_lead.hbs       # System prompt template for backend spec
│   │   ├── ...                       # One per role
│   │   └── backlog.hbs               # System prompt for backlog generation
│   └── extract-metadata.hbs          # System prompt for metadata extraction
├── generators/                       # Existing generators (keep)
├── parsers/                          # Existing parsers (keep)
└── utils/
    ├── config.ts                     # Existing
    ├── file.ts                       # Existing
    ├── env.ts                        # NEW: .env cascade reader
    └── cost.ts                       # NEW: token counting + cost estimation
```

### npm Publish Readiness

The current `package.json` is almost publish-ready. Changes needed:

1. **Version bump**: `0.1.0` → `0.2.0` for the LLM integration release
2. **`peerDependencies`** section for optional SDKs:
   ```json
   "peerDependencies": {
     "@anthropic-ai/sdk": ">=0.30.0",
     "@github/copilot-sdk": ">=0.1.23"
   },
   "peerDependenciesMeta": {
     "@anthropic-ai/sdk": { "optional": true },
     "@github/copilot-sdk": { "optional": true }
   }
   ```
3. **`engines`**: Keep `"node": ">=18.0.0"` — compatible with all providers
4. **`prepublishOnly`**: Already set to `"npm run build && npm test"` — good

### Test Strategy

```bash
# Unit tests: mock providers, test pipeline logic
cd cli && npx vitest run

# Integration test: real provider (CI only, requires ANTHROPIC_API_KEY secret)
ANTHROPIC_API_KEY=${{ secrets.ANTHROPIC_API_KEY }} npx vitest run --reporter=json tests/integration/

# Smoke test: verify CLI boots and --help works (no LLM needed)
node dist/index.js --help
node dist/index.js providers
```

---

## 7. Open Questions

1. **Model selection per spec role**: Should we use a cheaper model (Haiku/gpt-4o-mini) for simpler specs (marketing, finance) and a reasoning model (Opus/o1) for complex ones (backend, DB, QA)? The cost difference is 10-50x. Needs cost benchmarking.

2. **Interview mode depth**: SpecIt's adaptive interview is appealing but complex. For v0.2.0, should we ship `--interview` as a simple sequential questionnaire (5-10 fixed questions), or invest in adaptive follow-ups? Recommendation: ship simple first, iterate.

3. **Copilot SDK maturity**: The SDK is in Technical Preview with undocumented ACP protocol and a history of breaking changes. Should we ship the Copilot provider in v0.2.0, or defer to v0.3.0? Recommendation: defer — Claude Code CLI and direct Anthropic API cover the primary audience.

4. **Spec update workflow**: After initial generation, how does the user update one spec when requirements change? Options:
   - `autospec generate --srs updated-srs.md --spec 02_backend_lead --force` (regenerate from scratch)
   - `autospec update --srs updated-srs.md --diff` (show what changed, apply delta) — more complex, needs diff logic
   - Recommendation: start with full regeneration per spec, add delta updates later.

5. **Offline/local model support**: Ollama integration is listed as Priority 6 but may be important for enterprise users behind firewalls. How much effort to invest in testing across Ollama models (llama3, mixtral, etc.)? Quality may vary dramatically.

6. **Backlog ticket count**: The current spec says each spec should generate tickets. For a complex SRS, this could produce 100+ tickets across all specs. Should the backlog generator cap sprint sizes or let the LLM decide? Recommendation: let the LLM decide but add a `--max-sprints` flag.

7. **Skills integration path**: GSD and OpenSpec both generate slash-command files for AI assistants. Should `autospec generate` also produce `.claude/commands/` skill files as a side effect? Or keep that as a separate `autospec init --skills` command? Recommendation: separate command — generation and skills are different concerns.

---

## Appendix: Key Findings from Research

### Comparative Summary

| Dimension | GSD (Researcher A) | OpenSpec (Researcher B) | SpecIt (Researcher C) |
|-----------|--------------------|-----------------------|----------------------|
| **Architecture** | Prompt files installed into AI runtimes (v1) / TypeScript harness with Pi SDK (v2) | CLI generates slash commands for 24 AI tools; no LLM calls | Go binary with adaptive TUI interview; calls LLMs directly |
| **Auth Model** | Zero-config: piggybacks on existing CLI auth (v1) / OAuth + API key wizard (v2) | Zero-auth: no LLM calls to authenticate | Auto-detect env vars + OAuth commands |
| **SRS Input** | No — builds requirements from interview | No — requires interactive AI session | No — interview only |
| **Output** | PROJECT.md, REQUIREMENTS.md, ROADMAP.md, task plans (XML) | proposal.md, delta specs, design.md, tasks.md | Single `.spec` YAML file |
| **Role Decomposition** | No | No | No |
| **Key Strength** | Context rot elimination via fresh-context agents | Universal tool support (24 AI tools) | Adaptive interview UX |
| **Key Weakness** | No SRS input path; high token cost | Cannot generate autonomously | Very early (v0.1.2), flat output |
| **Adoption** | 23k+ GitHub stars | ~500 stars | Brand new |

### Patterns Worth Adopting

| Pattern | Source | How AutoSpec Should Use It |
|---------|--------|---------------------------|
| Zero-config auth via CLI piggybacking | GSD v1 | Priority 1-3 providers detect existing CLI tools |
| XML-tagged prompt sections | GSD v1 | All system prompts use `<role>`, `<output_format>`, `<constraints>` |
| Deterministic scaffolding in code | GSD v1 | File names, frontmatter, directory structure determined by code, not LLM |
| `.env` cascade for API key discovery | Aider | CWD → git root → home directory |
| Provider auto-detection with user feedback | SpecIt | Show which providers found on first run |
| Dynamic instruction assembly | OpenSpec | System prompts compiled from templates at runtime |
| Strategy pattern for providers | OpenSpec research (Lesson 4) | `LLMProvider` interface with multiple implementations |
| `--json-schema` for structured output | Claude Code CLI | Metadata extraction step uses validated JSON |

### Patterns to Avoid

| Anti-Pattern | Source | Why AutoSpec Should Avoid It |
|-------------|--------|------------------------------|
| Single mega-prompt for all output | ai-scaffold | Quality degrades; no partial recovery |
| Require interactive AI session | OpenSpec, Spec Kit | Blocks CI/CD and headless use |
| Go binary distributed via npm postinstall | SpecIt | Fragile cross-platform; Node.js native is simpler |
| Undocumented protocols | Copilot SDK (ACP) | Breaking changes without deprecation |
| Telemetry on by default | OpenSpec (PostHog) | Privacy concern; if added, must be opt-in |
