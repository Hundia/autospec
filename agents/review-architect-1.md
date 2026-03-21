# Senior Architect Review -- Architect 1 (Systems)
**Date:** 2026-03-21

## Overall Assessment
**Ship with changes.** This is a well-researched, pragmatically scoped proposal. The v1-to-v2 refinement process clearly worked -- the 18 changelog items show real reviewer input that improved the design. The provider abstraction is sound, the pipeline is reasonable, and the deferral decisions are correct. There are a few structural issues that will save significant pain if addressed before sprint planning.

## Architecture Score Card

| Aspect | Rating (1-5) | Notes |
|--------|-------------|-------|
| Provider abstraction | 4 | Strategy pattern is right. Minor interface issue (see below). |
| Pipeline design | 4 | Chained sequential with summaries is correct. Resume mechanism is well-designed. |
| Error handling | 3 | Retry logic is good on paper. Missing signal handling and partial-write protection. |
| CLI UX | 5 | Command naming, progress UX, dry-run, confirmation prompt -- all excellent. |
| MVP scope | 3 | Five providers in v0.2.0 is ambitious. Consider shipping 3, adding 2 in a fast-follow. |
| Ship readiness | 3 | Build config needs work. ESM + dynamic imports + optional peer deps is a minefield. |

## Must-Fix Before Sprint Planning

### 1. Cut Ollama and OpenAI from v0.2.0 MVP

Five providers is three too many for a first release. Each provider is ~200-300 lines of implementation plus edge-case testing. The proposal already deferred Copilot; apply the same discipline here.

**Ship v0.2.0 with 3 providers:**
- Claude Code CLI (subprocess) -- primary, zero-config
- Gemini CLI (subprocess) -- secondary, zero-config
- Anthropic API (direct SDK) -- fallback for users without CLI tools

**Move to v0.2.1 (fast-follow, 1 sprint):**
- OpenAI API
- Ollama

Rationale: Claude Code and Gemini CLI share 90% of their subprocess logic. Anthropic API is one SDK. That's a testable, shippable surface. Ollama has unique timeout/quality concerns that will eat a sprint on their own. OpenAI is straightforward but adds no strategic value over Anthropic API for the MVP.

### 2. Protect against partial file writes

The proposal says "Write to disk immediately" after each spec generation. If the process is killed mid-write (Ctrl+C, OOM, power loss), you get a corrupt spec file that the resume mechanism will skip (frontmatter present, hash matches) but contains truncated content.

**Fix:** Write to a `.tmp` file, then atomic rename:

```typescript
const tmpPath = specPath + '.autospec-tmp';
await writeFile(tmpPath, content);
await rename(tmpPath, specPath);  // atomic on same filesystem
```

Clean up any `.autospec-tmp` files on startup. This is 10 lines of code and prevents the most common data-loss scenario.

### 3. Handle SIGINT/SIGTERM gracefully

Users will Ctrl+C during generation. Without a signal handler, you get orphaned subprocesses (Claude Code, Gemini CLI still running), temp files left on disk, and no indication of where to resume.

**Fix:** Register handlers that:
1. Kill any running child process
2. Clean up temp directories
3. Print "Generation interrupted. Run `autospec generate --srs <file>` to resume from spec N."
4. Exit cleanly

### 4. `execa` v9 is ESM-only -- verify build compatibility

The current CLI uses `tsup` with ESM output. `execa` v9 is ESM-only. `chalk` v5 is ESM-only. `ora` v8 is ESM-only. This is fine as long as the entire dependency tree is ESM, but `handlebars` is CJS-only. `fs-extra` is CJS-only.

**Verify before sprint planning:**
```bash
cd cli && npm install execa@9 zod dotenv && npm run build
```

If `tsup` cannot bundle the CJS/ESM mix, you have two options:
- Pin `execa` to v8 (last CJS-compatible version) -- easiest
- Move `handlebars` and `fs-extra` to dynamic `import()` calls -- more work

This is a blocker. A build that doesn't compile is not shippable.

## Should-Fix (Non-blocking)

### 5. `generateJSON?<T>()` optional method is a design smell

The optional `generateJSON?<T>()` on the provider interface means every call site must check `if (provider.generateJSON)` and have a fallback path. For the metadata extraction step (Step 1), you need structured output from every provider.

**Better approach:** Move JSON extraction to the pipeline layer. Have all providers implement only `generate()` (text output). The pipeline wraps the text response in a `parseMetadataFromText()` function that extracts JSON from markdown code blocks or raw text. This is more reliable than trusting every provider's structured output mode.

For providers that support native JSON mode (Anthropic API with tool-use, Claude Code with `--json-schema`), add it as an optimization in the provider implementation's `generate()` method -- append "respond in JSON" to the prompt and parse the output.

### 6. `summarizeSpec()` entity extraction is fragile

The regex-based persona extraction (`/(?:persona|user|role|actor|stakeholder)[:\s]+["']?([A-Z][a-z]+)/gi`) will miss most real-world patterns:
- "**Admin** - manages the system" -- caught
- "The admin user can..." -- missed
- Personas defined in tables -- missed
- Non-English project names -- missed entirely

For v0.2.0, **simplify to headers + first sentence of each section + any tables**. That covers 80% of cross-spec coherence needs without brittle regexes. Entity extraction can be a v0.3.0 enhancement when you have real generated specs to test against.

### 7. `--max-budget` should default to unlimited, not $5.00

A $5 default budget cap will surprise users running with Opus ($4.10 estimated full run). User runs `autospec generate --srs my-big-project.md`, it stops at spec 9/11 with "budget exceeded", and they have to figure out the `--max-budget` flag.

**Better:** Default to no cap. Display the cost estimate in the confirmation prompt (which you already do). Users who want a cap set it explicitly. The confirmation prompt is the cost control, not a hidden default.

### 8. Cost estimation is unreliable -- present it that way

The proposal shows exact cost estimates ("~$0.41 for Sonnet"). In practice, token counts vary 2-3x based on SRS complexity and LLM verbosity. A 2,847-word SRS about a CRUD app produces very different specs than one about a distributed trading system.

**Fix:** Show ranges, not point estimates: "Est. cost: $0.20-$0.80 (Sonnet)". Add a footnote: "Actual cost depends on response length. Use --max-budget to set a hard cap."

### 9. The `--parallel` flag adds complexity for marginal gain

Running specs 07-09 in parallel saves ~20-30 seconds on a 100-120 second run. But it introduces:
- Concurrent subprocess management
- Race conditions on cost tracking
- More complex error handling (one fails, others succeed)
- Harder debugging

**Recommendation:** Defer `--parallel` to v0.2.1. Ship sequential-only in MVP. Nobody's first complaint about a 2-minute CLI run is "it should be 90 seconds."

### 10. Peer dependency for `@anthropic-ai/sdk` will confuse users

Optional peer dependencies are an npm footgun. When a user runs `npm install -g autospec` and later does `autospec generate` with auto-detected Anthropic API, they'll get a runtime import error because the peer dep wasn't installed.

**Better:** Make it a regular (bundled) dependency but dynamically import it. Only load `@anthropic-ai/sdk` when the Anthropic API provider is selected. The package size increase is minimal (~200KB), and it eliminates a class of "works on my machine" issues.

Alternatively, if you want to keep the install lean, use raw `fetch()` against the Anthropic API instead of the SDK. The Anthropic API is simple enough that a ~50-line wrapper replaces the entire SDK for your use case (single completion call with streaming).

## Nice-to-Have

### 11. Add `autospec doctor` command

A single command that checks system readiness:
```
$ autospec doctor
  Claude Code CLI:    v1.2.3 (authenticated)
  Gemini CLI:         not installed
  ANTHROPIC_API_KEY:  set (sk-ant-...xxxx)
  Node.js:            v20.11.0 (>=18.0.0 OK)
  Disk space:         OK
```

This replaces the implicit first-run detection UX with something users can invoke proactively. Useful for support/debugging.

### 12. Consider `--format` flag for output

The YAML frontmatter in generated specs is good for machines but visually noisy for humans reading the markdown. Consider `--format plain` that omits frontmatter (disables resume, but some users won't care).

### 13. Test with a real SRS before v0.2.0 ships

The proposal is detailed about the pipeline but has no sample SRS or sample output. Before sprint planning, run the pipeline manually (copy-paste prompts into Claude) with a real requirements document and verify:
- Output quality meets the validation thresholds
- Summaries are useful for cross-spec coherence
- The 11-call chain actually produces coherent specs
- Cost estimates are in the right ballpark

This takes 30 minutes and will surface design issues that no amount of architecture review can find.

### 14. `.autospecrc.json` vs `.autospec-meta.json` -- consolidate naming

The existing CLI uses `.autospecrc.json` for configuration. The proposal adds `.autospec-meta.json` for generation metadata. These serve different purposes, but having two dotfiles with similar names will confuse users. Consider:
- `.autospecrc.json` -- user configuration (keep)
- `specs/.meta.json` -- generation metadata (move inside specs/, out of project root)

## Verdict

This proposal is solid engineering. The research was thorough, the reviewer feedback was well-incorporated, and the deferral decisions show discipline. The core architecture (strategy pattern, chained pipeline, hash-based resume) is sound and won't need to be rewritten.

**For sprint planning, I recommend:**

1. **Sprint 8:** Provider interface + Claude Code provider + Anthropic API provider + pipeline scaffolding (Steps 1-14 skeleton). Get one end-to-end run working with Claude Code.
2. **Sprint 9:** Gemini CLI provider + interview mode + validation + resume + all CLI flags + error handling polish. Ship v0.2.0.
3. **Sprint 10 (fast-follow):** OpenAI + Ollama providers, `--parallel`, and any issues surfaced by real users.

The four must-fix items (cut providers, atomic writes, signal handling, verify ESM build) are small in code but large in impact. Address them in sprint planning, not mid-implementation.

Ship it.
