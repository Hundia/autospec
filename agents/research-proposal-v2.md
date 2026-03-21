# AutoSpec CLI LLM Integration — Proposal v2
**Author:** Head Researcher
**Date:** 2026-03-21
**Based on:** Proposal v1 (2026-03-20) + reviews from Researchers A, B, C

---

## Changelog from v1

| # | Change | Source | Rationale |
|---|--------|--------|-----------|
| 1 | **Cross-provider fallback is now opt-in** (`--fallback` flag). Default: halt on provider failure. | Reviewer A #1 | Silent fallback to API-key providers could incur unexpected charges. GSD v1 uses exactly one runtime. |
| 2 | **Copilot SDK provider deferred to v0.3.0.** Removed from v0.2.0 scope; code marked speculative. | All three reviewers | SDK is Technical Preview, undocumented ACP protocol, breaking-change history. All reviewers agreed. |
| 3 | **Provider priority reordered:** Anthropic API now ranks above Copilot SDK (when Copilot returns in v0.3.0). | Reviewer B #3 | Stable, well-documented provider should rank above experimental one. |
| 4 | **Subprocess robustness section added:** prompt via stdin (not CLI args), per-provider timeouts, temp file cleanup, NDJSON parse guards. | Reviewer C #3 | CLI arg length limits (~128KB Linux) would break on large SRS documents. |
| 5 | **Cost/time estimates added** with per-model table and pre-generation confirmation prompt. | Reviewer C #1 | Users need to know what they're paying before committing. |
| 6 | **Error handling fully specified:** failure modes, per-spec retry limits, total retry cap, semantic drift acknowledged as out-of-scope. | Reviewers A, B, C | All three flagged this gap. |
| 7 | **`--resume` is now default behavior.** Re-running `autospec generate` skips specs whose `source_hash` matches current SRS. `--force` overrides. | Reviewers A #6, C #8 | Idempotent resume was described but not formalized. |
| 8 | **Validation thresholds are now per-role**, not a flat 300-line minimum. Section-presence check is primary; line count is secondary. | Reviewers A #4, B #8 | Marketing/finance specs for small projects may legitimately be 150 lines. |
| 9 | **`summarizeSpec()` enhanced** with entity extraction (personas, API paths, tech stack terms), not just headers/tables. | Reviewer A #3 | Cross-spec coherence requires named entities, not just structural summaries. |
| 10 | **`--url` deferred to v0.3.0.** v0.2.0 accepts local files and stdin only. | Reviewer C #6 | URL fetching requires HTML parsing, auth, JS rendering — too much scope for MVP. |
| 11 | **`--interview` mode scoped:** 10 fixed questions via `@inquirer/prompts`, outputs intermediate SRS, feeds standard pipeline. | Reviewer C #4 | Adaptive interview is a multi-sprint effort. Simple sequential is correct for MVP. |
| 12 | **Skills integration path specified** as `autospec skills --install` for v0.3.0, with command interface defined now. | Reviewers A (GSD Gap #1), B (OpenSpec Gap #1) | Both reviewers flagged this as critical for reach. Interface defined now; implementation deferred. |
| 13 | **`autospec instructions` inspection command added** for v0.3.0. Enables `--dry-run` implementation and AI skill integration. | Reviewer B (OpenSpec Gap #2) | Transparent prompt inspection is valuable. Deferred because v0.2.0 `--dry-run` can be simpler. |
| 14 | **`.autospec-meta.json` made purely informational** — never required for operation. Deletion does not break anything. | Reviewer A (GSD Gap #2) | Generated specs are the canonical state, not the metadata file. |
| 15 | **`--parallel` flag added** (off by default) for specs 07-09 which are independent of technical specs. | Reviewers A #5, B #7 | 20-30% time savings with no quality loss for non-technical specs. |
| 16 | **Ollama quality guardrails added:** minimum model size guidance, reduced validation thresholds, quality warning. | Reviewer C #5 | 7B models cannot produce coherent 300-line specs. |
| 17 | **`--max-budget` clarified as best-effort** for providers without cost reporting. | Reviewer B #6 | Gemini CLI, Ollama have no token cost APIs. |
| 18 | **Version Roadmap replaces Open Questions.** All open questions resolved with decisions. | All reviewers | Senior architects want decisions, not questions. |

### Reviewer suggestions intentionally deferred or rejected

| Suggestion | Reviewer | Decision | Reason |
|-----------|----------|----------|--------|
| GSD's `@./` lazy file reference pattern | A (Gap #3) | **Deferred to v0.3.0.** v0.2.0 uses Handlebars eager injection with a 5,000-word SRS truncation warning. Chunking per role is a v0.3.0 optimization. | Adds complexity without clear benefit for typical SRS sizes (1-5K words). |
| LLM-based `--verify` cross-check | A (Gap #4) | **Deferred to v1.0.0.** | Adds an LLM call that doubles cost. Structural validation is sufficient for MVP. |
| Model normalization/mapping layer | B #5 | **Deferred to v0.3.0.** v0.2.0 passes `--model` value directly to the provider; invalid models produce a clear provider error. | Over-engineering for MVP. Provider errors are already informative. |
| Artifact history/archiving (`specs/.history/`) | B (Gap #4) | **Deferred to v1.0.0.** Users have git for change tracking. | Git already solves this. Adding a shadow history system duplicates VCS. |
| VS Code extension | B (Gap #3) | **Deferred to v1.0.0.** AutoSpec is CLI-first. Skills integration (v0.3.0) provides VS Code access via Copilot's `.github/prompts/` consumption. | Full extension is high effort, low marginal value over skills path. |
| SpecIt's `validate` and `diff` commands | C (Gap #1) | **Added to v1.0.0 roadmap.** | Spec-to-code validation is a natural extension but requires codebase analysis — major scope. |
| Plugin system for custom spec roles | C (Gap #2) | **Added to v1.0.0 roadmap.** | Extensibility is important but premature before the core pipeline is proven. |
| Copilot SDK streaming fix (async queue) | B #1 | **Moot — Copilot deferred to v0.3.0.** Will implement proper streaming when the SDK stabilizes. | No point fixing speculative code for an unstable SDK. |
| GSD tiered model selection (Opus for planning, Sonnet for execution) | A (Gap #5) | **Deferred to v0.3.0.** v0.2.0 uses one model for all specs. `--model` override available. | Need cost benchmarking data from real runs before making per-role model decisions. |

---

## 1. Provider Architecture

### Detection Priority Order

When `autospec generate` runs, it resolves an LLM provider using this priority chain. The first available provider wins, unless overridden by `--provider`.

| Priority | Provider | Detection Method | Mechanism | Timeout | v0.2.0 |
|----------|----------|-----------------|-----------|---------|--------|
| 1 | Claude Code CLI | `which claude` exits 0 AND `claude auth status` exits 0 | Subprocess: `claude -p` with stdin prompt | 120s | Yes |
| 2 | Gemini CLI | `which gemini` exits 0 | Subprocess: `gemini -p` with stdin prompt | 120s | Yes |
| 3 | Anthropic API | `ANTHROPIC_API_KEY` env var set | `@anthropic-ai/sdk` direct HTTP | 60s | Yes |
| 4 | OpenAI API | `OPENAI_API_KEY` env var set | `openai` npm SDK direct HTTP | 60s | Yes |
| 5 | Ollama (local) | `curl -s http://localhost:11434/api/tags` succeeds | HTTP to local Ollama API | 300s | Yes |
| 6 | GitHub Copilot | `which copilot` exits 0 AND `gh auth status` exits 0 | `@github/copilot-sdk` JSON-RPC over stdio | 120s | **v0.3.0** |

**Change from v1:** Copilot SDK moved to Priority 6 and deferred. Anthropic API promoted to Priority 3. Provider timeout is now per-provider, not global.

### Provider Interface (Strategy Pattern)

All providers implement a single interface. The CLI never interacts with provider-specific APIs directly.

```typescript
interface LLMProvider {
  readonly name: string;
  readonly requiresApiKey: boolean;
  readonly timeoutMs: number;

  /** Check if this provider is available on the current system */
  isAvailable(): Promise<boolean>;

  /** Generate text from a prompt, streaming chunks */
  generate(prompt: string, options: GenerateOptions): AsyncIterable<string>;

  /** Optional: generate with validated JSON output */
  generateJSON?<T>(prompt: string, schema: JSONSchema, options: GenerateOptions): Promise<T>;

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
  message: string;        // User-facing message
  retryable: boolean;
  rawError?: string;      // Provider stderr or error body
}
```

### Subprocess Robustness (NEW)

All subprocess-based providers (Claude Code, Gemini CLI) follow these rules:

**1. Prompt delivery via stdin, not CLI arguments.**
Large SRS documents (10K+ words) exceed OS argument length limits (~128KB Linux, ~256KB macOS). All prompts are piped via stdin:

```typescript
const proc = execa('claude', [...args], {
  input: prompt,        // stdin, not positional arg
  timeout: this.timeoutMs,
});
```

**2. System prompts via temp files with cleanup.**
System prompts are written to a temp directory, referenced via `--system-prompt-file`, and cleaned up in a `finally` block:

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

**3. Per-provider timeouts.**
| Provider | Default Timeout | Rationale |
|----------|----------------|-----------|
| Claude Code CLI | 120s | Cloud model, network-dependent |
| Gemini CLI | 120s | Cloud model, network-dependent |
| Anthropic API | 60s | Direct API, lower overhead |
| OpenAI API | 60s | Direct API, lower overhead |
| Ollama | 300s | Local model, CPU-bound, can be very slow |

Timeouts are configurable via `AUTOSPEC_TIMEOUT=<seconds>` env var.

**4. NDJSON stream parsing with error recovery.**

```typescript
for await (const line of readline(proc.stdout!)) {
  try {
    const event = JSON.parse(line);
    if (event.type === 'assistant' && event.content) yield event.content;
  } catch {
    // Partial line or non-JSON output — skip, don't crash
    if (opts.verbose) console.warn(`[stream] unparseable line: ${line.slice(0, 80)}`);
  }
}
```

**5. Stderr capture and error parsing.**
When a subprocess exits non-zero, stderr is captured and parsed into a `ProviderError`:

```typescript
try {
  // ... run subprocess
} catch (error) {
  if (error.stderr?.includes('rate limit')) {
    throw { type: 'rate_limit', message: 'Claude Code rate limit reached. Wait or use --provider anthropic-api.', retryable: true, rawError: error.stderr };
  }
  if (error.stderr?.includes('auth') || error.stderr?.includes('login')) {
    throw { type: 'auth', message: `Claude Code auth expired. Run: claude auth login`, retryable: false, rawError: error.stderr };
  }
  throw { type: 'unknown', message: `Claude Code error: ${error.stderr?.slice(0, 200)}`, retryable: false, rawError: error.stderr };
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
    '  - Claude Code CLI: npm install -g @anthropic-ai/claude-code\n' +
    '  - Gemini CLI: npm install -g @google/gemini-cli\n' +
    '  - Or set ANTHROPIC_API_KEY / OPENAI_API_KEY\n'
  );
}
```

### Fallback Chain (Opt-In Only)

**Default behavior:** If the selected provider fails, halt with a clear error. No silent fallback.

**With `--fallback`:** If the primary provider fails with a non-retryable error, try the next available provider in the priority chain. Display a warning:

```
  ! Claude Code CLI failed: rate limit exceeded
  ! Falling back to Anthropic API (direct, uses ANTHROPIC_API_KEY)
  ! To disable fallback: remove --fallback flag
```

**Retry logic (within a single provider):**
1. **Transient errors** (429, 500, 503, timeout): retry up to 2 times with exponential backoff (2s, 6s)
2. **Auth errors** (401, 403): halt immediately, display re-auth instructions
3. **Permanent errors** (invalid model, billing exhausted): halt with clear message
4. **Total retry cap per run:** 5 retries across all specs (prevents runaway costs)

---

## 2. Authentication Strategy

### Zero-Config Principle

The defining UX goal: **a user who already has Claude Code, Gemini CLI, or GitHub Copilot authenticated should get `autospec generate` working with zero additional setup.** No `.env` file, no API key, no OAuth flow.

### Per-Provider Auth Mechanism

| Provider | Auth Source | User Action Required |
|----------|-----------|---------------------|
| Claude Code CLI | Claude Code's own auth store (`~/.claude/`) | None -- already logged in via `claude auth login` |
| Gemini CLI | Google account stored by Gemini CLI | None -- already logged in via `gemini auth login` |
| Anthropic API | `ANTHROPIC_API_KEY` env var or `.env` file | Must set API key once |
| OpenAI API | `OPENAI_API_KEY` env var or `.env` file | Must set API key once |
| Ollama | No auth (local) | Must have Ollama running |
| Copilot SDK (v0.3.0) | `gh auth login` + Copilot subscription + `which copilot` | None if all three present |

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
AUTOSPEC_TIMEOUT=120              # Per-spec timeout in seconds
AUTOSPEC_DEBUG=1                  # Verbose logging
NO_COLOR=1                       # Disable terminal colors
```

### First-Run Detection UX

```
  autospec -- LLM Provider Detection

  + Claude Code CLI    authenticated (user@example.com)
  + ANTHROPIC_API_KEY  found in ~/.env
  - Gemini CLI         not installed
  - GitHub Copilot     deferred (v0.3.0)

  Using: Claude Code CLI (subprocess mode)
  Override: autospec generate --provider anthropic-api
```

---

## 3. Command Design

### Command Structure

```bash
# ======= TIER 1: Generate (NEW -- LLM-backed) =======

autospec generate --srs <file>          # Generate 10 specs + backlog from SRS document
autospec generate --srs <file> --spec 02_backend_lead   # Regenerate single spec
autospec generate --interview           # Interactive interview mode (10 questions -> SRS -> specs)

# ======= TIER 2: Manage (existing, enhanced) =======

autospec init                           # Scaffold project (template-based, no LLM)
autospec init --from-specs              # Scaffold from already-generated specs
autospec sprint <N>                     # Generate sprint execution prompt
autospec spec <name>                    # Generate a feature spec (LLM-backed)

# ======= TIER 3: Inspect =======

autospec status [sprint]                # Sprint progress from backlog
autospec providers                      # List detected LLM providers
autospec version                        # CLI version
```

**Deferred from v0.2.0:**
- `autospec generate --url <url>` -- URL fetching (v0.3.0)
- `autospec skills --install` -- Slash-command generation for AI tools (v0.3.0)
- `autospec instructions --spec <role> --json` -- Prompt inspection API (v0.3.0)

### The `generate` Command -- Primary Interface

```bash
autospec generate --srs requirements.md [options]
```

| Option | Description | Default |
|--------|-------------|---------|
| `--srs <file>` | Path to SRS/PRD/requirements document | Required (unless `--interview`) |
| `--interview` | Interactive interview mode (no SRS file needed) | `false` |
| `--provider <name>` | Force specific LLM provider | Auto-detect |
| `--model <name>` | Model override (opus, sonnet, gpt-4o) | Provider default |
| `--spec <name>` | Generate only one spec file | All 10 + backlog |
| `--output <dir>` | Output directory | `./specs/` |
| `--max-budget <usd>` | Maximum cost cap in USD (best-effort) | `5.00` |
| `--force` | Overwrite existing spec files (skip resume check) | `false` |
| `--fallback` | Enable cross-provider fallback on failure | `false` |
| `--parallel` | Generate non-technical specs (07-09) in parallel | `false` |
| `--yes` | Skip confirmation prompt | `false` |
| `--dry-run` | Show provider, files, estimated cost; no LLM calls | `false` |
| `--verbose` | Show prompts and raw LLM output | `false` |

### Input Formats

1. **SRS file** (`--srs requirements.md`): Markdown, plain text, or YAML. Read in full and injected into the generation prompt. If the SRS exceeds 5,000 words, a warning is displayed recommending splitting or summarizing.
2. **Interactive interview** (`--interview`): 10 sequential questions via `@inquirer/prompts`. Produces an intermediate SRS file (`specs/.interview-srs.md`) that feeds into the standard 13-step pipeline.
3. **Stdin pipe**: `cat requirements.md | autospec generate --srs -` reads from stdin.

### Interview Questions (v0.2.0 -- Fixed Sequential)

| # | Question | Purpose |
|---|----------|---------|
| 1 | What is the project name? | Metadata |
| 2 | Describe the project in 2-3 sentences. | Core vision |
| 3 | What domain/industry is this for? | Context for all specs |
| 4 | Who are the target users? (list roles) | Personas for PM spec |
| 5 | What are the 3-5 core features? | Scope for backend/frontend specs |
| 6 | What tech stack? (or "recommend") | Technical specs |
| 7 | What are the key constraints? (budget, timeline, compliance) | Finance/DevOps/QA specs |
| 8 | How will this be deployed? (cloud, self-hosted, SaaS) | DevOps spec |
| 9 | Any existing systems to integrate with? | Backend/DB specs |
| 10 | What does success look like in 6 months? | Business/Marketing specs |

Output: A structured Markdown SRS that feeds into the standard pipeline. The interview is just an SRS generator, not a separate code path.

### Pre-Generation Confirmation

Before starting LLM calls, display a summary and wait for confirmation (skip with `--yes`):

```
  autospec generate -- Pre-flight Summary

  SRS:       requirements.md (2,847 words)
  Provider:  Claude Code CLI (sonnet)
  Specs:     10 + backlog (11 total)
  Est. cost: ~$0.41 (Sonnet) | ~$4.10 (Opus)
  Est. time: ~100-120 seconds

  Proceed? [Y/n]
```

### Output Structure

All generated files go to `specs/` (or `--output` override):

```
specs/
+-- 01_product_manager.md     # Vision, personas, user stories
+-- 02_backend_lead.md        # API design, services, architecture
+-- 03_frontend_lead.md       # Components, state, routing
+-- 04_db_architect.md        # Schema, migrations, indexes
+-- 05_qa_lead.md             # Test strategy, coverage
+-- 06_devops_lead.md         # CI/CD, infrastructure
+-- 07_marketing_lead.md      # Go-to-market, positioning
+-- 08_finance_lead.md        # Pricing, cost estimates
+-- 09_business_lead.md       # Strategy, competition
+-- 10_ui_designer.md         # Screens, wireframes, accessibility
+-- backlog.md                # Sprint-decomposed tickets
+-- .autospec-meta.json       # Generation metadata (informational only, safe to delete)
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
  autospec generate -- 10 specs + backlog from requirements.md

  Provider: Claude Code CLI (sonnet)
  Input: requirements.md (2,847 words)

  [1/11] 01_product_manager.md    ==================== done  (4.2s)
  [2/11] 02_backend_lead.md       ============-------- 62%   streaming...
  [3/11] 03_frontend_lead.md      -------------------- queued
  ...
  [11/11] backlog.md              -------------------- queued

  Cost so far: ~$0.12 | Elapsed: 12s
```

### `--dry-run` Output

```
  autospec generate --dry-run -- Pre-flight Report

  Provider:  Claude Code CLI (subprocess, sonnet)
  SRS:       requirements.md (2,847 words, sha256:abc123...)
  Output:    ./specs/

  Files to generate:
    [1]  specs/01_product_manager.md  (NEW)
    [2]  specs/02_backend_lead.md     (NEW)
    ...
    [11] specs/backlog.md             (NEW)

  Estimated cost: ~$0.41 (Sonnet)
  Estimated time: ~100-120 seconds

  System prompt preview (01_product_manager):
    <role>You are the Product Manager for...</role>
    <output_format>Generate a Markdown document...</output_format>
    ...

  No LLM calls made. Run without --dry-run to generate.
```

---

## 4. Spec Generation Pipeline

### Architecture: Chained Calls with Optional Parallelism

A single mega-prompt asking for all 10 specs would exceed quality thresholds. Instead, the pipeline uses **chained sequential calls** -- one LLM call per spec file, each receiving the SRS plus a role-specific system prompt. Non-technical specs (07-09) can optionally run in parallel.

### Cost and Time Estimates

| Model | Per-Spec Cost | Full Run (11 calls) | Est. Time |
|-------|--------------|---------------------|-----------|
| Claude Sonnet 4 | ~$0.04 | ~$0.41 | 100-120s |
| Claude Opus 4 | ~$0.40 | ~$4.10 | 100-150s |
| Claude Haiku | ~$0.004 | ~$0.04 | 60-80s |
| GPT-4o | ~$0.05 | ~$0.50 | 100-120s |
| GPT-4o-mini | ~$0.005 | ~$0.05 | 60-80s |
| Ollama (70B) | $0 (local) | $0 | 300-600s |
| Ollama (7B) | $0 (local) | $0 | 120-300s |

**Assumptions:** ~5K input tokens + ~4K output tokens per spec. Metadata extraction is ~500 input + ~200 output. Backlog is ~8K input + ~3K output.

**`--max-budget` behavior:** Before each LLM call, the pipeline checks cumulative estimated cost against `--max-budget`. If the next call would exceed the budget, generation halts with a message showing progress so far. **Best-effort for providers without cost reporting** (Gemini CLI, Ollama) -- the flag is ignored with a warning.

### Pipeline Steps

```
SRS Document
    |
    v
[1] Extract project metadata (name, type, stack, domain)
    |  Small, fast call. Output: structured JSON (via --json-schema or tool-use).
    |  Used as context for all subsequent calls.
    |
    v
[2] Generate spec 01_product_manager.md
    |  System prompt: role definition + output format + constraints
    |  User prompt: SRS + project metadata
    |  -> Write to disk immediately
    |  -> Extract summary (deterministic, no LLM)
    |
    v
[3-7] Generate specs 02-06 (sequential, each gets prior summaries)
    |  Each receives: SRS + metadata + summaries of all previously generated specs
    |
    v
[8-10] Generate specs 07-09
    |  DEFAULT: sequential (same as above)
    |  WITH --parallel: concurrent (each gets SRS + metadata + summaries of 01-06 only)
    |
    v
[11] Generate spec 10_ui_designer.md (sequential, gets all prior summaries)
    |
    v
[12] Generate backlog.md
    |  System prompt: backlog rules (from 02-specs.md methodology)
    |  User prompt: SRS + ALL 10 spec summaries
    |  -> Write to disk
    |
    v
[13] Validate (local, no LLM)
    |  -> Check all 11 files exist
    |  -> Check YAML frontmatter parses (zod schema)
    |  -> Check per-role minimum line counts
    |  -> Check required sections present
    |  -> Check cross-references resolve
    |
    v
[14] Write metadata
    -> .autospec-meta.json (informational, never required for operation)
```

### Resume Mechanism

Resume is **default behavior** -- no flag needed. `--force` disables it.

When `autospec generate --srs requirements.md` runs:
1. Compute `sha256` hash of the SRS file
2. For each spec file that already exists in the output directory:
   - Parse its YAML frontmatter
   - If `source_hash` matches the current SRS hash, **skip** (already generated from this SRS)
   - If `source_hash` differs or frontmatter is missing, **regenerate**
3. Display which specs are skipped vs. queued

```
  Resume detected: 4 of 11 specs already generated from this SRS

  [1/11] 01_product_manager.md    == skipped (up to date)
  [2/11] 02_backend_lead.md       == skipped (up to date)
  [3/11] 03_frontend_lead.md      == skipped (up to date)
  [4/11] 04_db_architect.md       == skipped (up to date)
  [5/11] 05_qa_lead.md            -------------------- queued
  ...
```

### Deterministic Summary Extraction (Enhanced)

After each spec is generated, a deterministic (no LLM) summary is extracted for use by subsequent specs:

```typescript
function summarizeSpec(specContent: string): string {
  const sections: string[] = [];

  // 1. Section headers (structural overview)
  const headers = specContent.match(/^#{1,3} .+$/gm) ?? [];
  sections.push('## Sections\n' + headers.join('\n'));

  // 2. Named entities (personas, users, roles)
  const personaPatterns = [
    /(?:persona|user|role|actor|stakeholder)[:\s]+["']?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
    /\*\*([A-Z][a-z]+)\*\*\s*[-—:]/g,  // Bold name followed by dash/colon
  ];
  const entities = new Set<string>();
  for (const pattern of personaPatterns) {
    for (const match of specContent.matchAll(pattern)) {
      entities.add(match[1]);
    }
  }
  if (entities.size > 0) sections.push('## Entities\n' + [...entities].join(', '));

  // 3. API endpoints
  const endpoints = specContent.match(/(?:GET|POST|PUT|PATCH|DELETE)\s+\/[a-z0-9\/:_-]+/gi) ?? [];
  if (endpoints.length > 0) sections.push('## API Endpoints\n' + [...new Set(endpoints)].join('\n'));

  // 4. Tech stack terms
  const techTerms = specContent.match(/(?:React|Vue|Angular|NestJS|Express|Django|Rails|PostgreSQL|MongoDB|Redis|Docker|Kubernetes|AWS|GCP|Azure|Nginx|GraphQL|REST|gRPC|WebSocket)/gi) ?? [];
  if (techTerms.length > 0) sections.push('## Tech Stack\n' + [...new Set(techTerms)].join(', '));

  // 5. Tables (first 3)
  const tables = extractMarkdownTables(specContent);
  if (tables.length > 0) sections.push('## Key Tables\n' + tables.slice(0, 3).join('\n\n'));

  return sections.join('\n\n');
}
```

This keeps each LLM call's input under ~8K tokens total while preserving cross-spec coherence through named entities, API paths, and technology choices.

### System Prompt Architecture

Each spec role has a dedicated system prompt stored as a Handlebars template in `cli/src/prompts/system/`. Prompts use XML-tagged sections (proven by GSD research):

```xml
<role>
You are the Backend Lead for the project described below.
You are writing spec 02_backend_lead.md for this project.
</role>

<output_format>
Generate a Markdown document.
Start with YAML frontmatter (role, spec_version, generated_by, model, provider, source_srs, source_hash, generated_at).
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

### Error Handling for Mid-Pipeline Failures

**Failure modes and responses:**

| Failure | Detection | Response | Retries |
|---------|-----------|----------|---------|
| Empty/truncated response | Output < 50 lines | Retry with same prompt | Up to 2 |
| Missing YAML frontmatter | Frontmatter parse fails | Retry with augmented prompt: "Your response MUST start with YAML frontmatter between --- markers" | 1 |
| Missing required sections | Section-presence validation fails | Retry with explicit section list appended to prompt | 1 |
| Semantic drift (wrong role content) | Out of scope for v0.2.0 | Flagged as known limitation; user can `--spec <name> --force` to regenerate | 0 |
| Provider timeout | Exceeds per-provider timeout | Retry once, then halt | 1 |
| Provider auth failure | 401/403 or auth-related stderr | Halt immediately with re-auth instructions | 0 |
| Budget exceeded | Cumulative cost > `--max-budget` | Halt, show progress, suggest resuming later | 0 |

**Total retry cap per run:** 5 retries across all specs. Prevents runaway costs from a provider that keeps returning garbage.

**Partial completion is always useful.** Specs written to disk before a failure are preserved. The user can resume later (default behavior) or force-regenerate specific specs.

### Validation (Step 13)

**Primary validation: required sections present.** Each role has a list of required section headings. Validation checks that each heading (or a close variant) appears in the generated spec.

**Secondary validation: per-role minimum line counts.**

| Role | Min Lines | Rationale |
|------|-----------|-----------|
| 01_product_manager | 200 | Personas, stories, acceptance criteria |
| 02_backend_lead | 300 | API endpoints, architecture, data flow |
| 03_frontend_lead | 250 | Components, routing, state management |
| 04_db_architect | 250 | Schema, migrations, indexes, ERD |
| 05_qa_lead | 250 | Test strategy, test cases, coverage |
| 06_devops_lead | 200 | CI/CD, infrastructure, monitoring |
| 07_marketing_lead | 150 | May be short for dev tools / internal projects |
| 08_finance_lead | 150 | May be short for OSS / internal projects |
| 09_business_lead | 150 | May be short for solo dev projects |
| 10_ui_designer | 200 | Wireframes, design tokens, accessibility |
| backlog | 100 | Sprint table with tickets |

**Ollama override:** When the provider is Ollama, all minimum line counts are halved. A quality warning is displayed:

```
  ! Ollama provider detected. Spec quality may be lower than cloud models.
  ! Recommended models: llama3-70b, mixtral-8x7b (32K+ context required)
```

**Other validation checks:**
- YAML frontmatter parses without errors (validated with zod schema)
- Cross-references to other spec files resolve (e.g., "see specs/02_backend_lead.md" references a file that exists)
- Backlog has valid Markdown table format

### Validation Layer Responsibilities

Three validation mechanisms serve different purposes:

| Layer | Tool | What it validates | When |
|-------|------|-------------------|------|
| LLM output structure | `--json-schema` (Claude Code) or tool-use (Anthropic API) | Metadata extraction JSON shape | Step 1 only |
| Generated spec structure | `zod` | Frontmatter fields, config objects, CLI input shapes | Step 13 (post-generation) |
| YAML parsing | `yaml` package | Raw YAML string -> JS object conversion | Step 13, within zod validation |

### `.autospec-meta.json` (Informational Only)

This file is **purely informational**. Deleting it does not break any AutoSpec functionality. The resume mechanism reads frontmatter from the spec files themselves, not from this JSON file.

Contents:
```json
{
  "version": "0.2.0",
  "generatedAt": "2026-03-20T14:30:00Z",
  "provider": "claude-code",
  "model": "claude-sonnet-4-20250514",
  "sourceSrs": "requirements.md",
  "sourceHash": "sha256:abc123...",
  "specs": {
    "01_product_manager": { "status": "complete", "tokens": 5200, "costUsd": 0.04, "durationMs": 4200 },
    "02_backend_lead": { "status": "complete", "tokens": 6100, "costUsd": 0.05, "durationMs": 5800 }
  },
  "totalCostUsd": 0.41,
  "totalDurationMs": 112000
}
```

Users can `.gitignore` this file if they prefer not to track generation metadata in version control.

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
| Resume on interruption | No | No | No | No | **Yes** |

### The AutoSpec Value Proposition

**"One SRS in, ten expert specs out."**

AutoSpec is the only tool that:

1. **Accepts an existing requirements document** -- you don't start from scratch or sit through an interview (unless you want to)
2. **Produces role-decomposed specifications** -- 10 specialist perspectives, not one monolithic document
3. **Generates a sprint-ready backlog** -- tickets extracted from all 10 specs, estimated, dependency-mapped
4. **Requires zero API key setup** for users who already have Claude Code or Gemini CLI
5. **Runs in one command** -- `autospec generate --srs requirements.md` -> done
6. **Resumes on interruption** -- partial runs are preserved and continued automatically

---

## 6. Technical Stack

### Dependencies (to add to `cli/package.json`)

```json
{
  "dependencies": {
    "@inquirer/prompts": "^5.5.0",
    "chalk": "^5.3.0",
    "commander": "^12.1.0",
    "fs-extra": "^11.2.0",
    "handlebars": "^4.7.8",
    "ora": "^8.0.1",
    "yaml": "^2.4.5",
    "execa": "^9.0.0",
    "dotenv": "^16.4.0",
    "zod": "^3.23.0"
  },
  "peerDependencies": {
    "@anthropic-ai/sdk": ">=0.30.0"
  },
  "peerDependenciesMeta": {
    "@anthropic-ai/sdk": { "optional": true }
  }
}
```

**Change from v1:** Removed `@github/copilot-sdk` from peer dependencies (deferred to v0.3.0). All provider SDKs are dynamically imported only when their provider is selected.

### Source File Structure

```
cli/src/
+-- index.ts                          # CLI entry, commander setup
+-- commands/
|   +-- init.ts                       # Existing: template scaffolding
|   +-- generate.ts                   # NEW: LLM-backed spec generation
|   +-- status.ts                     # Existing: sprint status
|   +-- sprint.ts                     # Existing: sprint prompt generation
|   +-- spec.ts                       # Existing: feature spec
|   +-- providers.ts                  # NEW: list detected providers
|   +-- dashboard.ts                  # Existing: TUI dashboard
+-- providers/
|   +-- interface.ts                  # LLMProvider interface + GenerateOptions + ProviderError
|   +-- resolver.ts                   # Auto-detection + priority chain
|   +-- claude-code.provider.ts       # Subprocess: claude via stdin
|   +-- gemini-cli.provider.ts        # Subprocess: gemini via stdin
|   +-- anthropic-api.provider.ts     # Direct SDK
|   +-- openai-api.provider.ts        # Direct SDK
|   +-- ollama.provider.ts            # Local HTTP
+-- pipeline/
|   +-- generate-specs.ts             # Orchestrates the 14-step pipeline
|   +-- extract-metadata.ts           # Step 1: project metadata from SRS
|   +-- generate-single-spec.ts       # Steps 2-11: one spec at a time
|   +-- generate-backlog.ts           # Step 12: backlog from all specs
|   +-- validate-specs.ts             # Step 13: local validation (zod + section checks)
|   +-- summarize-spec.ts             # Deterministic spec summary extraction
|   +-- resume.ts                     # Resume logic: check existing specs + source_hash
+-- prompts/
|   +-- system/
|   |   +-- 01_product_manager.hbs
|   |   +-- 02_backend_lead.hbs
|   |   +-- ...
|   |   +-- backlog.hbs
|   +-- extract-metadata.hbs
|   +-- interview-questions.ts        # 10 fixed questions for --interview mode
+-- generators/                       # Existing generators (keep)
+-- parsers/                          # Existing parsers (keep)
+-- utils/
    +-- config.ts                     # Existing
    +-- file.ts                       # Existing
    +-- env.ts                        # NEW: .env cascade reader
    +-- cost.ts                       # NEW: token counting + cost estimation
    +-- temp.ts                       # NEW: temp file/directory management with cleanup
```

### npm Publish Readiness

1. **Version bump**: `0.1.0` -> `0.2.0` for the LLM integration release
2. **`engines`**: Keep `"node": ">=18.0.0"`
3. **`prepublishOnly`**: Already set to `"npm run build && npm test"`

### Test Strategy

```bash
# Unit tests: mock providers, test pipeline logic, test validation
cd cli && npx vitest run

# Integration test: real provider (CI only, requires ANTHROPIC_API_KEY secret)
ANTHROPIC_API_KEY=${{ secrets.ANTHROPIC_API_KEY }} npx vitest run tests/integration/

# Smoke test: verify CLI boots and --help works (no LLM needed)
node dist/index.js --help
node dist/index.js providers
```

Key test areas:
- Provider detection (mock `which`, env vars, HTTP responses)
- Resume logic (mock existing spec files with matching/mismatching hashes)
- Summary extraction (deterministic, fully testable)
- Validation (per-role thresholds, section presence, frontmatter parsing)
- Subprocess error parsing (mock stderr outputs)
- Cost estimation (known token counts -> expected costs)

---

## 7. Version Roadmap

### v0.2.0 -- MVP (Target: Sprint 8-9)

**Scope:** `autospec generate --srs <file>` works end-to-end with 5 providers.

| Feature | Status |
|---------|--------|
| Provider architecture (5 providers, auto-detect, `--provider` override) | Build |
| Chained sequential pipeline (14 steps) | Build |
| Resume on interruption (default behavior) | Build |
| Per-role validation with section-presence checks | Build |
| `--interview` mode (10 fixed questions) | Build |
| `--parallel` flag for non-technical specs | Build |
| `--dry-run` with cost estimate | Build |
| `--fallback` (opt-in cross-provider fallback) | Build |
| Pre-generation confirmation prompt | Build |
| Cost tracking in `.autospec-meta.json` | Build |
| YAML frontmatter on all generated specs | Build |
| Subprocess robustness (stdin, timeouts, temp cleanup) | Build |
| Provider error parsing with user-friendly messages | Build |
| Ollama quality guardrails | Build |

**Not in v0.2.0:** `--url`, Copilot SDK, skills installation, `autospec instructions`, per-role model routing, adaptive interview, VS Code extension.

### v0.3.0 -- Skills + Copilot + URL (Target: Sprint 10-11)

| Feature | Description |
|---------|-------------|
| `autospec skills --install` | Detect AI tools (Claude Code, Cursor, Copilot), generate slash-command files (`.claude/commands/autospec-*.md`, `.github/prompts/autospec-*.md`) that call `autospec generate --spec <name> --force` under the hood |
| `autospec instructions --spec <role> --json` | Return compiled system + user prompt for a spec role. Enables AI skills to call at runtime, `--dry-run` transparency, prompt debugging |
| `autospec generate --url <url>` | Fetch requirements from URL (Markdown/plain text only in v0.3.0; no HTML parsing) |
| Copilot SDK provider | Implement when SDK reaches stable release. Proper async streaming, tool-call handling, Copilot subscription detection |
| Per-role model routing | Use cheaper models for simpler specs (marketing, finance), reasoning models for complex specs (backend, DB). Based on v0.2.0 cost data |
| SRS chunking for large documents | For SRS > 5,000 words, extract role-relevant sections per spec instead of injecting full document |
| Adaptive interview follow-ups | Context-aware follow-up questions based on previous answers |

### v1.0.0 -- Production Grade (Target: Sprint 14+)

| Feature | Description |
|---------|-------------|
| `autospec validate` | Check codebase compliance with generated specs (SpecIt-inspired) |
| `autospec diff` | Detect specification drift between specs and implementation |
| `autospec update --srs <file> --diff` | Delta updates to specs when requirements change (show what changed, apply incrementally) |
| LLM-based `--verify` | Cross-check spec coherence via LLM (does backend spec cover all PM user stories?) |
| Plugin system for custom spec roles | `autospec plugin add 11_legal_lead` for regulated industries |
| VS Code extension | `@autospec` chat participant via `vscode.chat.createChatParticipant()` |
| Artifact history | `specs/.history/` for tracking spec evolution over time |
| Spec-to-code scaffolding | Generate boilerplate code from specs (project structure, API stubs, DB schema) |

---

## Appendix A: Key Findings from Research

### Comparative Summary

| Dimension | GSD (Researcher A) | OpenSpec (Researcher B) | SpecIt (Researcher C) |
|-----------|--------------------|-----------------------|----------------------|
| **Architecture** | Prompt files installed into AI runtimes (v1) / TypeScript harness with Pi SDK (v2) | CLI generates slash commands for 24 AI tools; no LLM calls | Go binary with adaptive TUI interview; calls LLMs directly |
| **Auth Model** | Zero-config: piggybacks on existing CLI auth (v1) / OAuth + API key wizard (v2) | Zero-auth: no LLM calls to authenticate | Auto-detect env vars + OAuth commands |
| **SRS Input** | No -- builds requirements from interview | No -- requires interactive AI session | No -- interview only |
| **Output** | PROJECT.md, REQUIREMENTS.md, ROADMAP.md, task plans (XML) | proposal.md, delta specs, design.md, tasks.md | Single `.spec` YAML file |
| **Role Decomposition** | No | No | No |
| **Key Strength** | Context rot elimination via fresh-context agents | Universal tool support (24 AI tools) | Adaptive interview UX |
| **Key Weakness** | No SRS input path; high token cost | Cannot generate autonomously | Very early (v0.1.2), flat output |
| **Adoption** | 23k+ GitHub stars | ~500 stars | Brand new |

### Patterns Adopted

| Pattern | Source | How AutoSpec Uses It |
|---------|--------|---------------------|
| Zero-config auth via CLI piggybacking | GSD v1 | Priority 1-2 providers detect existing CLI tools |
| XML-tagged prompt sections | GSD v1 | All system prompts use `<role>`, `<output_format>`, `<constraints>` |
| Deterministic scaffolding in code | GSD v1 | File names, frontmatter, directory structure determined by code |
| `.env` cascade for API key discovery | Aider | CWD -> git root -> home directory |
| Provider auto-detection with user feedback | SpecIt | Show discovered providers on first run |
| Dynamic instruction assembly | OpenSpec | System prompts compiled from Handlebars templates at runtime |
| Strategy pattern for providers | OpenSpec research | `LLMProvider` interface with 5 implementations |
| `--json-schema` for structured output | Claude Code CLI | Metadata extraction step uses validated JSON |

### Patterns Avoided

| Anti-Pattern | Source | Why AutoSpec Avoids It |
|-------------|--------|------------------------|
| Single mega-prompt for all output | ai-scaffold | Quality degrades; no partial recovery |
| Require interactive AI session | OpenSpec, Spec Kit | Blocks CI/CD and headless use |
| Go binary distributed via npm postinstall | SpecIt | Fragile cross-platform; Node.js native is simpler |
| Undocumented protocols | Copilot SDK (ACP) | Deferred until stable release |
| Telemetry on by default | OpenSpec (PostHog) | Privacy concern; if added, must be opt-in |
| Silent cross-provider fallback | Proposal v1 | Can cause unexpected API charges; now opt-in only |
| Flat line-count validation | Proposal v1 | Per-role thresholds + section-presence checks instead |

## Appendix B: Decisions Log

| Decision | Options Considered | Choice | Rationale |
|----------|-------------------|--------|-----------|
| Copilot SDK in v0.2.0? | Ship now (v1 proposal) vs. defer | **Defer to v0.3.0** | All 3 reviewers flagged SDK instability. 5 providers is sufficient for MVP. |
| Cross-provider fallback | Auto (v1 proposal) vs. opt-in | **Opt-in (`--fallback`)** | Silent cost escalation damages trust (Reviewer A). GSD uses single-runtime model. |
| Validation approach | Flat 300-line minimum vs. per-role thresholds vs. section-presence | **Per-role thresholds + section-presence (primary)** | Line counts are secondary; section presence catches actual quality issues. |
| `--url` in v0.2.0? | Ship (v1 proposal) vs. defer | **Defer to v0.3.0** | HTML parsing, auth, JS rendering = too much scope (Reviewer C). |
| Interview mode depth | Adaptive (SpecIt-style) vs. fixed questions | **10 fixed questions** | Adaptive requires TUI library investment. Fixed questions feed same pipeline. |
| Skills generation | Part of `generate` vs. separate command | **Separate `autospec skills --install` in v0.3.0** | Generation and skills distribution are different concerns. Interface defined now. |
| Resume mechanism | Check file existence vs. check source_hash in frontmatter | **Check source_hash in frontmatter** | File existence alone doesn't detect SRS changes. Hash comparison is reliable. |
| Prompt delivery for subprocess providers | CLI argument vs. stdin vs. temp file | **Stdin** | CLI args hit OS length limits on large SRS documents. Stdin has no size limit. |
| `.autospec-meta.json` required for operation? | Required vs. informational | **Informational only** | Specs are canonical state. Meta file is convenience, not dependency. |
| `--parallel` scope | All specs vs. non-technical only | **Non-technical specs 07-09 only** | Technical specs (02-06) depend on each other. 07-09 are independent. |
