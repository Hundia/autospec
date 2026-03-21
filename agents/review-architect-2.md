# Senior Architect Review — Architect 2 (DX)
**Date:** 2026-03-21

## Overall Assessment
**Ship with changes** — The proposal is architecturally sound and the research-informed decisions are strong. However, there are several DX gaps that will cause user drop-off between "npm install" and "first successful run." The bones are excellent; the skin needs work.

## DX Score Card
| Aspect | Rating (1-5) | Notes |
|--------|-------------|-------|
| First-run magic | 3 | Provider auto-detect is great, but the `--srs` flag adds friction. A positional arg would feel more natural. |
| Error recovery | 4 | Provider error parsing is well-specified. Missing: what happens when the SRS file has zero actionable content? |
| Progressive disclosure | 4 | Good layering: `generate` for beginners, `--parallel`/`--fallback`/`--provider` for power users. `--interview` is a nice on-ramp. |
| Command naming | 2 | `generate --srs` is awkward. See detailed notes below. |
| Output/progress UX | 4 | The streaming progress bars and cost tracker are good. Missing: terminal width handling, final summary. |
| Competitive DX | 3 | Better than GSD/OpenSpec on the "bring your own SRS" angle, but `npx create-next-app` still wins on pure friction. |

## Must-Fix Before Sprint Planning

### 1. Make the SRS path a positional argument, not a flag

Current:
```bash
autospec generate --srs requirements.md
```

Should be:
```bash
autospec generate requirements.md
```

Every major CLI tool uses positional args for the primary input: `gcc main.c`, `cat README.md`, `prettier src/`, `tsc tsconfig.json`. The `--srs` flag adds cognitive load and typing for zero disambiguation benefit — there is no other positional arg competing for that slot. Keep `--srs` as an alias for discoverability in `--help`, but the positional form should be the documented happy path.

This also makes stdin piping cleaner:
```bash
cat requirements.md | autospec generate -
```
versus the current:
```bash
cat requirements.md | autospec generate --srs -
```

### 2. Add a completion summary with next-steps guidance

The progress UX shows streaming progress, but the proposal never specifies what the user sees when generation **finishes**. After 2 minutes of watching progress bars, the user needs a dopamine hit and clear next steps.

Proposed completion output:
```
  autospec generate -- Complete!

  Generated 11 files in specs/
    01_product_manager.md    412 lines
    02_backend_lead.md       387 lines
    ...
    backlog.md               156 lines

  Cost: $0.41 | Time: 1m 47s | Provider: Claude Code (sonnet)

  Next steps:
    1. Review specs:    ls specs/
    2. Check backlog:   autospec status
    3. Start Sprint 0:  autospec sprint 0
```

Without this, the user stares at a cursor and wonders "did it work? what now?"

### 3. Handle the "empty or garbage SRS" case explicitly

The proposal says SRS > 5,000 words triggers a warning, but never addresses the lower bound. What happens when:
- The file is empty (0 bytes)
- The file has 2 sentences ("Build me an app. It should be good.")
- The file is binary (user passed a .docx or .pdf by mistake)

Proposed behavior:
```
  Error: requirements.md appears to be empty (0 words).

  AutoSpec needs a requirements document to generate specs.
  Try: autospec generate --interview    (guided 10-question interview)
  Or:  See examples at https://github.com/Hundia/autospec/tree/main/examples
```

For binary files:
```
  Error: requirements.md appears to be a binary file (detected: application/pdf).

  AutoSpec accepts Markdown, plain text, or YAML files.
  Convert your PDF to text first, or use --interview mode.
```

Minimum viable SRS threshold: warn (not block) below 50 words. The LLM can still produce something from a short brief, so blocking would be overly paternalistic — but a warning sets expectations.

### 4. The `--max-budget` default of $5.00 is a footgun for Opus users

The cost table shows Opus runs cost ~$4.10. A user who passes `--model opus` will hit the $5.00 budget cap mid-run and get a confusing halt. Either:
- Raise the default to $10.00 (safe for any single model), or
- Make the pre-generation confirmation show "this run will cost ~$4.10, which is 82% of your $5.00 budget cap" so users can adjust before starting, or
- Remove the default entirely and only enforce when explicitly set

I recommend option 2: keep the safety net but make the potential conflict visible in the confirmation prompt.

### 5. `autospec providers` should be `autospec doctor`

`providers` is a noun that sounds like a read-only list. But what users actually need at first-run-failure time is a diagnostic command. Call it `autospec doctor` (following `brew doctor`, `flutter doctor`, `npm doctor`):

```
  autospec doctor

  Environment:
    Node.js        v20.11.0   ok
    npm            v10.2.0    ok

  LLM Providers:
    + Claude Code   authenticated (user@example.com)
    + Anthropic API  ANTHROPIC_API_KEY found
    - Gemini CLI     not installed
    - OpenAI API     OPENAI_API_KEY not set
    - Ollama         not running (connection refused on :11434)

  Ready to generate specs. Run: autospec generate <file>
```

This gives users a single command to paste into bug reports and saves you from answering "why doesn't it work" issues.

## Should-Fix (Non-blocking)

### 6. Add `--quiet` / `-q` for CI/CD pipelines

The proposal specifies `--verbose` but not the opposite. In CI, users want minimal output — just the file list and exit code. A `--quiet` flag (or `CI=true` env var detection) should suppress the progress bars, provider detection banner, and confirmation prompt (implies `--yes`).

### 7. The interview mode should save progress

If a user answers 8 of 10 questions and their terminal crashes, they lose everything. The intermediate SRS (`specs/.interview-srs.md`) should be written incrementally after each answer, and `--interview` should detect an existing partial file and offer to resume.

### 8. Consider `autospec generate --from-interview` instead of `--interview`

The `--interview` flag is modal — it changes the entire input mechanism. Modal flags are harder to discover than subcommands. Two alternatives:

Option A (preferred): `autospec interview` as a separate command that outputs an SRS, then tells the user to run `autospec generate <output>`. This is more Unix-y (each command does one thing) and lets users edit the intermediate SRS before generation.

Option B: Keep `--interview` but make it a two-phase command with a pause: "Interview complete. Generated specs/.interview-srs.md. Review and edit, then press Enter to continue (or Ctrl-C to generate later with `autospec generate specs/.interview-srs.md`)."

### 9. Add timing estimates per-spec in progress output

The progress UX shows `streaming...` but not how long each spec typically takes. After the first spec completes, you have real timing data — use it to project remaining time:

```
  [3/11] 03_frontend_lead.md    ============-------- 62%   ~8s remaining
  ETA: 1m 23s remaining (based on avg 11.2s/spec)
```

### 10. Stdin pipe should auto-imply `--yes`

If someone runs `cat reqs.md | autospec generate -`, they cannot interact with a confirmation prompt. Stdin pipe should auto-detect (check `process.stdin.isTTY`) and skip the confirmation, or at minimum not hang waiting for input on a pipe that has already closed.

### 11. The `.autospec-meta.json` filename starts with a dot but is not gitignored by default

The proposal says "users can `.gitignore` this file" but most users will not think to do so. Either:
- Name it without the dot (`autospec-meta.json`) and let users decide, or
- Add it to `.gitignore` during `autospec init`, or
- Generate a `.gitignore` entry when writing the file (append if `.gitignore` exists)

### 12. Exit codes need expansion for CI

The current README lists codes 0-3. The proposal adds many new failure modes. Proposed:

| Code | Description |
|------|-------------|
| 0 | Success |
| 1 | General error |
| 2 | Configuration / invalid arguments |
| 3 | File not found (SRS missing) |
| 4 | No LLM provider available |
| 5 | Authentication failure |
| 6 | Budget exceeded (partial generation) |
| 7 | Provider timeout / network error |

CI pipelines need distinct exit codes to decide whether to retry (7) vs. alert (5) vs. fix config (4).

## The "README Test"

If I land on the npm page with 5 minutes and zero context, this is the Quick Start I need to see:

```markdown
## Quick Start

# Generate 10 expert specs from your requirements doc:
npx autospec generate requirements.md

# No requirements doc? Answer 10 questions instead:
npx autospec generate --interview

# That's it. AutoSpec auto-detects your LLM provider:
#   Claude Code, Gemini CLI, Anthropic API, OpenAI API, or Ollama.
#   No API key needed if you already use Claude Code or Gemini CLI.

# Check what was generated:
npx autospec status

# Start building:
npx autospec sprint 0
```

The current proposal supports this flow if the positional arg change (Must-Fix #1) is adopted. Without it, the first line becomes `npx autospec generate --srs requirements.md` which is 40 characters of command for what should feel like 20.

Note: the Quick Start should be 5 lines of commands, not 5 lines of explanation. Users read code, not prose, when they are scanning a README.

## Onboarding Funnel Analysis

```
npm page              100%   "One SRS in, ten expert specs out" — strong hook
  |
npm install            95%   Standard install, no friction
  |
First command          80%   --srs flag adds 5% friction vs positional arg
  |                          Users without an SRS file hit a wall (--interview helps but isn't discoverable)
Provider detection     70%   Users without Claude Code/Gemini CLI need API keys
  |                          Error message is good but requires leaving terminal to get a key
Confirmation prompt    65%   "$0.41 estimated" — some users will hesitate on cost
  |                          Ollama users see "$0 (local)" which is great
Wait 2 minutes         55%   Long wait with no prior CLI experience = anxiety
  |                          Progress bars help but "streaming..." is vague
Success                50%   No completion summary means users don't know what to do next
  |
Second command         40%   `autospec status` works, but gap between specs and actual code is unclear
```

**Biggest drop-off points:**
1. **No SRS file available** (80% -> 60%): The `--interview` flag needs to be promoted more prominently. Consider: if no argument is given, prompt "Do you have a requirements document? [y/n]" and route accordingly.
2. **Provider detection failure** (70%): The error message is good but could include a one-liner install: `npm i -g @anthropic-ai/claude-code && claude auth login`
3. **Post-generation confusion** (50% -> 40%): The completion summary with next-steps (Must-Fix #2) would recover most of these users.

## Additional Observations

**The resume mechanism is a genuine differentiator.** No competitor has this. Make it loud — when resume kicks in, celebrate it:
```
  Resuming previous run (4/11 specs already up-to-date)
  Skipping 4 specs, generating 7. Est. cost: ~$0.26 (saved ~$0.15)
```

**The pre-flight confirmation prompt is well-designed** but should show the model name explicitly, not just "sonnet." New users won't know what "sonnet" maps to in terms of quality/cost. Show: `Claude Sonnet 4 (claude-sonnet-4-20250514)`.

**Handlebars templates for system prompts is the right call.** This enables `autospec instructions` in v0.3.0 cleanly and makes prompt debugging easy. Ship it.

**The `--parallel` flag for specs 07-09 is a nice touch** but should be measured before being promoted. If it saves 15 seconds on a 2-minute run, it is not worth the extra flag in docs. If it saves 40+ seconds, promote it.

## Verdict

**Ship with changes.** The architecture is strong — provider strategy pattern, resume via frontmatter hashing, deterministic summary extraction, and the chained pipeline are all well-designed. The five must-fix items are all DX polish, not architectural rework:

1. Positional arg for SRS path (trivial Commander.js change)
2. Completion summary with next steps (30 minutes of work)
3. Empty/binary SRS detection (30 minutes of work)
4. Budget cap visibility in confirmation prompt (15 minutes of work)
5. Rename `providers` to `doctor` with richer output (1-2 hours of work)

None of these change the proposal's architecture or scope. They change how the tool *feels* in the first 5 minutes — which is where open-source CLIs live or die.

The research foundation is solid, the competitive positioning is clear ("one SRS in, ten expert specs out"), and the version roadmap is disciplined about scope. With the DX fixes above, this will be the most user-friendly spec generation tool on npm.
