# AutoSpec CLI LLM Integration — Final Proposal
**Author:** Head Researcher
**Date:** 2026-03-21
**Version:** 3.0 (Final)
**Review rounds:** 3 researchers + 2 senior architects

---

## Changelog

### v2 → v3 (Architect feedback)

- **Cut MVP to 3 providers.** Removed OpenAI API and Ollama from v0.2.0; moved to v0.2.1 fast-follow. (Architect 1, Must-Fix #1)
- **Atomic file writes.** All spec writes go to `.autospec-tmp` then `rename()`. Startup cleans orphaned tmp files. (Architect 1, Must-Fix #2)
- **SIGINT/SIGTERM signal handlers.** Kill child processes, clean temp files, print resume instructions on Ctrl+C. (Architect 1, Must-Fix #3)
- **ESM/CJS build verification required.** Sprint must verify `tsup` bundles `execa@9` + `handlebars` (CJS) cleanly; fallback plan is `execa@8`. (Architect 1, Must-Fix #4)
- **Positional SRS argument.** `autospec generate requirements.md` is the primary form; `--srs` kept as alias. (Architect 2, Must-Fix #1)
- **Completion summary with next-steps.** Post-generation output shows file list, cost, time, and 3 actionable next steps. (Architect 2, Must-Fix #2)
- **Empty/binary SRS detection.** Warn below 50 words, error on 0 bytes or binary. Point users to `--interview`. (Architect 2, Must-Fix #3)
- **Budget cap: no default.** Removed $5.00 default; confirmation prompt is the cost control. `--max-budget` is opt-in only. (Architect 1 #7 + Architect 2 #4)
- **`autospec doctor` replaces `autospec providers`.** Richer diagnostic output, follows `brew doctor` / `flutter doctor` convention. (Architect 1 #11 + Architect 2 #5)
- **Cost estimates shown as ranges, not point values.** (Architect 1, #8)
- **`--parallel` deferred to v0.2.1.** Sequential-only in MVP. (Architect 1, #9)
- **`@anthropic-ai/sdk` is a regular dependency, dynamically imported.** No peer dependency confusion. (Architect 1, #10)
- **Removed `generateJSON?<T>()` from provider interface.** All providers implement `generate()` only. JSON extraction handled by pipeline-layer parsing. (Architect 1, #5)
- **Simplified `summarizeSpec()`.** Replaced fragile entity regex with headers + first sentence of each section + tables. (Architect 1, #6)
- **Metadata file moved to `specs/.meta.json`.** Out of project root, inside specs dir. (Architect 1, #14)
- **Stdin pipe auto-implies `--yes`.** Detects `!process.stdin.isTTY` and skips confirmation. (Architect 2, #10)
- **Expanded exit codes for CI.** 0-7 covering distinct failure modes. (Architect 2, #12)
- **`--quiet` / `-q` flag added to MVP.** Suppresses progress bars; CI=true env var also triggers quiet mode. (Architect 2, #6)
- **Resume celebration message.** When resume kicks in, show specs skipped and estimated savings. (Architect 2, observation)
- **Model name in confirmation prompt shows full identifier.** e.g., "Claude Sonnet 4 (claude-sonnet-4-20250514)" not just "sonnet". (Architect 2, observation)

### v1 → v2 (Researcher feedback)

- Cross-provider fallback made opt-in (`--fallback` flag). Default: halt on failure.
- Copilot SDK deferred to v0.3.0 (all 3 reviewers agreed on SDK instability).
- Subprocess robustness: prompts via stdin, per-provider timeouts, temp file cleanup, NDJSON parse guards.
- Cost/time estimates added with pre-generation confirmation prompt.
- Error handling fully specified: per-spec retries, total retry cap, semantic drift acknowledged as out-of-scope.
- `--resume` made default behavior (re-run skips matching `source_hash`). `--force` overrides.
- Validation thresholds made per-role with section-presence as primary check.
- `--url` deferred to v0.3.0; `--interview` scoped to 10 fixed questions.
- `.autospec-meta.json` made purely informational (never required for operation).
- 18 total changes documented in v2 changelog.

---

## Executive Summary

AutoSpec's `generate` command will accept an SRS/PRD document (or a guided 10-question interview) and produce 10 role-decomposed specification files plus a sprint-ready backlog — all in one CLI invocation. The MVP ships with 3 LLM providers (Claude Code CLI, Gemini CLI, Anthropic API), zero-config authentication for CLI users, hash-based resume on interruption, and atomic file writes. The value proposition is: **"One SRS in, ten expert specs out."** No competitor offers SRS-to-role-decomposed-specs with resume, headless CI support, and zero API key setup for existing CLI users.

---

## MVP Scope (v0.2.0)

### What ships

| Feature | Notes |
|---------|-------|
| `autospec generate <file>` | Positional arg, full 14-step pipeline |
| 3 LLM providers | Claude Code CLI, Gemini CLI, Anthropic API |
| Provider auto-detection | Priority chain with `--provider` override |
| `autospec doctor` | System readiness check |
| `--interview` mode | 10 fixed questions, outputs intermediate SRS |
| Hash-based resume | Default behavior, `--force` to override |
| Atomic file writes | Write to `.autospec-tmp`, then rename |
| Signal handling | SIGINT/SIGTERM: kill children, clean up, print resume hint |
| Pre-generation confirmation | Cost range, model name, spec count; `--yes` to skip |
| Completion summary | File list, cost, time, next-steps guidance |
| `--dry-run` | Show plan without LLM calls |
| `--fallback` | Opt-in cross-provider fallback |
| `--max-budget <usd>` | Opt-in cost cap (no default) |
| `--quiet` / `-q` | Suppress progress for CI; `CI=true` auto-triggers |
| `--verbose` | Show prompts and raw LLM output |
| Per-role validation | Section-presence + minimum line counts |
| YAML frontmatter | On all generated specs |
| Empty/binary SRS detection | Warn <50 words, error on 0 bytes or binary |
| Expanded exit codes | 0-7 for CI differentiation |

### What does NOT ship in v0.2.0

| Feature | Ships in |
|---------|----------|
| OpenAI API provider | v0.2.1 |
| Ollama provider | v0.2.1 |
| `--parallel` flag | v0.2.1 |
| `--url <url>` input | v0.3.0 |
| GitHub Copilot SDK provider | v0.3.0 |
| `autospec skills --install` | v0.3.0 |
| `autospec instructions` | v0.3.0 |
| Per-role model routing | v0.3.0 |
| Adaptive interview | v0.3.0 |
| `autospec validate` / `diff` | v1.0.0 |
| Plugin system for custom roles | v1.0.0 |
| VS Code extension | v1.0.0 |

---

## 1. Provider Architecture (MVP: 3 Providers)

### Detection Priority Order

| Priority | Provider | Detection | Mechanism | Timeout | Auth |
|----------|----------|-----------|-----------|---------|------|
| 1 | Claude Code CLI | `which claude` + `claude auth status` exit 0 | Subprocess via stdin | 120s | Existing CLI auth (zero-config) |
| 2 | Gemini CLI | `which gemini` exits 0 | Subprocess via stdin | 120s | Existing CLI auth (zero-config) |
| 3 | Anthropic API | `ANTHROPIC_API_KEY` env var set | `@anthropic-ai/sdk` (dynamic import) | 60s | API key required |

### Provider Interface

All providers implement a single interface. No optional methods.

```typescript
interface LLMProvider {
  readonly name: string;           // 'claude-code' | 'gemini-cli' | 'anthropic-api'
  readonly requiresApiKey: boolean;
  readonly timeoutMs: number;

  /** Check if this provider is available on the current system */
  isAvailable(): Promise<boolean>;

  /** Generate text from a prompt, streaming chunks via async iterator */
  generate(prompt: string, options: GenerateOptions): AsyncIterable<string>;

  /** Parse provider-specific errors into user-friendly messages */
  parseError(error: unknown): ProviderError;
}

interface GenerateOptions {
  systemPrompt?: string;
  model?: string;
  maxBudgetUsd?: number;
  temperature?: number;
  maxTokens?: number;
}

interface ProviderError {
  type: 'auth' | 'rate_limit' | 'network' | 'model_not_found' | 'budget_exceeded' | 'unknown';
  message: string;        // User-facing message with actionable fix
  retryable: boolean;
  rawError?: string;
}
```

**Design decision (Architect 1 #5):** No `generateJSON()` method. The pipeline's metadata extraction step (Step 1) appends "respond in valid JSON" to the prompt and parses JSON from the text response using `parseMetadataFromText()`. Providers that support native JSON mode (e.g., Claude Code `--json-schema`, Anthropic API tool-use) can use it internally within their `generate()` implementation as an optimization — the pipeline doesn't know or care.

### Provider Resolution

```typescript
async function resolveProvider(override?: string): Promise<LLMProvider> {
  if (override) {
    const provider = PROVIDERS.find(p => p.name === override);
    if (!provider) throw new Error(`Unknown provider: ${override}. Available: ${PROVIDERS.map(p => p.name).join(', ')}`);
    if (!(await provider.isAvailable())) {
      throw new Error(`Provider ${override} is not available. Run: autospec doctor`);
    }
    return provider;
  }

  for (const provider of PROVIDERS) {
    if (await provider.isAvailable()) return provider;
  }

  throw new Error(
    'No LLM provider found.\n\n' +
    'Install one of:\n' +
    '  Claude Code:    npm i -g @anthropic-ai/claude-code && claude auth login\n' +
    '  Gemini CLI:     npm i -g @google/gemini-cli && gemini auth login\n' +
    '  Anthropic API:  export ANTHROPIC_API_KEY=sk-ant-...\n\n' +
    'Check status: autospec doctor\n'
  );
}
```

### Subprocess Robustness (Claude Code CLI, Gemini CLI)

**1. Prompt delivery via stdin.** Large SRS docs exceed OS arg limits (~128KB). All prompts piped via stdin using `execa`.

```typescript
const proc = execa('claude', [...args], {
  input: prompt,
  timeout: this.timeoutMs,
});
```

**2. System prompts via temp files with cleanup.**

```typescript
const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'autospec-'));
try {
  const sysPromptFile = path.join(tmpDir, 'system.md');
  await writeFile(sysPromptFile, opts.systemPrompt);
  args.push('--system-prompt-file', sysPromptFile);
  // ... run subprocess
} finally {
  await rm(tmpDir, { recursive: true, force: true });
}
```

**3. NDJSON stream parsing with skip-on-error.**

```typescript
for await (const line of readline(proc.stdout!)) {
  try {
    const event = JSON.parse(line);
    if (event.type === 'assistant' && event.content) yield event.content;
  } catch {
    if (opts.verbose) console.warn(`[stream] unparseable: ${line.slice(0, 80)}`);
  }
}
```

**4. Stderr capture and actionable error parsing.**

```typescript
if (error.stderr?.includes('rate limit')) {
  return { type: 'rate_limit', message: 'Rate limit reached. Wait 60s or use --provider anthropic-api.', retryable: true };
}
if (error.stderr?.includes('auth') || error.stderr?.includes('login')) {
  return { type: 'auth', message: 'Auth expired. Run: claude auth login', retryable: false };
}
```

### Anthropic API Provider

Uses `@anthropic-ai/sdk` as a **regular dependency** (not peer), loaded via dynamic `import()` only when selected. Bundle size impact: ~200KB. Eliminates the "works on my machine" problem with optional peer deps.

```typescript
// Only loaded when Anthropic API provider is selected
const { Anthropic } = await import('@anthropic-ai/sdk');
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
```

### API Key Discovery Cascade

1. `--api-key <key>` CLI flag (highest priority)
2. `ANTHROPIC_API_KEY` environment variable
3. `.env` in current working directory
4. `.env` in git root directory
5. `~/.autospec/.env` in home directory

### Fallback Chain (Opt-In Only)

**Default:** If the selected provider fails, halt with a clear error. No silent fallback.

**With `--fallback`:** Try next available provider in priority chain. Display a warning:

```
  ! Claude Code CLI failed: rate limit exceeded
  ! Falling back to Anthropic API (uses ANTHROPIC_API_KEY)
  ! To disable: remove --fallback flag
```

### Retry Logic (Within a Single Provider)

| Error type | Retries | Backoff |
|-----------|---------|---------|
| Transient (429, 500, 503, timeout) | 2 | Exponential: 2s, 6s |
| Auth (401, 403) | 0 | Halt with re-auth instructions |
| Permanent (invalid model, billing) | 0 | Halt with clear message |

**Total retry cap per run:** 5 retries across all specs.

---

## 2. Command Design

### Command Structure

```bash
# === TIER 1: Generate (NEW — LLM-backed) ===

autospec generate <file>                     # Primary: positional SRS path
autospec generate <file> --spec 02_backend_lead  # Regenerate single spec
autospec generate --interview                # Guided interview → SRS → specs
cat reqs.md | autospec generate -            # Stdin pipe (auto-implies --yes)

# === TIER 2: Manage (existing, enhanced) ===

autospec init                                # Scaffold project (template-based, no LLM)
autospec init --from-specs                   # Scaffold from already-generated specs
autospec sprint <N>                          # Generate sprint execution prompt
autospec spec <name>                         # Generate a feature spec (LLM-backed)

# === TIER 3: Inspect ===

autospec doctor                              # System readiness + provider diagnostics
autospec status [sprint]                     # Sprint progress from backlog
autospec version                             # CLI version
```

### The `generate` Command

```bash
autospec generate <file> [options]
```

| Option | Description | Default |
|--------|-------------|---------|
| `<file>` (positional) | Path to SRS/PRD document. Use `-` for stdin. | Required (unless `--interview`) |
| `--srs <file>` | Alias for positional arg (discoverability in `--help`) | — |
| `--interview` | Interactive interview mode (no file needed) | `false` |
| `--provider <name>` | Force specific LLM provider | Auto-detect |
| `--model <name>` | Model override (opus, sonnet, gemini-pro) | Provider default |
| `--spec <name>` | Generate only one spec file | All 10 + backlog |
| `--output <dir>` | Output directory | `./specs/` |
| `--max-budget <usd>` | Maximum cost cap in USD (best-effort) | No cap |
| `--force` | Overwrite existing specs (skip resume check) | `false` |
| `--fallback` | Enable cross-provider fallback on failure | `false` |
| `--yes` / `-y` | Skip confirmation prompt | `false` (auto-set for stdin pipe) |
| `--dry-run` | Show plan without LLM calls | `false` |
| `--quiet` / `-q` | Minimal output for CI (also triggered by `CI=true` env) | `false` |
| `--verbose` | Show prompts and raw LLM output | `false` |

### The `doctor` Command

```
$ autospec doctor

  autospec doctor

  Environment:
    Node.js         v20.11.0    ok (>=18.0.0)
    npm             v10.2.0     ok

  LLM Providers:
    + Claude Code    v1.2.3 (authenticated as user@example.com)
    + Anthropic API  ANTHROPIC_API_KEY set (sk-ant-...xxxx)
    - Gemini CLI     not installed

  Ready to generate specs. Run: autospec generate <file>
```

When no provider is available:

```
  LLM Providers:
    - Claude Code    not installed
    - Gemini CLI     not installed
    - Anthropic API  ANTHROPIC_API_KEY not set

  No LLM provider available. Install one:
    npm i -g @anthropic-ai/claude-code && claude auth login
    npm i -g @google/gemini-cli && gemini auth login
    export ANTHROPIC_API_KEY=sk-ant-...
```

### Input Validation

**Empty file (0 bytes):**
```
  Error: requirements.md is empty (0 bytes).

  AutoSpec needs a requirements document to generate specs.
    Interactive:  autospec generate --interview
    Examples:     https://github.com/user/autospec/tree/main/examples
```

**Very short file (<50 words):**
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

### Pre-Generation Confirmation

```
  autospec generate — Pre-flight Summary

  SRS:       requirements.md (2,847 words)
  Provider:  Claude Code CLI — Claude Sonnet 4 (claude-sonnet-4-20250514)
  Specs:     10 + backlog (11 total)
  Est. cost: $0.20–$0.80 (Sonnet) | $2.00–$6.00 (Opus)
  Est. time: ~100–120 seconds

  Proceed? [Y/n]
```

When budget cap is set and close to estimate:
```
  Est. cost: $2.00–$6.00 (Opus)
  Budget:    $5.00 (may halt mid-run if estimate exceeds budget)
```

### Completion Summary

```
  autospec generate — Complete!

  Generated 11 files in specs/
    01_product_manager.md     412 lines
    02_backend_lead.md        387 lines
    03_frontend_lead.md       341 lines
    04_db_architect.md        298 lines
    05_qa_lead.md             267 lines
    06_devops_lead.md         224 lines
    07_marketing_lead.md      178 lines
    08_finance_lead.md        163 lines
    09_business_lead.md       155 lines
    10_ui_designer.md         231 lines
    backlog.md                156 lines

  Cost: $0.41 | Time: 1m 47s | Provider: Claude Code CLI (Claude Sonnet 4)

  Next steps:
    1. Review specs:    ls specs/
    2. Check backlog:   autospec status
    3. Start Sprint 0:  autospec sprint 0
```

### Resume Celebration

When resume detects existing specs:
```
  Resuming previous run (4/11 specs already up-to-date)
  Skipping 4 specs, generating 7. Est. cost: $0.12–$0.45 (saved ~$0.08–$0.35)
```

### Exit Codes

| Code | Description |
|------|-------------|
| 0 | Success |
| 1 | General error |
| 2 | Invalid arguments / configuration |
| 3 | File not found (SRS missing) |
| 4 | No LLM provider available |
| 5 | Authentication failure |
| 6 | Budget exceeded (partial generation) |
| 7 | Provider timeout / network error |

### Interview Mode

10 fixed sequential questions via `@inquirer/prompts`:

| # | Question | Purpose |
|---|----------|---------|
| 1 | What is the project name? | Metadata |
| 2 | Describe the project in 2-3 sentences. | Core vision |
| 3 | What domain/industry is this for? | Context |
| 4 | Who are the target users? (list roles) | Personas |
| 5 | What are the 3-5 core features? | Scope |
| 6 | What tech stack? (or "recommend") | Technical specs |
| 7 | What are the key constraints? | Finance/DevOps/QA |
| 8 | How will this be deployed? | DevOps spec |
| 9 | Any existing systems to integrate with? | Backend/DB |
| 10 | What does success look like in 6 months? | Business/Marketing |

Output: structured Markdown SRS at `specs/.interview-srs.md` that feeds the standard pipeline. The interview is just an SRS generator, not a separate code path.

---

## 3. Spec Generation Pipeline

### Architecture: Chained Sequential Calls

One LLM call per spec file. Each receives the SRS plus a role-specific system prompt plus summaries of previously generated specs. All sequential in MVP (no `--parallel`).

### Cost and Time Estimates

| Model | Per-Spec Range | Full Run (11 calls) | Est. Time |
|-------|---------------|---------------------|-----------|
| Claude Sonnet 4 | $0.02–$0.07 | $0.20–$0.80 | 100–120s |
| Claude Opus 4 | $0.20–$0.60 | $2.00–$6.00 | 100–150s |
| Claude Haiku | $0.002–$0.008 | $0.02–$0.08 | 60–80s |
| Gemini Pro | $0.02–$0.06 | $0.20–$0.60 | 80–120s |

Assumptions: ~5K input tokens + ~4K output tokens per spec. Actual cost varies 2-3x based on SRS complexity and model verbosity.

### Pipeline Steps

```
SRS Document
    |
    v
[1] Extract project metadata (name, type, stack, domain)
    |  Prompt includes "respond in valid JSON". Pipeline parses JSON from response.
    |  Output: ProjectMetadata object validated with zod.
    |
    v
[2] Generate spec 01_product_manager.md
    |  System prompt: Handlebars template (role + output format + constraints)
    |  User prompt: SRS + project metadata
    |  → Atomic write (tmp + rename)
    |  → Extract summary (deterministic, no LLM)
    |
    v
[3–7] Generate specs 02–06 (sequential, each gets prior summaries)
    |
    v
[8–10] Generate specs 07–09 (sequential)
    |
    v
[11] Generate spec 10_ui_designer.md
    |
    v
[12] Generate backlog.md
    |  System prompt: backlog rules from SDD methodology
    |  User prompt: SRS + ALL 10 spec summaries
    |
    v
[13] Validate (local, no LLM)
    |  → All 11 files exist
    |  → YAML frontmatter parses (zod schema)
    |  → Per-role minimum line counts
    |  → Required sections present
    |  → Cross-references resolve
    |
    v
[14] Write metadata → specs/.meta.json
```

### Atomic File Writes

Every spec write uses a write-then-rename pattern to prevent corruption on Ctrl+C, OOM, or power loss:

```typescript
const tmpPath = specPath + '.autospec-tmp';
await writeFile(tmpPath, content);
await rename(tmpPath, specPath);  // atomic on same filesystem
```

On startup, clean any orphaned `.autospec-tmp` files in the output directory.

### Signal Handling (SIGINT / SIGTERM)

```typescript
let activeChild: ExecaChildProcess | null = null;

for (const sig of ['SIGINT', 'SIGTERM'] as const) {
  process.on(sig, async () => {
    console.log('\n\n  Generation interrupted.');
    if (activeChild) {
      activeChild.kill('SIGTERM');
    }
    // Clean up temp directories
    await cleanupTempFiles();
    console.log(`  Resume from where you left off:\n    autospec generate ${srsPath}\n`);
    process.exit(1);
  });
}
```

### Resume Mechanism

Resume is **default behavior**. `--force` disables it.

1. Compute `sha256` hash of the SRS file
2. For each existing spec in the output directory:
   - Parse YAML frontmatter
   - If `source_hash` matches current SRS hash → **skip** (up to date)
   - If `source_hash` differs or frontmatter is missing → **regenerate**
3. Display skip/queue status with cost savings estimate

### Deterministic Summary Extraction

After each spec is generated, extract a summary for cross-spec coherence. Simplified from v2 (Architect 1 #6): headers + first sentence of each section + any tables. No fragile entity regexes.

```typescript
function summarizeSpec(specContent: string): string {
  const sections: string[] = [];

  // 1. All section headers (structural overview)
  const headers = specContent.match(/^#{1,3} .+$/gm) ?? [];
  sections.push('## Sections\n' + headers.join('\n'));

  // 2. First sentence after each header (content preview)
  const firstSentences = extractFirstSentences(specContent);
  if (firstSentences.length > 0) {
    sections.push('## Key Points\n' + firstSentences.join('\n'));
  }

  // 3. Tables (first 3, for data-heavy specs)
  const tables = extractMarkdownTables(specContent);
  if (tables.length > 0) {
    sections.push('## Key Tables\n' + tables.slice(0, 3).join('\n\n'));
  }

  return sections.join('\n\n');
}
```

### System Prompt Architecture

Each spec role has a Handlebars template in `cli/src/prompts/system/`:

```xml
<role>
You are the Backend Lead for the project described below.
You are writing spec 02_backend_lead.md.
</role>

<output_format>
Generate a Markdown document.
Start with YAML frontmatter: role, spec_version, generated_by, model, provider, source_srs, source_hash, generated_at.
Include these sections: [list from methodology].
</output_format>

<constraints>
- Be specific to THIS project, not generic.
- Reference personas from 01_product_manager.md by name.
- Every API endpoint must include auth requirements.
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

### Validation (Step 13)

**Primary: required sections present.** Each role has a list of required headings.

**Secondary: per-role minimum line counts.**

| Role | Min Lines |
|------|-----------|
| 01_product_manager | 200 |
| 02_backend_lead | 300 |
| 03_frontend_lead | 250 |
| 04_db_architect | 250 |
| 05_qa_lead | 250 |
| 06_devops_lead | 200 |
| 07_marketing_lead | 150 |
| 08_finance_lead | 150 |
| 09_business_lead | 150 |
| 10_ui_designer | 200 |
| backlog | 100 |

**Other checks:** frontmatter parses (zod), cross-references resolve, backlog has valid Markdown table.

### `specs/.meta.json`

Purely informational. Deleting it breaks nothing. Resume reads frontmatter from spec files, not this JSON. Stored inside `specs/` to keep project root clean.

```json
{
  "version": "0.2.0",
  "generatedAt": "2026-03-21T14:30:00Z",
  "provider": "claude-code",
  "model": "claude-sonnet-4-20250514",
  "sourceSrs": "requirements.md",
  "sourceHash": "sha256:abc123...",
  "specs": {
    "01_product_manager": { "status": "complete", "tokens": 5200, "costUsd": 0.04, "durationMs": 4200 }
  },
  "totalCostUsd": 0.41,
  "totalDurationMs": 112000
}
```

---

## 4. Error Handling & Recovery

### Failure Modes

| Failure | Detection | Response | Retries |
|---------|-----------|----------|---------|
| Empty/truncated response | Output < 50 lines | Retry with same prompt | 2 |
| Missing YAML frontmatter | Frontmatter parse fails | Retry with augmented prompt | 1 |
| Missing required sections | Section-presence check fails | Retry with explicit section list | 1 |
| Provider timeout | Exceeds per-provider timeout | Retry once, then halt | 1 |
| Provider auth failure | 401/403 or auth stderr | Halt with re-auth instructions | 0 |
| Rate limit | 429 response | Retry with exponential backoff | 2 |
| Budget exceeded | Cumulative cost > `--max-budget` | Halt, show progress, suggest resume | 0 |
| Network error | Connection refused / DNS failure | Retry once | 1 |

**Total retry cap per run:** 5 retries across all specs.

**Partial completion:** Specs written to disk before failure are preserved. User can resume.

### Error Message Quality

Every error message must be:
1. **Specific** — what exactly failed
2. **Actionable** — what the user should do next
3. **Contextual** — include relevant state (spec N/11, provider name, etc.)

Example:
```
  Error [spec 5/11]: Provider timeout after 120s generating 05_qa_lead.md.
  Retry 1/2 in 2 seconds...

  Error [spec 5/11]: Provider timeout after 120s (retry 2/2 exhausted).
  4 specs completed successfully. Resume with:
    autospec generate requirements.md
```

---

## 5. CLI UX & Progress

### Progress Display (Default Mode)

```
  autospec generate — 10 specs + backlog from requirements.md

  Provider: Claude Code CLI — Claude Sonnet 4 (claude-sonnet-4-20250514)
  Input: requirements.md (2,847 words)

  [1/11] 01_product_manager.md    ==================== done   (4.2s, $0.04)
  [2/11] 02_backend_lead.md       ============-------- 62%    ~8s remaining
  [3/11] 03_frontend_lead.md      -------------------- queued
  ...

  Cost so far: $0.12 | Elapsed: 12s | ETA: ~1m 30s
```

After first spec completes, project ETA from average time per spec.

### Quiet Mode (`--quiet` or `CI=true`)

```
autospec: generating 11 specs from requirements.md (Claude Code CLI)
autospec: specs/01_product_manager.md (412 lines, 4.2s)
autospec: specs/02_backend_lead.md (387 lines, 5.8s)
...
autospec: complete (11 files, $0.41, 1m47s)
```

### `--dry-run` Output

```
  autospec generate --dry-run

  Provider:  Claude Code CLI — Claude Sonnet 4 (claude-sonnet-4-20250514)
  SRS:       requirements.md (2,847 words, sha256:abc123...)
  Output:    ./specs/

  Files to generate:
    [1]  specs/01_product_manager.md  (NEW)
    [2]  specs/02_backend_lead.md     (NEW)
    ...
    [11] specs/backlog.md             (NEW)

  Est. cost: $0.20–$0.80 (Sonnet)
  Est. time: ~100–120 seconds

  No LLM calls made. Run without --dry-run to generate.
```

---

## 6. Technical Stack

### Dependencies

```json
{
  "dependencies": {
    "@anthropic-ai/sdk": ">=0.30.0",
    "@inquirer/prompts": "^5.5.0",
    "chalk": "^5.3.0",
    "commander": "^12.1.0",
    "dotenv": "^16.4.0",
    "execa": "^9.0.0",
    "fs-extra": "^11.2.0",
    "handlebars": "^4.7.8",
    "ora": "^8.0.1",
    "yaml": "^2.4.5",
    "zod": "^3.23.0"
  }
}
```

**No peer dependencies.** `@anthropic-ai/sdk` is a regular dependency, dynamically imported only when the Anthropic API provider is selected. (Architect 1 #10)

**ESM/CJS build verification (BLOCKER):** Before implementation begins, run:
```bash
cd cli && npm install execa@9 @anthropic-ai/sdk zod dotenv && npm run build
```

If `tsup` cannot bundle the CJS/ESM mix (`handlebars` and `fs-extra` are CJS; `execa@9`, `chalk@5`, `ora@8` are ESM-only), the fallback plan is:
- Pin `execa` to v8 (last CJS-compatible version)
- This is the first task in Sprint 28 — verify before coding anything else

### Source File Structure

```
cli/src/
├── index.ts                          # CLI entry, commander setup
├── commands/
│   ├── init.ts                       # Existing: template scaffolding
│   ├── generate.ts                   # NEW: LLM-backed spec generation
│   ├── doctor.ts                     # NEW: system readiness diagnostics
│   ├── status.ts                     # Existing: sprint status
│   ├── sprint.ts                     # Existing: sprint prompt generation
│   ├── spec.ts                       # Existing: feature spec
│   └── dashboard.ts                  # Existing: TUI dashboard
├── providers/
│   ├── interface.ts                  # LLMProvider + GenerateOptions + ProviderError
│   ├── resolver.ts                   # Auto-detection + priority chain
│   ├── claude-code.provider.ts       # Subprocess via stdin
│   ├── gemini-cli.provider.ts        # Subprocess via stdin
│   └── anthropic-api.provider.ts     # Direct SDK (dynamic import)
├── pipeline/
│   ├── generate-specs.ts             # Orchestrates 14-step pipeline
│   ├── extract-metadata.ts           # Step 1: project metadata from SRS
│   ├── generate-single-spec.ts       # Steps 2–11: one spec at a time
│   ├── generate-backlog.ts           # Step 12: backlog from all specs
│   ├── validate-specs.ts             # Step 13: local validation
│   ├── summarize-spec.ts             # Deterministic summary extraction
│   └── resume.ts                     # Hash-based resume logic
├── prompts/
│   ├── system/
│   │   ├── 01_product_manager.hbs
│   │   ├── 02_backend_lead.hbs
│   │   ├── ...
│   │   └── backlog.hbs
│   ├── extract-metadata.hbs
│   └── interview-questions.ts        # 10 fixed questions
├── generators/                       # Existing generators (keep)
├── parsers/                          # Existing parsers (keep)
└── utils/
    ├── config.ts                     # Existing
    ├── file.ts                       # Existing + atomic write helper
    ├── env.ts                        # NEW: .env cascade reader
    ├── cost.ts                       # NEW: token counting + cost estimation
    └── signals.ts                    # NEW: SIGINT/SIGTERM handlers
```

### YAML Frontmatter on Generated Specs

```yaml
---
role: backend_lead
spec_version: 1.0
generated_by: autospec v0.2.0
model: claude-sonnet-4-20250514
provider: claude-code
source_srs: requirements.md
source_hash: sha256:abc123...
generated_at: 2026-03-21T14:30:00Z
---
```

### Test Strategy

```bash
# Unit tests: mock providers, test pipeline logic, validation, resume
cd cli && npx vitest run

# Integration test (CI only, needs API key)
ANTHROPIC_API_KEY=$KEY npx vitest run tests/integration/

# Smoke test (no LLM needed)
node dist/index.js --help
node dist/index.js doctor
```

Key areas: provider detection (mock `which`, env vars), resume logic, summary extraction, validation, subprocess error parsing, cost estimation, atomic write + cleanup, signal handling.

---

## 7. Version Roadmap

| Version | Features | Target |
|---------|----------|--------|
| **v0.2.0 (MVP)** | 3 providers (Claude Code, Gemini CLI, Anthropic API), `generate` command, `doctor` command, sequential pipeline, resume, atomic writes, signal handling, interview mode, validation, confirmation prompt, completion summary, `--dry-run`, `--quiet`, exit codes | Sprint 28–29 |
| **v0.2.1 (fast-follow)** | OpenAI API provider, Ollama provider (with quality guardrails), `--parallel` for specs 07–09 | Sprint 30 |
| **v0.3.0** | `autospec skills --install`, `autospec instructions`, `--url` input, Copilot SDK provider, per-role model routing, SRS chunking, adaptive interview | Sprint 31–32 |
| **v1.0.0** | `autospec validate`, `autospec diff`, delta updates, LLM-based `--verify`, plugin system for custom roles, VS Code extension, artifact history | Sprint 35+ |

---

## 8. Sprint Plan Recommendation

### Sprint 28: Core Pipeline + Claude Code Provider (~40 pts)

The goal is one end-to-end run working with Claude Code CLI.

| # | Ticket | Pts | Notes |
|---|--------|-----|-------|
| 28.1 | **ESM/CJS build verification** — install deps, verify `tsup` bundles cleanly; pin `execa@8` if needed | 2 | BLOCKER — do first |
| 28.2 | Provider interface + resolver | 3 | `interface.ts`, `resolver.ts` |
| 28.3 | Claude Code CLI provider | 5 | Subprocess, stdin, NDJSON, error parsing |
| 28.4 | Anthropic API provider | 5 | Dynamic import, streaming, error parsing |
| 28.5 | Atomic file write utility + signal handlers | 3 | `file.ts` additions + `signals.ts` |
| 28.6 | Pipeline scaffolding (14-step skeleton) | 5 | `generate-specs.ts`, step orchestration |
| 28.7 | Metadata extraction (Step 1) | 3 | `extract-metadata.ts` + `extract-metadata.hbs` |
| 28.8 | Single-spec generation + summary extraction | 5 | `generate-single-spec.ts` + `summarize-spec.ts` |
| 28.9 | 11 Handlebars system prompt templates | 5 | `prompts/system/*.hbs` |
| 28.10 | Resume mechanism (hash-based) | 3 | `resume.ts` |
| 28.11 | `autospec doctor` command | 2 | `commands/doctor.ts` |
| 28.12 | Sprint summary + docs | 2 | |

### Sprint 29: Polish + Ship v0.2.0 (~30 pts)

| # | Ticket | Pts | Notes |
|---|--------|-----|-------|
| 29.1 | Gemini CLI provider | 5 | Shares 90% of subprocess logic with Claude Code |
| 29.2 | `generate` command (Commander.js wiring, positional arg, all flags) | 5 | `commands/generate.ts` |
| 29.3 | Input validation (empty, binary, <50 words, >5000 words) | 3 | |
| 29.4 | Pre-generation confirmation prompt + completion summary | 3 | |
| 29.5 | Interview mode (10 questions → SRS → pipeline) | 5 | |
| 29.6 | Validation (Step 13: sections, line counts, frontmatter, cross-refs) | 3 | `validate-specs.ts` |
| 29.7 | `--dry-run`, `--quiet`, `--fallback`, exit codes | 3 | |
| 29.8 | Cost estimation + range display | 2 | `utils/cost.ts` |
| 29.9 | Unit tests (providers, pipeline, resume, validation) | 5 | |
| 29.10 | Integration smoke test with real SRS | 2 | Manual: run pipeline, verify output quality |
| 29.11 | Version bump to 0.2.0 + sprint summary + docs | 2 | |

### Sprint 30: Fast-Follow v0.2.1 (~20 pts)

| # | Ticket | Pts | Notes |
|---|--------|-----|-------|
| 30.1 | OpenAI API provider | 5 | |
| 30.2 | Ollama provider + quality guardrails | 5 | Halved thresholds, model size warnings |
| 30.3 | `--parallel` flag for specs 07–09 | 5 | |
| 30.4 | Bug fixes from v0.2.0 feedback | 3 | |
| 30.5 | Sprint summary | 2 | |

---

## Appendix: Competitive Positioning

**"One SRS in, ten expert specs out."**

| Capability | GSD | OpenSpec | SpecIt | **AutoSpec** |
|-----------|-----|---------|--------|------------|
| Accepts existing SRS as input | No | No | No | **Yes** |
| Role-decomposed specs (10 roles) | No | No | No | **Yes** |
| Standalone CLI (no AI assistant) | No | No | Yes | **Yes** |
| Zero-API-key for CLI users | Yes | Yes | Partial | **Yes** |
| Headless CI/CD support | No | No | No | **Yes** |
| Sprint-ready backlog | No | No | Partial | **Yes** |
| Resume on interruption | No | No | No | **Yes** |

---

## Appendix: Decisions Log (Full)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| MVP providers | 3 (Claude Code, Gemini CLI, Anthropic API) | 5 is too many for first release; OpenAI/Ollama add no strategic value for MVP (Architect 1) |
| File writes | Atomic (tmp + rename) | Prevents corruption on Ctrl+C/OOM (Architect 1) |
| Signal handling | Kill children + cleanup + print resume | Orphaned processes and temp files without handlers (Architect 1) |
| SRS argument | Positional (primary), `--srs` (alias) | Every major CLI uses positional for primary input (Architect 2) |
| `providers` command | Renamed to `doctor` | Follows `brew doctor` / `flutter doctor` convention (both architects) |
| Budget cap default | No default (opt-in only) | $5 default is a footgun for Opus users (both architects) |
| Cost display | Ranges, not point estimates | Token counts vary 2-3x based on SRS complexity (Architect 1) |
| `--parallel` | Deferred to v0.2.1 | Saves 15–30s on 2min run; not worth complexity for MVP (Architect 1) |
| `@anthropic-ai/sdk` | Regular dep, dynamic import | Peer deps are an npm footgun; ~200KB is acceptable (Architect 1) |
| `generateJSON()` | Removed from interface | Pipeline handles JSON parsing; providers only implement `generate()` (Architect 1) |
| `summarizeSpec()` | Headers + first sentences + tables | Entity regex is fragile; simpler approach covers 80% (Architect 1) |
| Meta file location | `specs/.meta.json` | Out of project root, less confusing with `.autospecrc.json` (Architect 1) |
| Stdin pipe | Auto-implies `--yes` | Cannot interact with confirmation on closed pipe (Architect 2) |
| Exit codes | 0–7 (expanded) | CI needs distinct codes for retry vs alert vs config fix (Architect 2) |
| Quiet mode | `--quiet` + `CI=true` detection | CI pipelines need minimal output (Architect 2) |
| Completion output | File list + cost + time + next steps | Users need dopamine hit and guidance after 2min wait (Architect 2) |
| Copilot SDK | Deferred to v0.3.0 | SDK is Technical Preview, undocumented ACP protocol (all reviewers) |
| `--url` input | Deferred to v0.3.0 | HTML parsing, auth, JS rendering = too much scope (Researcher C) |
| Cross-provider fallback | Opt-in (`--fallback`) | Silent fallback can incur unexpected charges (Researcher A) |
| Interview mode | 10 fixed questions | Adaptive requires major TUI investment (Researcher C) |
| Resume mechanism | Hash in frontmatter (default on) | File existence alone doesn't detect SRS changes (Researchers A, C) |
