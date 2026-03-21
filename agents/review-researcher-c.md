# Proposal Review — Researcher C (SpecIt/CLI Expert)
**Date:** 2026-03-21

## Overall Assessment
**Approve with changes.** The proposal is strong — it correctly synthesizes the three research reports into a coherent architecture and makes sound top-level decisions (Pattern B primary, chained pipeline, Strategy pattern for providers). However, there are several gaps around error resilience, cost modeling, subprocess robustness, and the interview mode that need addressing before implementation begins.

## What the Proposal Gets Right

1. **Provider priority chain is exactly right.** The detection order (Claude Code CLI > Gemini CLI > Copilot > Anthropic API > OpenAI API > Ollama) matches what I recommended. Zero-config for CLI users, graceful degradation to API keys. The `resolveProvider()` function with override support is clean.

2. **Chained sequential calls, not mega-prompt.** This is the correct architecture. My research showed that SpecIt's single `.spec` output is flat precisely because it tries to do everything in one interview session. The proposal's approach — one LLM call per spec, each enriched with summaries of prior specs — preserves quality while enabling partial recovery. The deterministic summary extraction (not another LLM call) is a smart cost-saving decision.

3. **Aider's `.env` cascade is properly reflected.** The five-level cascade (CLI flag > env var > CWD `.env` > git root `.env` > `~/.autospec/.env`) matches the pattern I documented. The one improvement: the proposal uses `~/.autospec/.env` instead of Aider's `~/.aider/oauth-keys.env` — this is a better choice since it keeps AutoSpec's config self-contained.

4. **Structured output strategy is pragmatic.** Using `--json-schema` only for the metadata extraction step (step 1) and plain Markdown for spec content is the right call. I had flagged Claude Code's `--json-schema` as a "game-changer," but the proposal correctly recognizes that wrapping 500-line Markdown specs in JSON would add complexity without benefit. JSON for structured data, Markdown for prose — correct separation.

## Concerns & Suggestions

### 1. The 13-step pipeline needs cost and time estimates

The proposal shows a progress UX with "Estimated cost: ~$0.45" but never actually models the cost. Let me estimate:

- **Step 1** (metadata extraction): ~500 input tokens + ~200 output = ~$0.002 (Sonnet)
- **Steps 2-10** (9 specs): ~5K input tokens each (SRS + system prompt + summaries) + ~4K output each = 9 x ~$0.04 = ~$0.36
- **Step 11** (backlog): ~8K input (all summaries) + ~3K output = ~$0.05
- **Total (Sonnet)**: ~$0.41 per full generation run
- **Total (Opus)**: ~$4.10 per run (10x cost)
- **Total (Haiku)**: ~$0.04 per run

**Time estimate**: At ~10s per spec call (including network), a full run takes 100-120 seconds. This should be documented so users know what to expect. The `--max-budget` default of $5.00 is reasonable for Sonnet but will be consumed in a single run with Opus — the proposal should warn about this.

**Suggestion:** Add a cost estimation table to Section 4 or Section 3, and display the model + estimated cost BEFORE starting generation (with a confirmation prompt unless `--yes` is passed).

### 2. Error handling for mid-pipeline LLM failures is under-specified

The proposal says "If spec #5 fails, we retry it without re-generating specs #1-4." But it doesn't specify:

- **What constitutes a "failed" spec?** A 0-byte response? A response that doesn't contain YAML frontmatter? A response shorter than 50 lines?
- **How many retries per spec?** The fallback chain section mentions 3 retries for transient errors, but is that per-spec or per-generation-run?
- **What if the LLM returns syntactically valid Markdown but semantically wrong content?** (e.g., a backend spec that talks about marketing) The validation step checks structure (line count, sections, frontmatter) but not semantic correctness.

**Suggestion:** Define explicit failure modes:
- **Empty/truncated response** (< 50 lines): retry up to 2 times with the same prompt
- **Missing frontmatter**: retry once with an augmented prompt emphasizing frontmatter requirement
- **Missing required sections**: retry once with explicit section list in the prompt
- **Semantic drift**: out of scope for v0.2.0, but flag as a known limitation
- **Total retries per run**: cap at 5 retries across all specs to prevent runaway costs

### 3. Subprocess delegation (Pattern B) needs more robustness

The `ClaudeCodeProvider` implementation has several gaps:

**a) Prompt size limits.** The code passes the entire prompt as a CLI argument: `execa('claude', [...args, prompt])`. For a large SRS (10K+ words), this will exceed the OS argument length limit (~128KB on Linux, ~256KB on macOS). The proposal should use stdin piping or a temp file for the prompt:

```typescript
const proc = execa('claude', [...args], { input: prompt });
// OR
const tmpPrompt = await writeTempFile(prompt);
args.push('--input-file', tmpPrompt);
```

**b) Timeout handling.** No timeout is specified for subprocess calls. If `claude -p` hangs (network issue, model overloaded), the CLI will hang forever. Add a timeout (e.g., 120s per spec) with clear error messaging.

**c) Temp file cleanup.** The code creates temp files for system prompts (`writeTempFile(opts.systemPrompt)`) but never cleans them up. Use a try/finally or a temp directory that's cleaned at pipeline end.

**d) Stream parsing fragility.** The `readline` approach for NDJSON parsing assumes each line is a complete JSON object. If the subprocess buffers output differently, partial lines will cause `JSON.parse` to throw. Use a proper NDJSON parser or add try/catch around the parse.

**Suggestion:** Add a "Subprocess Robustness" subsection to Section 1 covering prompt delivery (stdin vs args), timeouts, temp file lifecycle, and stream parsing.

### 4. The `--interview` mode needs more design before shipping

The proposal mentions `--interview` (SpecIt-inspired) but provides almost no detail. Open Question #2 asks whether to ship "simple sequential" or "adaptive follow-ups" and recommends simple first. I agree with shipping simple first, but the proposal should specify:

- **How many questions?** (I'd suggest 8-12 covering: project name, domain, tech stack, target users, key features, constraints, deployment, timeline)
- **What framework?** The CLI already has `@inquirer/prompts` — use it for sequential prompts
- **Output format?** The interview should produce an intermediate SRS Markdown file that then feeds into the same 13-step pipeline. This keeps the architecture clean — interview is just an SRS generator, not a separate pipeline.

SpecIt's adaptive interview is genuinely impressive (split-pane TUI, live preview, context-aware follow-ups), but it requires a Go-level TUI library (Charm/Bubbletea). Replicating that in Node.js with Ink or blessed is a multi-sprint effort. The simple sequential approach is correct for v0.2.0.

**Suggestion:** Add 5-10 lines specifying the interview question flow and confirm that interview output feeds into the standard pipeline.

### 5. Ollama support needs quality guardrails

Ollama is Priority 6, which is appropriate. But the proposal doesn't address the elephant in the room: **local models produce dramatically worse specs than cloud models.** A 7B parameter model cannot generate a coherent 300-800 line backend spec. Even 70B models struggle with the structured, cross-referential output AutoSpec requires.

**Suggestion:** Add minimum model size guidance for Ollama (e.g., "Ollama support requires a model with >= 32K context window; recommended: llama3-70b, mixtral-8x7b, or codellama-70b"). Consider reducing the minimum line count validation (300 lines) for Ollama to something more realistic (150 lines), or warn the user that quality will be significantly lower.

### 6. The `--url` flag is a feature creep risk

Fetching from URLs (Google Docs, Notion, GitHub issues) requires HTML parsing, JavaScript rendering (for SPAs), authentication (for private docs), and content extraction. This is a significant scope addition that could easily consume a full sprint.

**Suggestion:** Defer `--url` to v0.3.0. For v0.2.0, document that users can `curl` or copy-paste their requirements into a local file. If it ships in v0.2.0, limit it to plain-text/Markdown URLs only (no HTML parsing).

### 7. Dependency choices are sound but `zod` overlap needs clarification

The proposal adds `zod` for schema validation but the CLI already has `yaml` for YAML parsing. The relationship between these should be explicit:

- **`zod`**: validates the shape of parsed data (frontmatter fields, config objects, CLI input)
- **`yaml`**: parses YAML strings into objects
- **`--json-schema` (Claude Code flag)**: validates LLM output at the provider level

These three validation layers serve different purposes, but the proposal should state this clearly so implementers don't duplicate validation logic.

### 8. Missing: `--resume` flag for interrupted runs

The proposal mentions idempotent re-runs ("specs already written to disk are preserved; re-running skips completed specs") but doesn't expose this as an explicit `--resume` flag. Without it, users must figure out that re-running the same command will skip completed specs.

**Suggestion:** Add `--resume` that checks `.autospec-meta.json` for completion status and skips already-generated specs. Make it the default behavior (i.e., `autospec generate` always resumes unless `--force` is passed).

## SpecIt/CLI-Specific Gaps

### Gap 1: No mention of SpecIt's `validate` and `diff` commands

My research highlighted SpecIt's `specit validate` (check codebase compliance with spec) and `specit diff` (detect specification drift) as forward-looking features. The proposal focuses entirely on generation but doesn't mention spec-to-code validation as a future capability. Even if it's out of scope for v0.2.0, it should appear in a "Future Work" section — it's a natural extension of the pipeline and a competitive differentiator.

### Gap 2: SpecIt's plugin system was not evaluated

SpecIt has a `specit plugin` command for extensibility. My research didn't go deep on this because SpecIt is too early (v0.1.2), but the proposal should note that a plugin/extension system for custom spec roles (e.g., adding an `11_legal_lead.md` for regulated industries) is a natural v1.0 feature.

### Gap 3: The Copilot SDK assessment is correct but incomplete

The proposal correctly recommends deferring Copilot SDK to v0.3.0 (Open Question #3). My research confirmed the SDK is in Technical Preview with undocumented ACP protocol. However, the proposal should note that the Copilot SDK's `@github/copilot-sdk` npm package provides a fundamentally different integration pattern (JSON-RPC over stdio) than the subprocess pattern used for Claude Code and Gemini. This means the `CopilotSDKProvider` implementation will be more complex and harder to test than the subprocess providers. The proposal's code sample for `CopilotSDKProvider` looks plausible but is based on limited documentation — it should be marked as "speculative, needs validation against actual SDK behavior."

### Gap 4: No `--dry-run` implementation detail

The proposal lists `--dry-run` as a flag but doesn't specify what it shows. Based on my research of `create-ai-scaffold`'s `--dry-run` (which previews prompts without invoking AI), AutoSpec's `--dry-run` should:
- Show which provider would be used
- Show the 11 files that would be generated
- Show the system prompt for each spec (or at least the first one)
- Show estimated cost
- Exit without making any LLM calls

## Verdict

**Approve with changes.** The proposal is architecturally sound and correctly positioned in the market. The provider strategy, chained pipeline, and zero-config auth approach are all well-designed. The main gaps are in operational robustness (subprocess limits, timeouts, error handling) and scope management (`--url` and `--interview` need tighter scoping for v0.2.0). Address the 8 numbered concerns above — especially #2 (error handling), #3 (subprocess robustness), and #6 (defer `--url`) — and this proposal is ready for sprint planning.

The competitive positioning ("One SRS in, ten expert specs out") is strong. No existing tool does this. Ship it.
