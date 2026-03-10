# Sprint 12A Brief: Evolution Narrative Slides

**Agent:** Sonnet (Sprint Agent A)
**Tickets:** 12.1–12.15 (55 pts)
**Theme:** Replace single problem slide with 5-act narrative arc across 27 slides

---

## Execution Order

1. **12.1** — Update `slides-en.ts` (data entries for 10 new slides + reorder to 27)
2. **12.2** — Update `slides-he.ts` (Hebrew translations + reorder)
3. **12.3–12.13** — Create 11 new slide components (can be parallel)
4. **12.14** — Update `PresentationPage.tsx` (imports + slideComponents map)
5. **12.15** — Remove old `ProblemSlide.tsx`, verify no orphan refs

---

## Key Architecture

- All slides are in `presentation/src/components/`
- Data files: `presentation/src/data/slides-en.ts` and `slides-he.ts`
- Each slide component: `({ data, lang }: Props) => JSX`
- PresentationPage maps `type` key → component
- Uses `framer-motion` for animations, `lucide-react` for icons

## 27-Slide Sequence (type keys)

1. `title` (KEEP)
2. `eraTraditional` (NEW)
3. `eraAssistant` (NEW)
4. `eraAgentic` (NEW)
5. `contextPoisoning` (NEW)
6. `reverseTax` (NEW)
7. `breakingPoint` (NEW)
8. `bridge` (NEW)
9. `solution` (KEEP — rework data to be more impactful)
10. `docsFolder` (NEW)
11. `workflow` (KEEP)
12. `roles` (KEEP)
13. `sprintLifecycle` (KEEP)
14. `backlog` (KEEP)
15. `orchestrator` (KEEP)
16. `multiagent` (KEEP)
17. `qaMethodology` (KEEP)
18. `sprintSummary` (KEEP)
19. `modelOptimization` (NEW — replaces `finops`)
20. `skillsEnvironments` (KEEP)
21. `viewer` (KEEP)
22. `example` (KEEP)
23. `results` (KEEP)
24. `demo` (KEEP)
25. `beforeAfter` (NEW)
26. `closing` (KEEP)
27. `finalTagline` (NEW)

---

## Ticket Details

### 12.1: Update `slides-en.ts`

Rewrite to have 27 entries in the order above. Keep existing entries that say KEEP. Add these new entries:

**Slide 2 — eraTraditional:**
```js
{
  type: 'eraTraditional',
  title: 'The Traditional Era',
  subtitle: 'Development was slow but predictable',
  characteristics: [
    { icon: '⌨️', title: 'Manual Coding', description: 'Every line written by hand' },
    { icon: '👥', title: 'Code Reviews', description: 'Human gatekeeping quality' },
    { icon: '📖', title: 'Documentation', description: 'Existed because humans wrote it' },
    { icon: '🧠', title: 'Institutional Memory', description: 'Knowledge lived in people' },
  ],
  metrics: { speed: 'Low', predictability: 'High', docs: 'Comprehensive', knowledge: 'Preserved' },
}
```

**Slide 3 — eraAssistant:**
```js
{
  type: 'eraAssistant',
  title: 'The Code Assistant Era',
  subtitle: 'AI helped you type faster, not think better',
  tools: ['GitHub Copilot', 'TabNine', 'Kite'],
  gains: [
    { title: 'Typing Speed', description: '3x faster autocomplete' },
    { title: 'Boilerplate', description: 'Repetitive code eliminated' },
  ],
  unchanged: [
    { title: 'Design Decisions', description: 'Still entirely human' },
    { title: 'Architecture', description: 'No AI involvement' },
  ],
  decisionAuthority: 'Human',
}
```

**Slide 4 — eraAgentic:**
```js
{
  type: 'eraAgentic',
  title: 'The Agentic Era',
  subtitle: 'Revolutionary power, dangerous autonomy',
  tools: ['Claude Code', 'Cursor', 'Devin'],
  power: [
    { title: 'Full Features', description: 'Entire modules in one prompt' },
    { title: 'Cross-Stack', description: 'Frontend + Backend + DB together' },
    { title: 'Autonomous', description: 'AI makes implementation decisions' },
  ],
  danger: [
    { title: 'No Memory', description: 'Every session starts from zero' },
    { title: 'Context Drift', description: 'Long conversations corrupt decisions' },
    { title: 'Zero Documentation', description: 'Chat logs are not docs' },
  ],
}
```

**Slide 5 — contextPoisoning:**
```js
{
  type: 'contextPoisoning',
  title: 'Context Poisoning',
  subtitle: 'Long conversations don\'t just lose context — they actively corrupt it',
  stages: [
    { turn: 'Turn 1', status: 'Clean', color: 'green', snippet: 'Use PostgreSQL with Prisma ORM', description: 'Clear initial decisions' },
    { turn: 'Turn 25', status: 'Drift', color: 'yellow', snippet: 'Actually, let\'s try MongoDB here...', description: 'Contradicting earlier choices' },
    { turn: 'Turn 50', status: 'Contradiction', color: 'orange', snippet: 'Wait, we\'re using Prisma right?', description: 'Forgetting what was decided' },
    { turn: 'Turn 100', status: 'Chaos', color: 'red', snippet: 'TypeError: Cannot read undefined', description: 'Compounding errors from lost context' },
  ],
}
```

**Slide 6 — reverseTax:**
```js
{
  type: 'reverseTax',
  title: 'The Reverse Engineering Tax',
  subtitle: 'Two months later, you reverse-engineer your own codebase',
  dayOne: {
    title: 'Day 1',
    items: ['Active AI context', 'AI knows all conventions', 'Moving fast, shipping features'],
  },
  daySixty: {
    title: 'Day 60',
    items: ['Chat logs deleted or stale', 'Zero context for new sessions', '"Why was this built this way?"'],
  },
  cost: { hours: 40, label: 'Hours lost to reverse engineering per quarter' },
}
```

**Slide 7 — breakingPoint:**
```js
{
  type: 'breakingPoint',
  title: 'The Breaking Point',
  subtitle: 'The faster you build, the faster you lose',
  buildItems: ['6 AI agents', '200+ files generated', '50 chat sessions'],
  debtItems: ['0 docs written', '0 decisions recorded', '0 handoff possible'],
  stats: [
    { value: '73%', label: 'of AI projects abandoned within 6 months' },
    { value: '40hrs', label: 'spent re-understanding code per quarter' },
    { value: '$0', label: 'value of chat logs after session ends' },
  ],
  bottomLine: 'Agentic development without structure is technical debt at AI speed.',
}
```

**Slide 8 — bridge:**
```js
{
  type: 'bridge',
  title: 'What if...',
  question: 'What if AI had all the context BEFORE it wrote a single line of code?',
  points: [
    'What if every decision was recorded, not just the code?',
    'What if new sessions inherited all previous knowledge?',
    'What if AI agents worked from specs, not conversations?',
  ],
}
```

**Slide 9 — solution (REWORK):**
Keep type `solution` but enhance the data:
```js
{
  type: 'solution',
  title: 'Spec-Driven Development',
  flow: [
    { step: 'Requirements', icon: '📋', description: 'Human intent captured once' },
    { step: 'Specifications', icon: '📐', description: '10 role-based contracts' },
    { step: 'Backlog', icon: '📝', description: 'Sized, ordered tickets' },
    { step: 'AI Execution', icon: '🤖', description: 'Agents with full context' },
    { step: 'Working Code', icon: '✅', description: 'Tested, documented, production-ready' },
  ],
  keyInsight: 'Don\'t let AI think. Let it execute. Specs are the thinking.',
}
```

**Slide 10 — docsFolder:**
```js
{
  type: 'docsFolder',
  title: 'The docs/ Folder',
  subtitle: 'Your institutional memory — not documentation, living knowledge',
  tree: [
    { name: 'docs/', type: 'folder', depth: 0 },
    { name: 'auth/', type: 'folder', depth: 1, annotation: 'JWT, guards, middleware' },
    { name: 'database/', type: 'folder', depth: 1, annotation: 'Schema, ERD, migrations' },
    { name: 'frontend/', type: 'folder', depth: 1, annotation: 'Routes, stores, services' },
    { name: 'scheduling/', type: 'folder', depth: 1, annotation: 'Classes, capacity, views' },
    { name: 'bookings/', type: 'folder', depth: 1, annotation: 'State machine, waitlist' },
  ],
  growth: [
    { sprint: 'Sprint 0', docs: 10 },
    { sprint: 'Sprint 5', docs: 45 },
    { sprint: 'Sprint 10', docs: 100 },
  ],
  comparison: {
    without: 'Knowledge in chat logs — lost when session ends',
    with: 'Knowledge in version-controlled docs — grows forever',
  },
}
```

**Slide 19 — modelOptimization (replaces finops):**
```js
{
  type: 'modelOptimization',
  title: 'Model Optimization',
  subtitle: 'When specs are clear, you don\'t need the biggest model',
  tiers: [
    { model: 'Haiku', share: '40%', tasks: 'Migrations, configs, CRUD', tier: 'cheapest', reason: 'Specs remove ambiguity' },
    { model: 'Sonnet', share: '45%', tasks: 'Services, components, tests', tier: 'balanced', reason: 'Brief provides full context' },
    { model: 'Opus', share: '15%', tasks: 'Architecture, planning', tier: 'premium', reason: 'Only for genuine decisions' },
  ],
  insight: 'No room for deep reasoning because all decisions are pre-made in specs.',
  comparison: {
    allOpus: '$47/sprint',
    optimized: '$19/sprint',
    savings: '~60% savings',
  },
}
```

**Slide 25 — beforeAfter:**
```js
{
  type: 'beforeAfter',
  title: 'Before & After',
  subtitle: 'Same team, same AI tools. The only difference: structure.',
  rows: [
    { aspect: 'Context', before: 'Lost every session', after: 'Preserved forever in docs/' },
    { aspect: 'Documentation', before: 'None — chat logs only', after: '100+ living docs' },
    { aspect: 'Onboarding', before: 'Weeks of reverse engineering', after: 'Read specs, start coding' },
    { aspect: 'AI Accuracy', before: 'Degrades over conversation', after: 'Consistent from spec' },
    { aspect: 'Cost', before: '$47/sprint (all Opus)', after: '$19/sprint (model routing)' },
    { aspect: 'Handoff', before: 'Impossible without original dev', after: 'Anyone reads the specs' },
  ],
}
```

**Slide 27 — finalTagline:**
```js
{
  type: 'finalTagline',
  title: 'AutoSpec',
  tagline: 'Don\'t let your AI think. Let it execute.',
}
```

### 12.2: Update `slides-he.ts`

Hebrew translations for all new entries. Same structure, Hebrew text.

### 12.3: EraTraditionalSlide.tsx

- Muted slate colors (slate-400 header)
- 4 characteristic cards in a 2x2 grid
- Bottom metrics bar showing speed/predictability/docs/knowledge
- Slow, methodical animations (0.3s delays between elements)

### 12.4: EraAssistantSlide.tsx

- Blue-400 header
- Tool logos as text badges (GitHub Copilot, TabNine, Kite)
- Two columns: "What Changed" (blue cards) vs "What Didn't" (gray cards)
- Speed gauge visual — a simple bar going from low to high
- Slightly faster animations than slide 2

### 12.5: EraAgenticSlide.tsx

- Cyan-400 header
- Tool cards at top (Claude Code, Cursor, Devin)
- Split layout: "The Power" (cyan cards) vs "The Danger" (amber cards with dashed borders + ⚠️ icons)
- Fast, energetic animations
- Subtle glitch effect on danger items via Framer Motion keyframes

### 12.6: ContextPoisoningSlide.tsx

- Amber→red gradient header
- Vertical degradation timeline, 4 stages
- Each stage: colored dot, turn label, code snippet in monospace, description
- Colors progress: green → yellow → orange → red
- Progressive reveal animation
- Subtle screen shake on red stage: `animate={{ x: [0, -2, 2, -1, 1, 0] }}`

### 12.7: ReverseTaxSlide.tsx

- Red-500 header
- Two-column split: Day 1 (green-tinted) vs Day 60 (red-tinted)
- Each side has a title and 3 bullet items
- Bottom: animated cost counter (use `motion.span` with `animate` to count up)
- Left slides in first, right after 1s delay

### 12.8: BreakingPointSlide.tsx

- Red-600 header
- Center: animated balance/scale visualization using divs (a beam with two sides)
- Left side: build items accumulate (cyan dots)
- Right side: debt items accumulate (red dots)
- The "beam" tilts via rotate transform
- Bottom: 3 devastating stat cards
- Final bottomLine fades in slowly

### 12.9: BridgeSlide.tsx

- Purple-400 glow
- Nearly empty slide, dark background
- Single question in large text (text-3xl or text-4xl) with subtle glow effect (text-shadow via style prop)
- 3 sub-points fade in below, one by one with 0.5s stagger
- Typewriter effect: reveal characters one by one using Framer Motion variants

### 12.10: DocsFolderSlide.tsx

- Emerald-400 header
- Left side: file tree visualization with folder/file icons (📁/📄), annotations
- Right side: growth chart — simple bar chart showing docs per sprint
- Bottom: comparison callout (without SDD vs with SDD)

### 12.11: ModelOptimizationSlide.tsx

- Amber-400 header (same as current FinOps)
- Same 3-tier model cards but with added `reason` field displayed
- New insight quote between tiers and comparison
- Same cost comparison bar at bottom
- Replaces FinOpsSlide entirely

### 12.12: BeforeAfterSlide.tsx

- Two columns with gradient background (red-left, green-right)
- 6 rows, each with aspect label, before (red text), after (green text)
- Center dividing line
- Cards animate in row by row

### 12.13: FinalTaglineSlide.tsx

- Near-black background (bg-slate-950 or darker)
- AutoSpec logo/text above
- Main tagline in large, bold text (text-4xl to text-6xl)
- Word-by-word reveal animation using Framer Motion variants
- Holds for visual impact

### 12.14: Update PresentationPage.tsx

Import all 11 new components. Update `slideComponents` map to include all 27 type keys. Remove `problem` and `finops` entries. The dots will automatically scale since they iterate over `slides.map`.

### 12.15: Remove ProblemSlide.tsx

Delete `presentation/src/components/ProblemSlide.tsx`. Verify no other file imports it (PresentationPage should no longer reference it after 12.14).
