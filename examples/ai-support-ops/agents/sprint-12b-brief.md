# Sprint 12B Brief: Landing Page Updates

**Agent:** Sonnet (Sprint Agent B)
**Tickets:** 12.16–12.19 (14 pts)
**Theme:** Update landing page with evolution narrative + before/after section

---

## Execution Order

1. **12.16** — Create `EvolutionSection.tsx` (new landing section)
2. **12.17** — Create `BeforeAfterSection.tsx` (new landing section)
3. **12.18** — Update `LandingPage.tsx` (wire new sections, remove old)
4. **12.19** — Enhance `SprintMemorySection.tsx` (add reverse-engineering tax messaging)

---

## Key Architecture

- Landing sections live in `presentation/src/components/landing/`
- Each section: standalone React component, uses framer-motion + lucide-react
- LandingPage at `presentation/src/pages/LandingPage.tsx` assembles sections
- Dark theme: `from-slate-950 via-slate-900 to-slate-950`

## Reference: Existing patterns

Follow the pattern from `OrchestratorSection.tsx` and `SprintMemorySection.tsx`:
- Section wrapper: `<section id="xxx" className="py-24 px-4 sm:px-6 lg:px-8">`
- Inner: `<div className="max-w-6xl mx-auto">`
- Header: badge pill + h2 + subtitle paragraph
- Content: cards/grids with motion animations
- Use `whileInView` for scroll-triggered animations

---

## Ticket Details

### 12.16: EvolutionSection.tsx

Create `presentation/src/components/landing/EvolutionSection.tsx`

Replaces `ProblemSolutionSection` on the landing page. Shows the 4-era evolution:

**Layout:** Horizontal timeline (desktop) / vertical (mobile) with 4 era cards:

1. **Traditional** (slate) — "Slow but predictable. Docs existed because humans wrote them."
2. **Code Assistant** (blue) — "AI helped type faster, not think better."
3. **Agentic** (cyan/amber) — "AI writes features. Revolutionary power, dangerous autonomy."
4. **SDD Resolution** (green) — "Structure + AI = reliable development partner."

Each card:
- Color-coded top border or left border
- Era name, tagline, 2-3 bullet points
- Cards connect via a timeline bar (gradient from slate → blue → cyan → green)

Bottom: transition callout — "The evolution demanded a new approach. AutoSpec is that approach."

Use these imports: `motion` from framer-motion, icons from lucide-react (Code2, Wand2, Bot, Shield or similar).

### 12.17: BeforeAfterSection.tsx

Create `presentation/src/components/landing/BeforeAfterSection.tsx`

Two-column comparison section for the landing page.

**Layout:**
- Section badge: "The Difference"
- H2: "Same Team. Same AI. Different Structure."
- Two columns: "Without SDD" (red-tinted) vs "With SDD" (green-tinted)
- 5-6 matched comparison rows:
  - Context: "Lost every session" vs "Preserved forever"
  - Documentation: "Chat logs only" vs "100+ living docs"
  - Onboarding: "Weeks of reverse engineering" vs "Read specs, start building"
  - AI Accuracy: "Degrades over conversation" vs "Consistent from spec"
  - Cost: "$47/sprint" vs "$19/sprint"
  - Handoff: "Impossible" vs "Anyone reads the specs"

Use XCircle (red) and CheckCircle2 (green) icons for each side header.

### 12.18: Update LandingPage.tsx

**Current** (`presentation/src/pages/LandingPage.tsx`):
```tsx
import ProblemSolutionSection from '../components/landing/ProblemSolutionSection';
// ... used in <main>
<ProblemSolutionSection />
```

**Changes:**
1. Remove `ProblemSolutionSection` import
2. Add `EvolutionSection` import
3. Add `BeforeAfterSection` import (place between StatsSection and QuickStartSection, or between CaseStudiesSection and QuickStartSection)
4. Replace `<ProblemSolutionSection />` with `<EvolutionSection />`
5. Add `<BeforeAfterSection />` in the appropriate position

**New order in `<main>`:**
```
HeroSection
EvolutionSection        ← replaces ProblemSolutionSection
CompetitiveSection
RolesSection
SprintMemorySection
SprintLifecycleSection
OrchestratorSection
QASection
ViewerSection
FinOpsSection
StatsSection
BeforeAfterSection      ← NEW, before CaseStudies
CaseStudiesSection
QuickStartSection
ToolsSection
DocumentationSection
```

### 12.19: Enhance SprintMemorySection.tsx

Current file: `presentation/src/components/landing/SprintMemorySection.tsx`

Add "reverse engineering tax" messaging to strengthen the narrative.

**Changes:**
1. Update the subtitle/description to reference the reverse engineering problem:
   - Current: "Most AI frameworks lose context when the session ends..."
   - New: "Without structure, teams spend 40+ hours per quarter reverse-engineering their own AI-generated code. AutoSpec's sprint memory system creates permanent, growing knowledge that eliminates this tax."

2. In the "Other Frameworks" comparison box, add a line:
   - "Session N+1: 40hrs reverse engineering what was built ✗"
   (or modify the "Session N" line to include reverse engineering reference)

3. Update the bottom quote to reference the reverse engineering tax:
   - Current: "Close your IDE. Come back next week..."
   - New: "No more reverse engineering your own code. Close your IDE. Come back next month. Your AI reads the specs, summaries, and docs — and picks up exactly where you left off."
