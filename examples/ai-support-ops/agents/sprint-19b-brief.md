# Sprint 19B Brief — Landing Page Redesign

**Agent:** Sonnet (general-purpose)
**Theme:** Rewrite hero, QuickStart, and Tools sections for template-first, @QUICKSTART.md workflow

## Context

The landing page currently shows `npx autospec init` as the hero terminal animation and promotes a CLI-first approach. The real workflow is:

1. User gets the template repo (or downloads QUICKSTART.md)
2. User adds requirements
3. User tells AI: "Run @QUICKSTART.md"
4. AI generates everything

The hero needs a conversation-style animation showing this flow, not CLI commands.

## Tickets

### 19.8 + 19.9 — Rewrite HeroSection.tsx

**File:** `/opt/FitnessAiManager/autospec/presentation/src/components/landing/HeroSection.tsx`

Replace the current terminal animation (3 scenes showing `npx autospec init`, `autospec build-team`, `autospec sprint 0`) with a **conversation-style** animation:

**New animation concept — AI chat conversation:**

```
User:  Run @QUICKSTART.md

AI:    Reading requirements/my-app.md...

       Generating 10 expert specifications...
         ✓ Product Manager    (Vision & Stories)
         ✓ Backend Lead       (API & Services)
         ✓ Frontend Lead      (Components & UX)
         ✓ Database Architect  (Schema & Migrations)
         ... +6 more experts

       Generating sprint backlog...
         ✓ 8 sprints | 47 tickets | 186 pts

       Ready. Run /sprint-run 0 to begin.
```

**Animation flow:**
1. Show "User:" label, then typewrite "Run @QUICKSTART.md"
2. Pause, then "AI:" label appears
3. Lines appear one by one with checkmarks
4. Loop back after a pause

**Install bar changes:**
- Replace `npx autospec init` with: `gh repo create my-project --template Hundia/autospec-starter`
- Keep copy button functionality

**CTA button changes:**
- Primary: "Get the Template" → links to `https://github.com/Hundia/autospec-starter` (or #quickstart)
- Secondary: "Star on GitHub" → stays same link

**Subtitle update:**
- Change to something like: "Your AI assistant generates 10 expert specifications, a sprint backlog, and living docs — from a single prompt."

**Keep:**
- The social proof stats at bottom (25+ Sprints, 263 Tickets, ~60% Cost Savings)
- The badge "Open Source Framework"
- The gradient background and overall layout
- framer-motion animations

**Design:**
- The right panel should still look like a terminal/chat window with macOS chrome
- Use a conversation bubble style: "User:" in one color, "AI:" in another
- Keep the dark terminal aesthetic (slate-950 background)

### 19.10 — Rewrite QuickStartSection.tsx

**File:** `/opt/FitnessAiManager/autospec/presentation/src/components/landing/QuickStartSection.tsx`

Replace the 3 current options (Prompt Method, CLI, Full Toolkit) with:

**Option 1: "GitHub Template" (Primary/Featured)**
- Icon: Github
- Color: blue (featured)
- Badge: "Recommended"
- Time: "30 seconds"
- Description: "Click 'Use this template' on GitHub. Skills pre-installed, zero dependencies."
- Code: `gh repo create my-project --template Hundia/autospec-starter --clone`
- Steps below code:
  1. Edit `requirements/project-brief.md`
  2. Tell your AI: "Run @QUICKSTART.md"

**Option 2: "Download QUICKSTART.md" (Secondary)**
- Icon: Download (from lucide)
- Color: green
- Time: "1 minute"
- Description: "For existing projects. Download the generation prompt and add to your repo."
- Code: `curl -O https://raw.githubusercontent.com/Hundia/autospec/main/QUICKSTART.md`
- Steps:
  1. Place your requirements in `requirements/`
  2. Tell your AI: "Run @QUICKSTART.md"

**Option 3: "CLI Tools" (Optional)**
- Icon: Terminal
- Color: purple
- Time: "2 minutes"
- Description: "Status dashboard, viewer generator, and sprint tools. Optional companion to template."
- Code: `npm install -g autospec\nautospec status\nautospec viewer`

**Section header:**
- Badge: "Get Started"
- Title: "Start Building in 30 Seconds"
- Subtitle: "Three paths, one methodology. Pick what fits your workflow."

### 19.11 — Move QuickStartSection + add secondary CTA

**File:** `/opt/FitnessAiManager/autospec/presentation/src/pages/LandingPage.tsx`

Current order (relevant portion):
```
HeroSection
EvolutionSection
ContextPoisoningSection
BreakingPointSection
CostOfNoSpecsSection
ThreePillarsSection
RolesSection
SprintMemorySection
PipelineSection
OrchestratorSection
QASection
ViewerSection
FinOpsSection
StatsSection
CompetitiveSection
CaseStudiesSection
FutureVisionSection
QuickStartSection        ← currently position 18
ToolsSection
DocumentationSection
Footer
```

**Move QuickStartSection to position 6** (after CostOfNoSpecsSection, before ThreePillarsSection):

```
HeroSection
EvolutionSection
ContextPoisoningSection
BreakingPointSection
CostOfNoSpecsSection
QuickStartSection        ← NEW POSITION (after problem narrative, before solution details)
ThreePillarsSection
RolesSection
SprintMemorySection
PipelineSection
OrchestratorSection
QASection
ViewerSection
FinOpsSection
StatsSection
CompetitiveSection
CaseStudiesSection
FutureVisionSection
ToolsSection
DocumentationSection
Footer
```

Also add a **secondary CTA section** before Footer — a simple full-width banner:
```tsx
{/* Secondary CTA */}
<section className="py-16 px-4 text-center">
  <h2 className="text-2xl font-bold text-white mb-4">Ready to make AI think before it codes?</h2>
  <div className="flex justify-center gap-4">
    <a href="#quickstart" className="...primary button...">Get the Template</a>
    <a href="https://github.com/Hundia/autospec" className="...secondary button...">Star on GitHub</a>
  </div>
</section>
```

### 19.12 — Update ToolsSection.tsx

**File:** `/opt/FitnessAiManager/autospec/presentation/src/components/landing/ToolsSection.tsx`

Update the "How It Works" box in the IDEs panel to reflect the @QUICKSTART.md flow:

1. "Add requirements to `requirements/` folder"
2. "Tell your AI: Run @QUICKSTART.md"
3. "AI generates specs, backlog, docs, prompts"
4. "Run `/sprint-run 0` to begin building"

Also update the AI Assistants list:
- Windsurf: change from "Coming soon" to "full" support
- Keep others as-is

## Files to Modify

| Action | Path |
|--------|------|
| REWRITE | `presentation/src/components/landing/HeroSection.tsx` |
| REWRITE | `presentation/src/components/landing/QuickStartSection.tsx` |
| MODIFY | `presentation/src/pages/LandingPage.tsx` |
| MODIFY | `presentation/src/components/landing/ToolsSection.tsx` |

## Important

- All files are in `/opt/FitnessAiManager/autospec/presentation/`
- Use existing imports (framer-motion, lucide-react) — check what's already imported
- Keep the dark theme (slate-950 bg, white text, blue/purple/green accents)
- The terminal animation must loop smoothly
- Mark tickets 19.8-19.12 as ✅ in `specs/backlog.md` when done
- Do NOT modify files outside of `presentation/` and `specs/backlog.md`
