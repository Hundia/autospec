# sdlc_sdd.md — Build Prompt: "The Agentic SDLC × Spec-Driven Development" Presentation

> **Give this file to Claude Code in the AutoSpec repo.**
> It specifies a NEW GitHub Pages presentation that clones the structure, visual language,
> and interaction patterns of the existing AutoSpec presentation
> (`https://hundia.github.io/autospec/#/presentation`) and replaces the AutoSpec-solution
> act with the **Enterprise Agentic SDLC methodology** (Bolts, Harness, Constitution,
> 6 Stages, role transformations) implemented through **Spec-Driven Development**,
> with special emphasis on the **Summarization** concept from slide 16 of the original deck.

---

## 1. Goal

Create a standalone presentation web app at **`sdlc-presentation/`**, deployed to GitHub Pages at:

```
https://hundia.github.io/autospec/sdlc/#/presentation
```

It must look and feel like the original AutoSpec presentation (same shell, same slide
transition system, same dark slate aesthetic, same EN/HE language toggle, same keyboard
navigation) — but tell a different second half of the story:

- **Acts 1–2 (intro)** — identical in spirit to the AutoSpec deck: the three eras,
  context poisoning, the reverse-engineering tax, the breaking point, cost of no specs.
- **Acts 3–5 (replaced)** — instead of "AutoSpec the toolkit", present the
  **Enterprise Agentic SDLC methodology**: core philosophy, the 6 stages, harness
  engineering, role transformations, SDD as the implementation layer, tooling, adoption.
- **Summarization emphasis** — the scrollable pipeline slide (slide 16 in the original)
  pattern is reused for dense slides, and the Bolt/Sprint **summary as AI memory** gets
  both a hero pipeline step AND a dedicated slide.

## 2. Hard Constraints

1. **DO NOT modify the original `presentation/` app** (no file inside `presentation/`
   changes). The only shared change is `.github/workflows/pages.yml`, which gains build
   steps for the new sub-site — exactly like `lss-presentation/` did.
2. Follow the **`lss-presentation/` sub-site pattern**:
   - New top-level directory `sdlc-presentation/` (own `package.json`, vite, tailwind).
   - `vite.config.ts` → `base: '/autospec/sdlc/'`.
   - `pages.yml` builds it and copies `sdlc-presentation/dist/*` → `presentation/dist/sdlc/`.
3. Reuse the original presentation's components by **copying** them into the new app
   (sub-sites are independent builds — no cross-imports).
4. Keep the **EN + HE** dual-language slide data (`slides-en.ts`, `slides-he.ts`) and the
   RTL handling from `PresentationPage.tsx`.
5. Dense slides use the **`scrollable: true`** mechanism (slide-16 pattern):
   vertical scroll within the slide, `ScrollProgressBar`, space-bar not hijacked,
   "scroll down" affordance.

## 3. App Structure

```
sdlc-presentation/
  index.html                      # title: "The Agentic SDLC × SDD"
  package.json                    # name: "sdlc-presentation" (copy deps from presentation/)
  vite.config.ts                  # base: '/autospec/sdlc/'
  tailwind.config.js, postcss.config.js, tsconfig.json   # copied
  src/
    main.tsx, index.css           # copied
    App.tsx                       # routes: "/" → LandingPage, "/presentation" → PresentationPage
    pages/
      LandingPage.tsx             # minimal hero: deck title, tagline, "Start Presentation"
                                  # button → #/presentation, link back to hundia.github.io/autospec
      PresentationPage.tsx        # copied shell from presentation/ (nav, dots, lang toggle,
                                  # scrollable handling) with the new slide registry
    components/
      backgrounds/BackgroundEffects.tsx        # copied
      ui/PresentationDropdown.tsx              # copied
      pipeline/PipelineSlide.tsx               # copied (generic scrollable steps)
      pipeline/PipelineStep.tsx                # copied
      pipeline/ScrollProgressBar.tsx           # copied
      pipeline/SprintSummaryVisualization.tsx  # copied (used by summary step)
      ... copy any other pipeline/* visualization the reused slides require
      # ── Reused slide components (copied verbatim from presentation/) ──
      TitleSlide, EraTraditionalSlide, EraAssistantSlide, EraAgenticSlide,
      ContextPoisoningSlide, ReverseTaxSlide, BreakingPointSlide,
      SDDCostOfChaosSlide, BridgeSlide, SDDThreePillarsSlide,
      SprintMemorySlide, OrchestratorSlide, ClosingSlide, FinalTaglineSlide
      # ── NEW slide components ──
      PhilosophySlide.tsx          # 5 philosophy cards + quote banner
      NotVibeCodingSlide.tsx       # vibe coding vs governed system
      SixStagesSlide.tsx           # SCROLLABLE — 6 stage sections (slide-16 pattern)
      HarnessSlide.tsx             # harness engineering loop
      SdlcRolesSlide.tsx           # role transformation cards + core-shift checklist
      ToolingSlide.tsx             # 4 tool cards with terminal demos
      AdoptionSlide.tsx            # SCROLLABLE — 3 phases + ROI metrics
    data/
      slides-en.ts                 # full deck below
      slides-he.ts                 # faithful Hebrew translation, same structure
```

Style rules for new components: same design language as the originals — slate-900
gradient background, `framer-motion` staggered entry, rounded-2xl cards with
`bg-white/5 border border-white/10`, accent colors per card (teal/blue/violet/amber/rose),
`lucide-react` icons where useful. Look at `SDDThreePillarsSlide.tsx`,
`PipelineSlide.tsx`, and `SolutionSlide.tsx` for reference idioms.

## 4. The Deck — Slide by Slide (22 slides)

### ACT 1 — THE PROBLEM (reused intro, slides 1–7)

**Slide 1 — `title`** (reuse `TitleSlide`)
- Title: **"The Agentic SDLC"**
- Subtitle: "Spec-Driven Development at Enterprise Scale"
- Tagline: *"Agents execute. Humans govern."*
- Presenter: Eli Hundia

**Slide 2 — `eraTraditional`** (reuse, content identical to original deck)
The Traditional Era — manual coding, code reviews, documentation, institutional memory.

**Slide 3 — `eraAssistant`** (reuse, identical)
The Code Assistant Era — Copilot/TabNine/Kite; typing speed up, decisions still human.

**Slide 4 — `eraAgentic`** (reuse, identical)
The Agentic Era — Claude Code/Cursor/Devin; full features, cross-stack, autonomous —
but no memory, context drift, zero documentation.

**Slide 5 — `contextPoisoning`** (reuse, identical)
Turn 1 clean → Turn 25 drift → Turn 50 contradiction → Turn 100 chaos, with the chat mockup.

**Slide 6 — `reverseTax`** (reuse, identical)
Day 1 vs Day 60; 40 hours/quarter lost to reverse engineering.

**Slide 7 — `breakingPoint`** (reuse, content tweak)
Same stats (73% abandoned, 40hrs, $0 chat-log value).
Bottom line becomes: **"Agentic development without governance is technical debt at AI speed."**

### ACT 2 — TURNING POINT (slides 8–9)

**Slide 8 — `sddCostOfChaos`** (reuse, identical)
With Conversation vs With Specifications. Callout: "Specifications are the memory that
AI was never given."

**Slide 9 — `bridge`** (reuse, new copy)
- Question: **"What if the SDLC itself was rebuilt for agents?"**
- Points:
  - "What if no agent could write code before a human approved the spec?"
  - "What if every agent error became a permanent guardrail?"
  - "What if speed was the output of structure — not shortcuts?"

### ACT 3 — THE AGENTIC SDLC METHODOLOGY (slides 10–14, NEW)

**Slide 10 — `philosophy`** (NEW `PhilosophySlide`)
Title: "Core Philosophy" · Subtitle: "Five ideas that change everything"
Five cards (grid, accent-colored top borders):
1. 🎯 **Bolts, Not Sprints** — feature cycles measured in hours/days, not weeks.
   Agents execute; humans govern. Speed is the output of structure.
2. 👁 **Humans as Orchestrators** — engineers move from Executors (writing code) to
   Orchestrators (designing specs, reviewing agent output, maintaining the harness).
3. ✍️ **Governors & Reviewers** — without strong governance, HITL becomes rubber-stamping.
   Agentic execution + structured specs + enforced governance.
4. 🛡 **The Harness is the Guardrail** — tests, linters, types, constraints agents cannot
   violate. Every agent error is encoded as a permanent test case.
5. 📄 **The Spec is the Truth** — no code before the spec is approved; spec is
   version-controlled and updated before code changes. Kills spec rot.
Quote banner (full-width, orange-accent blockquote):
**"The Spec is the Truth, the Harness is the Guardrail, and the Human is the Judge."**

**Slide 11 — `notVibeCoding`** (NEW `NotVibeCodingSlide`)
Title: "This Is Not Vibe Coding" · Subtitle: "Governance is the difference"
Two columns:
- Left (red accent) **Vibe Coding**: solo dev prompting to a prototype · no audit trail ·
  decisions evaporate with the chat · quality = luck.
- Right (green accent) **Governed Agentic SDLC**: specs, harnesses, audit trails ·
  human checkpoints at every gate · every output traceable · every agent error becomes
  a permanent test case.
Callout: **"The difference is accountability."**

**Slide 12 — `sixStages`** (NEW `SixStagesSlide`, **`scrollable: true`** — slide-16 pattern)
Title: "The 6 Stages of the Agentic SDLC" · Subtitle: "Scroll down — every stage is a gate"
Each stage renders as a full-width scroll section (like `PipelineStep`): big stage number,
emoji, name, methodology tag, owner chips, 4–5 bullets, output artifact. Hero styling on
stages 1 and 4. Content:

1. 🔍 **Intent & Discovery** — *Specify & Clarify* — Owner: Product Owner — **[HERO]**
   - High-fidelity `spec.md` defines *the problem only* — not implementation.
   - GenAI turns unstructured inputs (conversations, Jira tickets) into clear requirements.
   - Anti-spec-rot: `spec.md` is version-controlled, updated *before* code changes.
   - No agent may begin implementation until the PO formally approves the spec.
   - Output: `spec.md` — the single source of truth.
2. ⚖️ **Alignment & Constraints** — *The Constitution* — Owners: Architect + PO
   - The project's laws: tech stack, security protocols, architecture standards.
   - These constraints form the base of the Harness — agents cannot suggest
     out-of-spec architectures.
   - Includes SSDLC requirements and guardrails as hard-coded bounds.
   - Most expensive decisions to change later — invest upfront.
   - Output: `constitution.md` / constraint set injected into every agent.
3. 🗺️ **Design & Planning** — *Plan & Tasks* — Owners: Architect + Team Lead
   - Agents produce `plan.md` (technical strategy) and `tasks.md` (granular, testable units).
   - Senior engineers **interrogate** the plan — not write it — focusing on legacy
     constraints, security, blast radius.
   - Team Lead approves the implementation map before any code.
   - Each task independently testable — this is what makes Bolts possible.
   - Output: `plan.md` + `tasks.md`.
4. ⚡ **Execution & Verification** — *Implement (Bolts)* — Owner: Developer (HITL) — **[HERO]**
   - Agents implement tasks in small, testable units — hours, not weeks.
   - TDD-enforced: no implementation before a failing test exists.
   - Every agent error encoded as a permanent harness test — it cannot recur.
   - Developer = Quality Orchestrator: reviews agent PRs, edge cases, maintains harness.
   - Agents run in secure sandboxes (isolated containers / dynamic sessions).
   - Output: merged, verified code.
5. 🧪 **Testing & QA** — *Quality Bolts* — Owner: QA Developer (HITL)
   - Agents implement test cases aligned to the spec's acceptance criteria.
   - Test spec defines *the AC only* — not implementation details.
   - AI code review: 38.7% of AI review comments drive real fixes (Atlassian 2026).
   - QA Developer reviews agent test PRs and maintains the quality harness.
   - Output: E2E + regression suites bound to spec ACs.
6. 📡 **Continuous Steering** — *Observability Loop* — Owner: SRE / DevOps
   - Agents monitor real telemetry against the spec's intended behavior;
     drift triggers alerts or a self-correction Bolt.
   - SRE agents proactively open issues on anomalies; GenAI writes incident summaries.
   - CI/CD remains constant — DevOps discipline carries into the agentic world.
   - All agent communications logged for audit.
   - Output: a system that steers itself back to spec.

Closing card after stage 6 (like the pipeline callout):
**"Compress, don't skip. The linear SDLC is collapsing into a compressed
Design-&-Experiment loop — the discipline of each stage remains; only the clock changes."**

**Slide 13 — `harness`** (NEW `HarnessSlide`)
Title: "Harness Engineering" · Subtitle: "The mechanical guardrail agents cannot violate"
- Center visual: a loop diagram — `Agent acts → Harness checks → Error caught →
  Encoded as permanent test → Harness grows`.
- Four harness layers (cards): ✅ Tests (TDD-enforced) · 🔍 Linters & Static Analysis ·
  🔷 Type Systems (types constrain generation) · ⚖️ Constitution Constraints (stack,
  security, architecture bounds).
- Callout: **"Every agent error becomes a permanent test case. The harness only ever
  gets stronger."**

**Slide 14 — `sdlcRoles`** (NEW `SdlcRolesSlide`)
Title: "Roles Reinvented" · Subtitle: "Nobody is replaced. Everybody is promoted."
Six transformation cards (icon, old role → new role, one-liner, stage tag):
- 🎯 Product Owner → **Outcome Owner** — owns the "what"; approves `spec.md` (Stages 1, 6)
- 🏛️ Architect / Tech Lead → **Governance Owner** — defines the Harness; interrogates
  the plan (Stages 1–3)
- 🔬 Developer → **Dev Orchestrator** — reviews agent PRs, edge cases, writes the
  harness (Stages 4–5, final HITL)
- 🤖 AI Agents → **Autonomous Workforce** — drafts all artifacts; executes bounded tasks
  under guardrails (Stages 2–6)
- 🔭 SRE / DevOps → **Infrastructure Guardian** — guardian of self-healing infra and
  agent telemetry (Stage 6)
- 🎨 Designer → **Creative Director** — human taste, vibe, brand — what AI can't encode
  (Stages 1–5)
Bottom checklist ("The Core Shift"):
- ✓ Value shifts from writing code to **verifying and validating** agent output.
- ✓ The core skill becomes **intent** — define what software should do, verify it does.
- ⚠ HITL is a **mandatory checkpoint**, not a rubber stamp.

### ACT 4 — IMPLEMENTED WITH SPEC-DRIVEN DEVELOPMENT (slides 15–18)

**Slide 15 — `sddThreePillars`** (reuse component, remapped content)
Title: "SDD: The Operating System of the Agentic SDLC"
Subtitle: "The methodology runs on three artifacts"
- 01 📐 **Specs as Code** — `spec.md` + the Constitution live in git. Stage 1–2 output,
  readable by any agent, approved by humans. Artifact: `specs/*.md`
- 02 📋 **Bolt Summaries** — every Bolt closes with a summary: what was built, what
  changed, what was decided. The next agent — or the next Bolt — starts with full
  context. Artifact: `sprints/bolt-X/summary.md`
- 03 📖 **Living Documentation** — docs grow with every task; the Constitution and
  architecture docs constrain future agents. Artifact: `docs/` (grows every Bolt)

**Slide 16 — `pipeline`** (reuse `PipelineSlide`, **`scrollable: true`** — THE slide-16 clone)
Title: "The Agentic SDLC Pipeline" · Subtitle: "From intent to steering — scroll the whole loop"
Callout: *"The team that governs before coding ships faster than the team that codes
before thinking. The Bolt summary ensures no knowledge is ever lost."*
Ten steps (number / title / subtitle / time / output / hero / accent):
1. **Capture Intent** — GenAI distills conversations + tickets into a high-fidelity
   problem-only `spec.md`. — 1–2 hours — `spec.md` — blue
2. **Write the Constitution** — stack, security, architecture laws; injected into every
   agent as hard bounds. — 1 hour — `constitution.md` — violet
3. **Spec Approval Gate** — HITL: the Product Owner approves; agents are mechanically
   blocked until `spec.approved = true`. — 30 min — Approved spec — rose
4. **Plan & Tasks** — agents derive `plan.md` + `tasks.md`; seniors interrogate the plan.
   — 1 hour — `plan.md`, `tasks.md` — emerald
5. **Bolt Execution** — TDD-enforced agents implement independently-testable tasks in
   parallel worktrees. Hours, not weeks. — 2–6 hours — Working code — indigo — **HERO**
6. **Harness Verification** — tests, linters, types, AI code review; every failure
   becomes a permanent test. — continuous — Green harness — cyan
7. **QA Bolts** — QA agents build E2E suites from the spec's acceptance criteria.
   — 1–2 hours — Test suites — green
8. **Human Review** — the Outcome Owner validates on preprod; approve or request
   changes. Human judgment before production. — 1 hour — Approval — amber
9. **Summarization: Bolt Close** — generate the Bolt summary: release notes, linked
   docs, modified files, closing commit. **This is the magic — the next agent inherits
   everything.** — 5 min — `summary.md` — teal — **HERO**
10. **Continuous Steering** — observability agents compare telemetry to spec intent;
    drift opens a self-correction Bolt. — always on — Self-steering system — orange

**Slide 17 — `sprintMemorySlide`** (reuse, adapted copy — the Summarization deep-dive)
Title: "Summarization: The Memory Layer"
Subtitle: "The handoff document that never existed before"
Terminal mock: `> /bolt-close` → "Closing Bolt 11... Generating summary..." →
`✓ bolts/bolt-11/summary.md created`, with the four sections (Release Notes / Linked
Documentation / Files Modified / Closing Commit) as in the original slide.
Benefits (4 cards): ⚡ Instant Context (30 seconds) · 🔍 Bolt Comparison · 🚫 No Code
Reading (no reverse engineering) · 🤝 Perfect Handoff (any agent, any provider).
Callout: **"The summary is the memory that AI was never given."**

**Slide 18 — `orchestrator`** (reuse, identical structure, retitled)
Title: "Humans Orchestrate. Agents Execute."
Same provider tabs (Claude Code / Copilot / Gemini / Continue), orchestrator role
relabeled **"Governance Owner"**, tasks: "Writes Bolt briefs", "Spawns parallel agents",
"Sequences by dependency graph", "Reviews results & merges".
Callout: "Same specs. Same harness. Any model."

### ACT 5 — TOOLING & ADOPTION (slides 19–20)

**Slide 19 — `tooling`** (NEW `ToolingSlide`)
Title: "The Toolchain" · Subtitle: "Each tool enforces one discipline"
Four cards, each with a dark terminal demo block (monospace, colored lines):
1. ⚙️ **Spec-Kit** — the workflow backbone. Demo:
   `$ spec-kit gen spec --from PROJ-421` → `✓ spec.md created — awaiting PO approval` →
   `⛔ Coding blocked until: spec.approved = true`. Value tag: "Eliminates vibe coding —
   forces documented intent."
2. 🦸 **Superpowers** — the execution discipline. Demo:
   `$ superpowers bolt --task tasks.md#42` → `⛔ No implementation without failing test` →
   `✓ Test fails → OK to implement now`. Value tag: "Enforces harness engineering
   automatically."
3. 📋 **Jira as Context Hub** — Demo: `spec.md updated → agent sync` →
   `→ PROJ-421: Status → "In Planning"` → `✓ Non-technical stakeholders informed`.
   Value tag: "Enterprise visibility without manual overhead."
4. 📖 **Confluence as Long-Term Memory** — Demo: `agent context fetch --source confluence`
   → `→ Loading: arch-decisions.md, security-standards.md` →
   `✓ 14 constraints injected into harness`. Value tag: "Source of truth in repo,
   visibility in Confluence."

**Slide 20 — `adoption`** (NEW `AdoptionSlide`, **`scrollable: true`**)
Title: "Adoption Roadmap" · Subtitle: "Three phases — scroll through the rollout"
Three phase sections (scroll, slide-16 style) + metrics:
- **Phase 1 — Foundation** 🗓: sandboxes + telemetry + secure gateways; start on
  non-critical repetitive paths; build the Harness (tests/linters/types); pilot
  Spec-Kit on one team.
- **Phase 2 — Expand** 📈: AI code review for all teams (measure defect escape rates);
  Jira/Confluence as Context Hubs; observability agents in production;
  ⚠ train developers in prompting, AI monitoring, verification — the skill shift
  matters as much as the tooling shift.
- **Phase 3 — Optimize** 🚀: full Bolt cadence (hours for bounded tasks); measure ROI;
  continuously grow the Harness; "Pioneer" teams gain speed AND quality (PwC 2026).
- **ROI metrics grid** (4 metric boxes): 📝 Velocity (story points, Bolt cycle time) ·
  🛡 Quality (defect escape rate, MTTR, HITL approval rate) · 🚀 Speed (time-to-market,
  infra cost delta) · 👥 People (developer satisfaction, onboarding, spec approval
  cycle time).
- Closing quote: *"Value shifts from writing code to verifying and validating code.
  The core skill becomes less about syntax and more about intent."* — Amplify Partners

### ACT 6 — CLOSE (slides 21–22)

**Slide 21 — `closing`** (reuse, adapted)
Title: "Start Your First Bolt"
Steps:
- "Pick one bounded, non-critical feature" — your pilot
- "Write spec.md and get it approved" — the gate comes first
- "Let agents bolt it under the harness" — TDD-enforced, sandboxed
- "Close with /bolt-close" — the summary is the memory
Links: `github.com/Hundia/autospec` + "AutoSpec deck: hundia.github.io/autospec/#/presentation"
Tagline: "From intent to steering."

**Slide 22 — `finalTagline`** (reuse)
Title: "The Agentic SDLC"
Tagline: **"The Spec is the Truth. The Harness is the Guardrail. The Human is the Judge."**

## 5. Deployment

Append to `.github/workflows/pages.yml` (after the LSS block, before upload):

```yaml
# Build SDLC presentation (sub-site)
- run: npm ci
  working-directory: sdlc-presentation
- run: npm run build
  working-directory: sdlc-presentation

# Combine: copy SDLC into presentation/dist/sdlc/
- run: mkdir -p presentation/dist/sdlc && cp -r sdlc-presentation/dist/* presentation/dist/sdlc/
```

## 6. QA Checklist

- [ ] `cd sdlc-presentation && npm install && npm run build` succeeds.
- [ ] `presentation/` is untouched (`git status` shows no changes inside it) and still builds.
- [ ] 22 slides; slides 12, 16, 20 are `scrollable: true` with `ScrollProgressBar`.
- [ ] EN and HE decks have identical structure; HE renders RTL with reversed arrows.
- [ ] Keyboard: arrows navigate; space advances only on non-scrollable slides.
- [ ] Landing page "Start Presentation" → `#/presentation`; Home button works.
- [ ] Hash routing works under `/autospec/sdlc/` base.

## 7. Project Bookkeeping (AutoSpec SDD rules)

- Track as a sprint in `specs/backlog.md` (backlog-first).
- Brief in `agents/sprint-X-brief.md`; summary in `sprints/sprint-X/summary.md`.
- Living docs: `docs/sdlc-presentation/01_overview.md` (slide map, architecture,
  deploy path) + note the new sub-site in `docs/deployment/` if a Pages doc exists.
