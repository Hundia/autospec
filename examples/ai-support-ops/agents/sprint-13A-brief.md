# Sprint 13A Brief — Data Layer + New Slides + Title

**Agent:** Sonnet
**Sprint:** 13A (30 pts, 7 tickets: 13.1–13.7)
**Theme:** Restructure slide data to 29-slide sequence, create SDD Methodology + Ticket Execution slides, overhaul Title slide

---

## CRITICAL: Execution Order

1. **13.1** — Update `slides-en.ts` (29-slide sequence with all new/reworked data)
2. **13.2** — Update `slides-he.ts` (Hebrew translations matching 13.1 exactly)
3. **13.3, 13.4, 13.5, 13.6** — Can be done in parallel (different component files)
4. **13.7** — Build verification

---

## Ticket 13.1: Update `slides-en.ts` — 29-slide sequence

**File:** `presentation/src/data/slides-en.ts`

The current file has 27 slides. You must restructure to exactly 29 slides in this order:

| # | type key | Title |
|---|----------|-------|
| 1 | `title` | AutoSpec |
| 2 | `eraTraditional` | The Traditional Era |
| 3 | `eraAssistant` | The Code Assistant Era |
| 4 | `eraAgentic` | The Agentic Era |
| 5 | `contextPoisoning` | Context Poisoning |
| 6 | `reverseTax` | The Reverse Engineering Tax |
| 7 | `breakingPoint` | The Breaking Point |
| 8 | `bridge` | What if... |
| 9 | `sddMethodology` | SDD: The Methodology | **NEW** |
| 10 | `solution` | AutoSpec: An SDD Implementation | **REWORKED** |
| 11 | `docsFolder` | The docs/ Folder |
| 12 | `workflow` | The Full AutoSpec Pipeline | **REWORKED** |
| 13 | `roles` | The 10-Role Model | **REWORKED** |
| 14 | `ticketExecution` | Ticket Execution Deep-Dive | **NEW** |
| 15 | `sprintLifecycle` | The Sprint Lifecycle |
| 16 | `backlog` | The Backlog System |
| 17 | `orchestrator` | Orchestrator Pattern | **MINOR REWORK** |
| 18 | `multiagent` | Multi-Agent Execution |
| 19 | `qaMethodology` | QA Methodology |
| 20 | `sprintSummary` | Sprint Summaries |
| 21 | `modelOptimization` | Model Optimization |
| 22 | `environmentProof` | Environment Agnostic: Proof | **NEW type key** (replaces skillsEnvironments) |
| 23 | `viewer` | Live Viewer Dashboard |
| 24 | `example` | ShopFlow Case Study |
| 25 | `results` | Proven Results |
| 26 | `demo` | Live Demo |
| 27 | `beforeAfter` | Before & After |
| 28 | `closing` | Get Started Today |
| 29 | `finalTagline` | Final Tagline |

### Changes to existing entries:

**Slide 1 (title):** Remove `presenter: 'Your Name'` and `date: '2026'`. Add `tagline: "Don't let AI think. Give it specs."`. Keep `subtitle: 'From Requirements to Running Code'`.

**Slide 10 (solution) — REWORKED:**
```javascript
{
  type: 'solution',
  title: 'AutoSpec: An SDD Implementation',
  subtitle: 'Spec-Driven Development has many implementations. This is ours.',
  flow: [
    { step: 'Requirements', icon: '📋', description: 'Human intent captured once' },
    { step: 'Specifications', icon: '📐', description: '10 role-based contracts' },
    { step: 'Backlog', icon: '📝', description: 'Sized, ordered tickets' },
    { step: 'AI Execution', icon: '🤖', description: 'Agents with full context' },
    { step: 'Working Code', icon: '✅', description: 'Tested, documented, production-ready' },
  ],
  keyInsight: 'The power comes from specifications, not the tool. AutoSpec just makes it fast.',
}
```

**Slide 12 (workflow) — REWORKED to 7 phases:**
```javascript
{
  type: 'workflow',
  title: 'The Full AutoSpec Pipeline',
  steps: [
    { number: '01', title: 'Write Requirements', description: 'Create an SRS document describing what you want', time: '1-2 hours', output: 'requirements.md' },
    { number: '02', title: 'Generate Specs', description: 'Multi-agent generation of 10 role-based specifications', time: '5 minutes', output: 'specs/*.md' },
    { number: '03', title: 'Inject Knowledge', description: 'CLAUDE.md + docs/ folder loaded into agent context', time: 'Automatic', output: 'Full context' },
    { number: '04', title: 'Plan Sprints + Model Routing', description: 'PM assigns tickets, routes by complexity: Haiku for simple, Sonnet for complex, Opus for architecture', time: '10 minutes', output: 'backlog.md' },
    { number: '05', title: 'Execute in Worktrees', description: 'Parallel agents implement tickets in isolated git worktrees', time: '2-4 hours/sprint', output: 'Working features' },
    { number: '06', title: 'QA + Update Docs', description: 'Verification loop: build, test, review. Update living documentation', time: '30 minutes', output: 'Verified code + docs/' },
    { number: '07', title: 'Build Viewer', description: 'Generate visual dashboard from specs, backlog, and docs', time: '5 minutes', output: 'Viewer app' },
  ],
}
```

**Slide 13 (roles) — REWORKED:**
```javascript
{
  type: 'roles',
  title: 'The 10-Role Model',
  description: 'Roles are perspectives for WRITING specifications',
  roles: [
    { num: '01', name: 'Product Manager', focus: 'Vision, personas, flows', specFile: 'specs/01_product_manager.md' },
    { num: '02', name: 'Backend Lead', focus: 'APIs, auth, services', specFile: 'specs/02_backend_lead.md' },
    { num: '03', name: 'Frontend Lead', focus: 'Components, design system', specFile: 'specs/03_frontend_lead.md' },
    { num: '04', name: 'DB Architect', focus: 'Schema, migrations', specFile: 'specs/04_db_architect.md' },
    { num: '05', name: 'QA Lead', focus: 'Testing strategy', specFile: 'specs/05_qa_lead.md' },
    { num: '06', name: 'DevOps Lead', focus: 'Infrastructure, CI/CD', specFile: 'specs/06_devops_lead.md' },
    { num: '07', name: 'Marketing Lead', focus: 'Go-to-market', specFile: 'specs/07_marketing_lead.md' },
    { num: '08', name: 'Finance Lead', focus: 'Pricing, economics', specFile: 'specs/08_finance_lead.md' },
    { num: '09', name: 'Business Lead', focus: 'Strategy, competition', specFile: 'specs/09_business_lead.md' },
    { num: '10', name: 'UI Designer', focus: 'Screens, wireframes', specFile: 'specs/10_ui_designer.md' },
  ],
  agentDistinction: {
    subtitle: 'A role is a job description. An agent is the employee. One agent can wear multiple hats.',
    lanes: [
      { agent: 'Opus Orchestrator', roles: ['Product Manager', 'Business Lead'] },
      { agent: 'Sonnet Agent A', roles: ['Backend Lead', 'DB Architect', 'DevOps Lead'] },
      { agent: 'Sonnet Agent B', roles: ['Frontend Lead', 'QA Lead', 'UI Designer'] },
    ],
  },
  insight: 'Even solo developers benefit from thinking in roles.',
}
```

**Slide 17 (orchestrator) — MINOR REWORK:**
```javascript
{
  type: 'orchestrator',
  title: 'Orchestrator Pattern',
  orchestrator: {
    name: 'Product Manager (Opus)',
    subtitle: 'The orchestrator is an AI agent with the PM role from specs/01_product_manager.md',
    tasks: ['Writes sprint briefs', 'Spawns parallel agents', 'Sequences sprints by dependency graph', 'Reviews results & merges'],
  },
  agents: [
    { name: 'Sonnet Agent A', task: 'Backend tickets in worktree-a' },
    { name: 'Sonnet Agent B', task: 'Frontend tickets in worktree-b' },
    { name: 'Sonnet Agent C', task: 'Docs & config in worktree-c' },
  ],
  benefits: ['Clean main context', 'Parallel execution', 'Isolated worktrees'],
}
```

### New entries to INSERT:

**Slide 9 (sddMethodology) — NEW (insert AFTER bridge, BEFORE solution):**
```javascript
{
  type: 'sddMethodology',
  title: 'SDD: The Methodology',
  principles: [
    { title: 'Specifications Before Code', description: 'Capture intent once, execute many times', icon: '📐' },
    { title: 'Living Documentation', description: 'Docs grow with the project, never stale', icon: '📖' },
    { title: 'Role-Based Thinking', description: '10 perspectives prevent blind spots', icon: '🎭' },
    { title: 'Agentic Execution', description: 'Clear specs remove ambiguity for AI agents', icon: '🤖' },
  ],
  implementations: [
    { name: 'AutoSpec', description: 'Full SDD framework with CLI + viewer', status: 'featured' },
    { name: 'OpenSpec', description: 'Community-driven open specification format', status: 'alternative' },
    { name: 'Your Framework', description: 'SDD is a methodology, not a product', status: 'custom' },
  ],
}
```

**Slide 14 (ticketExecution) — NEW (insert AFTER roles, BEFORE sprintLifecycle):**
```javascript
{
  type: 'ticketExecution',
  title: 'Ticket Execution Deep-Dive',
  stages: [
    { stage: 1, title: 'Ticket from Backlog', description: 'Ticket ID, title, story points, acceptance criteria', icon: '🎫', time: '0 min' },
    { stage: 2, title: 'PM Assigns Context', description: 'Role spec from specs/ folder + relevant docs/ sections + previous sprint summaries injected into brief', icon: '📋', time: '2 min' },
    { stage: 3, title: 'Dev Agent Executes', description: 'Implements code, writes tests, updates docs — all in an isolated worktree', icon: '⚙️', time: '15-45 min' },
    { stage: 4, title: 'QA Agent Reviews', description: 'Separate agent with QA Lead role (specs/05_qa_lead.md) plans tests, verifies user flow, approves or blocks', icon: '🧪', time: '5-10 min' },
    { stage: 5, title: 'Merge + Summarize', description: 'Backlog updated to ✅, sprint summary written, docs/ updated', icon: '✅', time: '2 min' },
  ],
  callout: 'Product Manager agent orchestrates this entire process.',
}
```

**Slide 22 (environmentProof) — NEW type key (replaces skillsEnvironments):**
```javascript
{
  type: 'environmentProof',
  title: 'Environment Agnostic: Proof',
  environments: [
    {
      name: 'Claude Code',
      accent: 'cyan',
      mockup: 'terminal',
      commands: ['$ claude', '> /sprint-run', 'Loading CLAUDE.md...', 'Loading specs/*.md...', 'Sprint 3 executing...'],
    },
    {
      name: 'GitHub Copilot',
      accent: 'purple',
      mockup: 'ide',
      commands: ['CLAUDE.md loaded in workspace', 'specs/ folder indexed', '@workspace /sprint-run'],
    },
    {
      name: 'Air-Gapped / Continue',
      accent: 'amber',
      mockup: 'local',
      commands: ['Ollama running locally', 'Same specs/ folder', 'No cloud required'],
    },
  ],
  callout: 'Same CLAUDE.md. Same specs/. Same methodology.',
  bottomText: 'Works in any environment — even without internet.',
}
```

### KEEP UNCHANGED (copy as-is):
Slides 2-8 (eraTraditional through bridge), 15 (sprintLifecycle), 16 (backlog), 18 (multiagent), 19 (qaMethodology), 20 (sprintSummary), 21 (modelOptimization), 23 (viewer), 24 (example), 25 (results), 26 (demo), 27 (beforeAfter), 28 (closing), 29 (finalTagline).

### DELETE:
Remove the `skillsEnvironments` entry entirely (replaced by `environmentProof`).

---

## Ticket 13.2: Update `slides-he.ts` — Hebrew translations

**File:** `presentation/src/data/slides-he.ts`

Must match the EXACT same 29-slide sequence as `slides-en.ts`. All type keys must match. Translate ALL new and reworked text to Hebrew.

Key translations:
- "SDD: The Methodology" → "SDD: המתודולוגיה"
- "Specifications Before Code" → "מפרטים לפני קוד"
- "Living Documentation" → "תיעוד חי"
- "Role-Based Thinking" → "חשיבה מבוססת תפקידים"
- "Agentic Execution" → "ביצוע אג'נטי"
- "AutoSpec: An SDD Implementation" → "AutoSpec: מימוש של SDD"
- "Spec-Driven Development has many implementations. This is ours." → "לפיתוח מונחה מפרטים יש מימושים רבים. זה שלנו."
- "The power comes from specifications, not the tool. AutoSpec just makes it fast." → "הכוח מגיע מהמפרטים, לא מהכלי. AutoSpec פשוט עושה את זה מהר."
- "The Full AutoSpec Pipeline" → "צינור העבודה המלא של AutoSpec"
- "Inject Knowledge" → "הזרקת ידע"
- "Plan Sprints + Model Routing" → "תכנון ספרינטים + ניתוב מודלים"
- "Execute in Worktrees" → "ביצוע ב-Worktrees"
- "QA + Update Docs" → "QA + עדכון דוקומנטציה"
- "Build Viewer" → "בניית Viewer"
- "Ticket Execution Deep-Dive" → "צלילה עמוקה לביצוע משימה"
- "PM Assigns Context" → "מנהל מוצר מקצה הקשר"
- "Dev Agent Executes" → "סוכן פיתוח מבצע"
- "QA Agent Reviews" → "סוכן QA סוקר"
- "Merge + Summarize" → "מיזוג + סיכום"
- "Product Manager agent orchestrates this entire process." → "סוכן מנהל המוצר מתזמר את כל התהליך."
- "Environment Agnostic: Proof" → "אגנוסטי לסביבה: הוכחה"
- "Same CLAUDE.md. Same specs/. Same methodology." → "אותו CLAUDE.md. אותו specs/. אותה מתודולוגיה."
- "Works in any environment — even without internet." → "עובד בכל סביבה — גם בלי אינטרנט."
- "Product Manager (Opus)" → "מנהל מוצר (Opus)"
- "The orchestrator is an AI agent with the PM role from specs/01_product_manager.md" → "ה-Orchestrator הוא סוכן AI עם תפקיד מנהל המוצר מ-specs/01_product_manager.md"
- "Sequences sprints by dependency graph" → "מסדר ספרינטים לפי גרף תלויות"
- "Don't let AI think. Give it specs." → "אל תן ל-AI לחשוב. תן לו מפרטים."
- "Roles are perspectives for WRITING specifications" → "תפקידים הם נקודות מבט לכתיבת מפרטים"
- "A role is a job description. An agent is the employee. One agent can wear multiple hats." → "תפקיד הוא תיאור תפקיד. סוכן הוא העובד. סוכן אחד יכול ללבוש כמה כובעים."

Remove `presenter: 'השם שלך'` and `date: '2026'` from title slide. Update tagline.

---

## Ticket 13.3: Rework `TitleSlide.tsx`

**File:** `presentation/src/components/TitleSlide.tsx`

Remove ASCII art and "Your Name" presenter. Create premium cinematic title slide:

1. **Animated gradient background** — CSS keyframe animation cycling blue→purple→cyan→blue over 20s. Apply as a radial/linear gradient behind the content.
2. **"AutoSpec" title** — gradient text (blue→purple→cyan) with subtle text-shadow glow effect.
3. **Tagline with word-by-word stagger** — Split `data.tagline` into words, render each with framer-motion stagger (0.15s delay between words).
4. **Floating ambient dots** — 6 small circles with random positions, animated with framer-motion using `animate={{ x: [0, random, 0], y: [0, random, 0] }}` with varying durations (8-15s) for organic floating feel.
5. **Bottom badge** — "Spec-Driven Development Framework" with a small pulsing green dot indicator.

Updated interface (no more presenter/date):
```typescript
interface TitleSlideProps {
  data: {
    title: string;
    subtitle: string;
    tagline: string;
  };
  lang: 'en' | 'he';
}
```

Keep framer-motion for all animations. No external dependencies.

---

## Ticket 13.4: Create `SDDMethodologySlide.tsx`

**File:** `presentation/src/components/SDDMethodologySlide.tsx` (NEW)

Left-right split layout:

**LEFT side: "The SDD Philosophy"**
- 4 principle cards stacked vertically
- Each card: icon + title + description
- Cards from `data.principles` array
- Teal/emerald border accent

**RIGHT side: "Implementations"**
- 3 cards from `data.implementations` array
- AutoSpec (status: 'featured'): solid cyan border, highlighted background
- OpenSpec (status: 'alternative'): dashed purple border
- "Your Framework" (status: 'custom'): dotted gray border
- Show description under each

**Center connection:** A vertical SVG line connecting left column to right column with a draw-on animation (framer-motion `pathLength`).

Teal/emerald accent colors throughout. Responsive: stack vertically on mobile.

```typescript
interface SDDMethodologySlideProps {
  data: {
    title: string;
    principles: Array<{ title: string; description: string; icon: string }>;
    implementations: Array<{ name: string; description: string; status: string }>;
  };
  lang: 'en' | 'he';
}
```

---

## Ticket 13.5: Rework `SolutionSlide.tsx`

**File:** `presentation/src/components/SolutionSlide.tsx`

Minor rework:
1. Change the title rendering — it now uses `data.title` which will say "AutoSpec: An SDD Implementation"
2. Add `data.subtitle` below the title in smaller text
3. Keep the 5-step flow diagram exactly as-is
4. Update `keyInsight` text (comes from data)
5. The interface needs `subtitle?: string` added

Updated interface:
```typescript
interface SolutionSlideProps {
  data: {
    title: string;
    subtitle?: string;
    flow: Array<{ step: string; icon: string; description: string }>;
    keyInsight: string;
  };
  lang: 'en' | 'he';
}
```

Just add the subtitle line after the title. Minimal change.

---

## Ticket 13.6: Create `TicketExecutionSlide.tsx`

**File:** `presentation/src/components/TicketExecutionSlide.tsx` (NEW)

5-stage vertical pipeline with connecting lines:

- Each stage is a card with: stage number, icon, title, description, time annotation
- Vertical connecting lines between stages (amber/orange colored)
- Stages from `data.stages` array
- Staggered entrance animations
- Bottom callout: `data.callout` text
- Amber/orange accent colors

```typescript
interface TicketExecutionSlideProps {
  data: {
    title: string;
    stages: Array<{
      stage: number;
      title: string;
      description: string;
      icon: string;
      time: string;
    }>;
    callout: string;
  };
  lang: 'en' | 'he';
}
```

Layout: vertical pipeline with each stage as a horizontal card. Between each pair of cards, a short vertical amber line connector. Right-side time annotations.

---

## Ticket 13.7: Build Verification

After all above tickets are complete:
1. Run `cd /opt/FitnessAiManager/autospec/presentation && npm run build`
2. Verify it exits 0
3. Check that `slides-en.ts` and `slides-he.ts` both have exactly 29 entries
4. Check that all type keys in the data files will have matching components (note: some components like EnvironmentProofSlide will be created in Sprint 13B — for now just verify the data files are correct)

---

## Working Directory

All files are relative to `/opt/FitnessAiManager/autospec/presentation/`.

## Design Conventions

- Dark theme: `bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900`
- All slide components use framer-motion for entrance animations
- Color accents per slide (see existing components for patterns)
- Mobile responsive with sm/md/lg breakpoints
- RTL support through `lang` prop (the parent handles `dir` attribute)
