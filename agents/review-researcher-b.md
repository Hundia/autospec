# Proposal Review — Researcher B (OpenSpec Expert)
**Date:** 2026-03-21

## Overall Assessment
**Approve with changes.** The proposal is strong, well-structured, and correctly synthesizes the key lessons from all three research reports. The provider architecture, pipeline design, and competitive positioning are sound. However, there are several gaps in the OpenSpec integration path, a structural issue with the Copilot SDK provider, and missing considerations around streaming, cost, and the dual-path (headless CLI vs live skills) architecture that my research specifically highlighted.

## What the Proposal Gets Right

1. **The strategy pattern for providers is exactly what my research recommended (Lesson 4).** The `LLMProvider` interface with `isAvailable()` and `generate()` returning `AsyncIterable<string>` is the correct abstraction. The proposal faithfully implements the pattern I outlined, including the detection priority chain and the `--provider` override flag.

2. **Chained sequential generation is the right call.** The 13-step pipeline (extract metadata, generate specs 1-10, generate backlog, validate, write metadata) correctly avoids the mega-prompt anti-pattern. The deterministic `summarizeSpec()` function that extracts headers/tables/code blocks without an LLM call is an elegant solution to the context-growth problem. This matches OpenSpec's principle of keeping deterministic logic in code.

3. **The dual-path value proposition is correctly identified.** My research (Lesson 5) explicitly called out that OpenSpec only supports the live-skills path and cannot do headless generation. The proposal makes headless `autospec generate --srs` the killer feature while acknowledging skills integration as a separate concern (Open Question #7). This is the right strategic framing.

4. **Zero-config auth is correctly implemented for all three CLI-piggybacking providers.** Claude Code via `claude auth status`, Gemini via `gemini --version`, Copilot via `gh auth status` — each correctly reuses existing credentials without requiring any AutoSpec-specific authentication. The Aider-style `.env` cascade for the API-key fallback is also correctly adopted.

## Concerns & Suggestions

1. **The CopilotSDKProvider implementation has a critical streaming bug.** The current implementation collects all chunks into an array, then yields them as a single joined string after `session.idle`. This defeats the purpose of `AsyncIterable<string>` — the caller gets no streaming. The fix is to use an async queue or a `PassThrough`-style pattern where `session.on('assistant.message_delta')` pushes to a channel that the `AsyncIterable` pulls from. Without this, the Copilot provider's UX will be noticeably worse than Claude Code (which streams line-by-line from stdout). The GeminiCLIProvider has the same problem — it `await`s the full `execa()` result and yields once.

2. **The Copilot SDK `isAvailable()` check is insufficient.** The proposal checks `gh auth status` exits 0, but that only confirms the GitHub CLI is authenticated — it does NOT confirm that the user has a Copilot subscription or that the Copilot CLI is installed. My research noted that the SDK requires the Copilot CLI binary to be installed separately (`gh extension install github/gh-copilot` or standalone). The `isAvailable()` should also verify `which copilot` succeeds, or attempt a `CopilotClient` ping handshake. Otherwise, users with `gh` but no Copilot subscription will hit a confusing runtime error after being told "Copilot detected."

3. **Provider detection priority should swap Copilot and Anthropic API.** The current order is: Claude Code CLI > Gemini CLI > Copilot SDK > Anthropic API > OpenAI API > Ollama. Given that the Copilot SDK is in Technical Preview with undocumented ACP protocol and breaking-change history (which the proposal itself acknowledges in Open Question #3, recommending deferral to v0.3.0), it should rank BELOW the stable, well-documented Anthropic API. Proposed order: Claude Code CLI > Gemini CLI > Anthropic API > OpenAI API > Copilot SDK > Ollama. A user who has both `ANTHROPIC_API_KEY` and `gh auth login` should get the reliable path, not the experimental one.

4. **Missing: retry and timeout per provider.** The fallback chain (Section 1) describes retry logic for transient errors (429, 500, 503) with exponential backoff, but this is specified at the pipeline level, not the provider level. Each provider has different failure modes: Claude Code CLI can hang if the subprocess doesn't exit; the Copilot SDK can stall if the `session.idle` event never fires; Ollama can be extremely slow on underpowered hardware. Each provider should have a configurable timeout (default: 120s for CLI providers, 60s for API providers, 300s for Ollama), and the retry/fallback logic should be in the provider resolver, not the pipeline.

5. **Missing: model availability validation.** The `--model` flag accepts freeform strings like "opus", "sonnet", "gpt-4o". But not all models are available on all providers: you cannot use "opus" through the Copilot SDK (the model roster depends on the user's Copilot plan), and you cannot use "gpt-4o" through Claude Code CLI. The proposal should specify a model normalization/validation layer: either a mapping table (`{ opus: { 'claude-code': 'opus', 'anthropic-api': 'claude-opus-4-20250514' } }`) or provider-level validation that rejects unsupported model names with a clear error.

6. **The `--max-budget` flag is only implementable for some providers.** Claude Code CLI supports `--max-budget-usd` natively; Anthropic API can estimate cost from token counts; but Gemini CLI, Copilot SDK, and Ollama have no cost reporting. The proposal should clarify that `--max-budget` is a best-effort estimate for non-Claude providers, and that cost tracking in `.autospec-meta.json` will show "unknown" for providers that don't report token usage.

7. **Missing: concurrent spec generation option.** The proposal argues convincingly for sequential chained generation (quality, context, error recovery). But for users who prioritize speed over cross-spec coherence (e.g., regenerating all specs from scratch), a `--parallel` flag could generate specs 1-10 concurrently (each getting only SRS + metadata, no prior-spec summaries) and then generate the backlog sequentially from all 10. This is a low-effort addition that could cut generation time from ~3 minutes to ~30 seconds.

8. **The 300-line minimum validation threshold seems arbitrary and fragile.** Some specs (e.g., `07_marketing_lead.md` for a developer tool, or `08_finance_lead.md` for an open-source project) may legitimately be short. A fixed 300-line floor will cause false validation failures and forced re-generation. Consider either: (a) per-role minimum thresholds (lower for marketing/finance, higher for backend/DB), or (b) section-presence validation instead of line-count validation.

## OpenSpec-Specific Gaps

1. **The proposal does not address the "live skills" integration path with sufficient depth.** My research (Lesson 5) identified two distinct paths: (a) `autospec generate` for day-0 headless generation, and (b) `autospec skills --install` for day-1+ interactive iteration via AI assistant slash commands. The proposal mentions this in Open Question #7 but defers it entirely. This is a missed opportunity: OpenSpec's entire value is in the skills layer. At minimum, the proposal should specify the skills command interface, even if implementation is deferred:
   ```bash
   autospec skills --install          # Detect AI tools, generate slash commands
   autospec skills --install --tools claude,cursor  # Explicit tool selection
   ```
   And the generated skill files (e.g., `.claude/commands/autospec-update-spec.md`) should call `autospec generate --spec <name> --force` under the hood, creating a seamless bridge between the two paths.

2. **The proposal does not mention OpenSpec's dynamic instruction assembly pattern.** OpenSpec's CLI provides `openspec instructions <artifact> --json` — a runtime API that AI skills call to get context-aware prompts assembled from templates, project state, and configuration. AutoSpec should expose an equivalent `autospec instructions --spec 02_backend_lead --json` command that returns the compiled system prompt + user prompt for a given spec role. This enables three things: (a) AI skills can call it at runtime instead of hardcoding prompts, (b) users can inspect exactly what prompt will be sent before generation, (c) the `--dry-run` flag becomes trivially implementable by just printing this output.

3. **The VS Code extension question is unaddressed.** My research (Lesson 3) explicitly recommended that if AutoSpec builds a VS Code extension, it should use `vscode.chat.createChatParticipant()` to register a proper `@autospec` participant (not the weaker `sendPromptToChat()` approach that `openspec-for-copilot` uses). The proposal should take a position: is a VS Code extension on the roadmap, or is AutoSpec CLI-only? If CLI-only, the skills integration path (point 1 above) becomes even more important because it is the only way to integrate with VS Code-based workflows (via Copilot's `.github/prompts/` consumption).

4. **The proposal does not address OpenSpec's artifact isolation pattern.** OpenSpec isolates each feature's specs in `changes/<name>/` directories with delta-spec markers (ADDED/MODIFIED/REMOVED). When AutoSpec users update specs after initial generation, there is no mechanism to track what changed or why. The `.autospec-meta.json` file tracks generation metadata but not change history. Consider: should `autospec generate --force` archive the previous version before overwriting? Should there be a `specs/.history/` directory? This matters for the update workflow described in Open Question #4.

5. **The proposal's Copilot SDK implementation does not handle tool calls.** My research documented that the Copilot SDK supports bidirectional tool execution (`tool.call` events from CLI to SDK). If AutoSpec's prompts instruct the LLM to call tools (e.g., "read the existing codebase structure"), the CopilotSDKProvider needs to either register tool handlers or explicitly disable tool use in the session configuration. The current implementation ignores tool events entirely, which could cause the session to hang waiting for a tool response that never comes.

## Verdict

**Approve with changes.** The proposal is architecturally sound and ready for implementation after addressing the following must-fix items:

1. Fix the CopilotSDKProvider streaming implementation (currently batches all chunks, negating `AsyncIterable`)
2. Fix the Copilot `isAvailable()` to verify Copilot CLI installation, not just `gh auth`
3. Swap Copilot SDK and Anthropic API in the priority order (stable before experimental)
4. Add per-provider timeouts
5. Specify the `autospec skills --install` command interface, even if implementation is deferred to a later sprint
6. Add an `autospec instructions --spec <role> --json` inspection command

Nice-to-have items (can be deferred):
- Model normalization layer
- `--parallel` flag for concurrent generation
- Per-role validation thresholds instead of flat 300-line minimum
- Artifact history/archiving for spec updates
- VS Code extension position statement
