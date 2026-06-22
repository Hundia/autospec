export const slidesEN = [
  // ── ACT 1 — THE PROBLEM (slides 1–7) ────────────────────────────────────────

  // 1. title
  {
    type: 'title',
    title: 'The Agentic SDLC',
    subtitle: 'Spec-Driven Development at Enterprise Scale',
    tagline: 'Agents execute. Humans govern.',
    presenter: 'By Eli Hundia & Sharon Schwartz',
  },

  // 2. paradigmShift — the reframe: AI is not a tool you adopt
  {
    type: 'paradigmShift',
    struckPhrase: 'AI Adoption',
    truth: "It's not a tool you adopt — it's a shift in how the work itself happens.",
    dimensionsLead: 'What actually shifts',
    dimensions: {
      knowledge: {
        label: 'How knowledge is created',
        detail: 'Understanding is generated in dialogue with the machine, not just retrieved from people.',
      },
      work: {
        label: 'How work gets done',
        detail: 'The unit of effort moves from typing code to specifying intent and steering outcomes.',
      },
      responsibility: {
        label: 'How responsibility is shared',
        detail: 'Accountability is redistributed between engineer and agent — neither owns it alone.',
      },
      engineers: {
        label: 'How engineers see their craft',
        detail: 'The profession redefines itself — from author of every line to architect of intent.',
      },
    },
  },

  // 3. eraTraditional
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
  },

  // 3. eraAssistant
  {
    type: 'eraAssistant',
    title: 'The Code Assistant Era',
    subtitle: 'AI helped you type faster, not think better',
    tools: ['GitHub Copilot', 'TabNine'],
    gains: [
      { title: 'Typing Speed', description: '3x faster autocomplete' },
      { title: 'Boilerplate', description: 'Repetitive code eliminated' },
    ],
    unchanged: [
      { title: 'Design Decisions', description: 'Still entirely human' },
      { title: 'Architecture', description: 'No AI involvement' },
    ],
    decisionAuthority: 'Human',
  },

  // 4. eraAgentic
  {
    type: 'eraAgentic',
    title: 'The Prompt Engineering Era',
    subtitle: 'Revolutionary power, dangerous autonomy',
    tools: ['Claude Code', 'Cursor', 'Devin'],
    power: [
      { title: 'Full Features', description: 'Entire modules in one prompt' },
      { title: 'Cross-Stack', description: 'Frontend + Backend + DB together' },
      { title: 'Autonomous', description: 'AI makes implementation decisions' },
    ],
    danger: [
      { title: 'The Compaction Trap', description: 'When the context window fills, the agent compacts the conversation into a lossy summary — the original constraints vanish and it keeps building, confidently wrong' },
      { title: 'The Reverse Engineering Tax', description: 'Every session resets to zero — you pay the full rediscovery cost before every new feature' },
      { title: 'The Breaking Point', description: 'No documentation means no continuity — teams hit an invisible wall at the second feature' },
    ],
  },

  // 5. contextPoisoning (The Compaction Trap) — scrollable narrative
  {
    type: 'contextPoisoning',
    scrollable: true,
    kicker: 'A PROBLEM HIDING INSIDE GOOD INTENTIONS',
    title: 'The Compaction Trap',
    hook: 'The trap is that being thorough is exactly what kills you.',
    scrollHint: 'Scroll to watch the window fill',
    // ── Beat 1 — the instinct ──
    instinctKicker: 'THE INSTINCT',
    instinctTitle: 'You do the responsible thing — you give it everything.',
    instinctLead: "Before the agent writes a line, you hand it all the context: the full PRD, the design doc, the API reference, the meeting notes. The responsible move. That's the trap.",
    bigDocs: [
      { icon: 'BookOpen', name: 'The full product PRD', weight: '82 pages · ~61k tokens', fill: 90 },
      { icon: 'FileText', name: 'The architecture & design doc', weight: '40 pages · ~30k tokens', fill: 55 },
      { icon: 'Code2', name: 'The complete API reference', weight: 'every endpoint · ~45k tokens', fill: 72 },
      { icon: 'ClipboardList', name: 'Six months of meeting notes', weight: 'pasted in full · ~28k tokens', fill: 48 },
      { icon: 'MessageSquare', name: 'Three exported Slack threads', weight: '"just in case" · ~22k tokens', fill: 38 },
      { icon: 'FileStack', name: 'The old codebase, dumped in', weight: 'all of it · ~70k tokens', fill: 95 },
    ],
    instinctReframe: 'None of this is careless. Every one of these is the diligent thing to do.',
    // ── Beat 2 — the window fills ──
    windowKicker: 'THE WINDOW FILLS',
    windowTitle: 'The context window is a budget — and you spent it before work began.',
    windowLead: 'It is finite. Every document you paste in claims a slice. The gauge climbs past the danger line before a single useful instruction is ever given.',
    budgetLabel: 'Context window budget',
    fillStages: [
      { label: 'PRD pasted', detail: 'one giant doc, up front', fill: 20 },
      { label: '+ design + API', detail: 'a few big docs stack up', fill: 60 },
      { label: '+ notes + code', detail: 'no room left to think', fill: 98 },
    ],
    wallLabel: '98% FULL — before any real work',
    onRampsLead: 'Many on-ramps, one wall →',
    onRamps: [
      { label: 'One giant doc, up front', note: 'fills the window before you write a line' },
      { label: 'A few big docs over iterations', note: 'stacks up like a long chat' },
      { label: 'A late pivot near the limit', note: 'tips a nearly-full window over the edge' },
    ],
    // ── Beat 3 — the result (compaction) ──
    resultKicker: 'THE RESULT',
    resultTitle: 'Only now does AUTO-COMPACT fire — and compaction is lossy.',
    fullContext: {
      label: 'Full Context',
      cards: [
        { text: 'Use PostgreSQL + Prisma ORM', dropped: true },
        { text: 'No NoSQL — relational integrity required', dropped: true },
        { text: 'Type-safe queries only', dropped: false },
        { text: 'Activity feed = a Postgres table', dropped: false },
      ],
    },
    compaction: {
      operation: '⚡ AUTO-COMPACT',
      caption: 'context summarized →',
      droppedTag: 'dropped in summary',
    },
    lossySummary: {
      label: 'Lossy Summary',
      retained: '~40% retained',
      text: 'Building a database layer. Activity feed needs flexible documents.',
    },
    casualtyNote: 'The foundational constraints are the casualties — dropped first, never recovered.',
    // ── Beat 4 — the dagger ──
    verdict: {
      agentLine: 'Adding MongoDB for the activity feed — documents fit better here.',
      dagger: "It isn't confused. It can't see what it lost.",
      reframe: 'The thoroughness that was supposed to protect the work is exactly what detonated it.',
    },
  },

  // 6. secondFeature (merged: The Reverse Engineering Tax + The Breaking Point)
  {
    type: 'secondFeature',
    scrollable: true,
    kicker: 'One session corrupts. Every session forgets.',
    title: 'The Second Feature',
    subtitle: 'The first feature is free. The second one is where AI projects go to die.',
    scrollHint: 'Scroll — this gets worse',
    chapters: [
      { number: '01', name: 'The Reverse Engineering Tax', accent: 'amber' },
      { number: '02', name: 'The Breaking Point', accent: 'red' },
    ],
    chapter1: {
      label: 'The Reverse Engineering Tax',
      headline: 'Day 60. The product works. You want Feature +1.',
      setup: [
        'Your AI-built product runs in production. Six features, zero incidents.',
        'The chat sessions that built it are gone. No docs were ever written.',
        'You open a fresh session: "Add the payment flow." Should be simple.',
      ],
      terminal: {
        windowTitle: 'ai-agent — session #51 — day 60',
        lines: [
          { kind: 'you', time: '09:02', text: 'Add a payment flow with Stripe. Checkout already exists.' },
          { kind: 'agent', time: '09:02', text: 'I have no context for this project. 214 files. No README. No specs. No record of any decision. Before I write code, I need answers.' },
          { kind: 'agent', time: '09:03', text: 'Where is checkout implemented? Which data layer is canonical? Is there a service boundary for transactions?' },
          { kind: 'you', time: '09:04', text: "I don't remember. It was all decided in chat. The sessions are gone." },
          { kind: 'agent', time: '09:05', text: 'Understood. Starting discovery.' },
          { kind: 'cmd', text: 'grep -r "checkout" src/', result: '→ 47 matches across 12 files' },
          { kind: 'cmd', text: 'cat src/services/order.ts', result: '→ 612 lines, zero comments' },
          { kind: 'cmd', text: 'find . -name "*.md"', result: '→ 0 results' },
          { kind: 'sys', time: '11:30', text: '2.5 hrs elapsed · feature code written: 0', tone: 'warn' },
          { kind: 'agent', time: '14:15', text: 'I found three different state patterns. Which one is intentional?' },
          { kind: 'you', time: '14:16', text: '...' },
          { kind: 'sys', time: '17:40', text: '8 hrs elapsed · still reverse-engineering · feature not started', tone: 'fail' },
        ],
      },
      meter: { to: 16, unit: 'hrs', caption: 'paid in rediscovery — before the first new line is written' },
      invoice: {
        title: 'Invoice — The Reverse Engineering Tax',
        items: [
          { hours: '4–8h', label: 'Re-read every file to learn what was built' },
          { hours: '2–4h', label: 'Reverse-engineer decisions made in dead chats' },
          { hours: '2–4h', label: "Find extension points that won't break production" },
        ],
        total: { hours: '8–16h', label: 'Due before Feature +1 begins' },
      },
      callout: { stat: '73%', text: 'of AI projects are abandoned. Not because the first feature failed — because the second feature became unaffordable.' },
    },
    chapter2: {
      label: 'The Breaking Point',
      headline: 'Now multiply by your whole team.',
      build: [
        { value: '6', label: 'AI agents' },
        { value: '200+', label: 'files generated' },
        { value: '50', label: 'chat sessions' },
      ],
      debt: [
        { value: '0', label: 'docs written' },
        { value: '0', label: 'decisions recorded' },
        { value: '0', label: 'handoff possible' },
      ],
      graveyard: { count: 50, youAreHereLabel: 'you are here', stamp: 'GONE' },
      stats: [
        { value: '73%', label: 'of AI projects abandoned within 6 months' },
        { value: '40hrs', label: 're-understanding code, every quarter' },
        { value: '$0', label: 'value of a chat log after the session ends' },
      ],
      bottomLine: 'AI-driven development without governance is technical debt at AI speed.',
    },
  },

  // ── ACT 2 — TURNING POINT ─────────────────────────────────────────────────────

  // bridge
  {
    type: 'bridge',
    title: 'What if...',
    question: 'The SDLC itself was rebuilt for agents.',
    points: [
      'What if no agent could write code before a human approved the spec?',
      'What if every agent error became a permanent guardrail?',
      'What if speed was the output of structure — not shortcuts?',
    ],
  },

  // sddThreePillars — HIDDEN (kept in file, filtered out of the deck via `hidden`)
  {
    type: 'sddThreePillars',
    hidden: true,
    kicker: 'SPEC-DRIVEN DEVELOPMENT · WHAT IT IS',
    title: 'The Operating System of Agentic Development',
    definition: 'A methodology where the spec is never optional, every decision is traceable, and every agent operates inside human-approved boundaries.',
    pillars: [
      {
        number: '01',
        icon: '📐',
        title: 'Specs as Code',
        description: 'spec.md and constitution.md live in git. Human-approved before any agent acts. The single source of truth every phase reads.',
        artifact: 'specs/*.md  ·  constitution.md',
        color: 'teal',
      },
      {
        number: '02',
        icon: '📋',
        title: 'Cycle Summaries',
        description: 'Every Cycle closes with a summary: what was built, what changed, what was decided — including the reasoning. No context is ever lost.',
        artifact: 'cycles/cycle-X/summary.md',
        color: 'emerald',
      },
      {
        number: '03',
        icon: '📖',
        title: 'Living Documentation',
        description: 'Docs and guardrails grow with every Cycle. The constitution constrains every future agent — automatically.',
        artifact: 'docs/  ·  guardrails/',
        color: 'cyan',
      },
    ],
    thesis: [
      { text: 'THE SPEC IS THE TRUTH', color: 'amber' },
      { text: 'THE GUARDRAILS ARE THE PROTECTION', color: 'emerald' },
      { text: 'THE HUMAN IS THE JUDGE', color: 'blue' },
    ],
  },

  // ── ACT 3 — THE AGENTIC SDLC METHODOLOGY (slides 11–15) ──────────────────────

  // 11. philosophy
  {
    type: 'philosophy',
    title: 'Core Philosophy',
    subtitle: 'Five ideas that change everything',
    cards: [
      {
        icon: '🎯',
        title: 'Cycles, Not Sprints',
        description: 'A Cycle is a bounded, independently-testable delivery unit — spec-approved, AI-executed, guardrail-verified. Measured in hours or days, not weeks. Speed is the output of structure.',
        accent: 'blue',
      },
      {
        icon: '👁',
        title: 'Humans as Orchestrators',
        description: 'Engineers move from Executors (writing code) to Orchestrators — designing specs, reviewing agent output, maintaining the guardrails.',
        accent: 'violet',
      },
      {
        icon: '✍️',
        title: 'Governors & Reviewers',
        description: 'Without strong governance, HITL becomes rubber-stamping. AI-driven execution + structured specs + enforced governance is what separates genuine oversight from theater.',
        accent: 'teal',
      },
      {
        icon: '🛡',
        title: 'Guardrails Cannot Be Bypassed',
        description: 'Tests, linters, types, constraints agents cannot violate. Every agent error becomes a permanent guardrail test — it cannot recur. The guardrails only ever grow stronger.',
        accent: 'emerald',
      },
      {
        icon: '📄',
        title: 'The Spec is the Truth',
        description: 'No code before the spec is approved. Spec is version-controlled and updated before code changes. Kills spec rot.',
        accent: 'amber',
      },
    ],
    quote: 'The Spec is the Truth. The Guardrails are the Protection. The Human is the Judge.',
  },

  // agentic5Acts — SCROLLABLE
  {
    type: 'agentic5Acts',
    scrollable: true,
    title: 'The Agentic SDLC',
    subtitle: 'Seven phases. One complete loop. No context ever lost.',
    closingCallout: 'Discover. Align. Plan. Execute. Test. Remember. Steer. Seven phases that collapse the clock — without skipping a single stage.',
    keyInsight: {
      headline: 'The Key Insight: Compress, Don\'t Skip',
      body: 'The traditional linear SDLC is collapsing — not being eliminated. AI is merging requirements, design, and development into a highly compressed, iterative "Design & Experiment" super-phase. Cross-functional teams move from idea to functional prototype in days or hours. The discipline of each stage still matters; only the clock changes.',
    },
    phases: [
      {
        number: '1',
        name: 'REQUIREMENTS, INTENT & DISCOVERY',
        tagline: 'Before a single agent moves, the truth is written and approved.',
        stageRef: 'Stage 1',
        owners: ['Product Manager'],
        hero: false,
        accent: 'blue',
        bullets: [
          'GenAI distills unstructured inputs — conversations, Jira tickets, interviews — into a Requirement Paper or high-fidelity spec.md. Problem only; no implementation.',
          'The Product Manager approves before any agent may proceed. Anti-spec-rot: spec.md is version-controlled and updated before code changes.',
          'Output is the Requirement Paper or Actual Spec — the single source of truth that every downstream phase reads.',
        ],
        output: 'Requirement Paper or spec.md',
      },
      {
        number: '2',
        name: 'PROJECT ALIGNMENT & CONSTRAINTS',
        tagline: 'The laws of the project — before any agent can act.',
        stageRef: 'Stage 2',
        owners: ['Architect', 'Software System Engineer'],
        hero: false,
        accent: 'violet',
        bullets: [
          'Project laws encoded as Instructions & Skills files: architecture patterns, design conventions, security standards.',
          'These constraints form the base of the Guardrails — hard bounds injected into every agent context, making non-compliant suggestions mechanically impossible.',
          'The Architect and Software System Engineer sign off: every future agent inherits these boundaries automatically.',
        ],
        output: 'constitution.md + Instructions & Skills files',
      },
      {
        number: '3',
        name: 'DESIGN & PLANNING',
        tagline: 'The roadmap agents cannot deviate from.',
        stageRef: 'Stage 3',
        owners: ['Architect', 'Dev Team Lead', 'QA Team Lead (optional)'],
        hero: false,
        accent: 'emerald',
        bullets: [
          'Iterative conversation with a planning agent produces plan.md and granular tasks.md.',
          'Tasks are designed to be independently testable and decoupled by design — enabling parallel AI execution from the start.',
          'An orchestrating agent assigns independent tasks to multiple specialist agents simultaneously.',
          'Senior engineers interrogate the plan, not write it — focusing on legacy constraints, security, blast radius.',
          'QA Team Lead shapes test architecture upfront: testability baked in before a single line is written.',
        ],
        output: 'plan.md + tasks.md (testable, parallelizable by design)',
      },
      {
        number: '4',
        name: 'EXECUTION',
        tagline: 'Agents execute in hours under mechanical guardrails.',
        stageRef: 'Stage 4',
        owners: ['Developer (HITL)'],
        hero: true,
        accent: 'indigo',
        bullets: [
          'Parallel AI execution where tasks are decoupled — multiple agents in isolated worktrees tackle independent work simultaneously.',
          'Every implementation is grounded in the Specs .md files defined for the task. No free-form generation.',
          'All agent-generated code is reviewed by the Developer HITL before merge — without exception.',
          'TDD-enforced: no implementation before a failing test. Every agent error becomes a permanent guardrail test — it cannot recur.',
        ],
        output: 'Merged, HITL-reviewed code',
      },
      {
        number: '5',
        name: 'TESTING & QA',
        tagline: 'Every feature scenario verified — and immortalized in the guardrails.',
        stageRef: 'Stage 5',
        owners: ['QA Tech Lead'],
        hero: false,
        accent: 'cyan',
        bullets: [
          'QA Tech Lead implements AND runs system tests based on scenarios in Feature Specs .md files.',
          'Every new test added to regression — full regression suite runs on every Cycle close.',
          'No feature is considered shipped until all Feature Spec scenarios pass and regression is green.',
        ],
        output: 'Regression-green test suite + system test results',
      },
      {
        number: '6',
        name: 'DEVELOPMENT SUMMARY',
        tagline: 'The memory that makes every next Cycle faster than the last.',
        stageRef: 'Stage 6',
        owners: ['Product Manager (HITL)', 'Dev Tech Lead (HITL)', 'QA Tech Lead (HITL)'],
        hero: true,
        accent: 'teal',
        bullets: [
          'Every Cycle closes with a development summary: what was built, what changed, what was decided — including the reasoning behind key technical choices.',
          'Reasoning captured: why an approach was chosen, alternatives considered, constraints encountered.',
          'All tech leads participate as HITL: PM → Dev TL → QA TL each validate their domain.',
          'The next agent reads the summary and inherits full context in 30 seconds — including the decision trail. No reverse engineering.',
        ],
        output: 'cycles/cycle-X/summary.md (with embedded reasoning log)',
      },
      {
        number: '7',
        name: 'OBSERVABILITY & SELF-CORRECTION',
        tagline: 'The system that corrects itself back to the spec.',
        stageRef: 'Stage 7',
        owners: ['SRE / DevOps'],
        hero: false,
        accent: 'orange',
        bullets: [
          'Observability agents monitor real-time telemetry — metrics and logs — against the spec\'s intended behavior.',
          'Real-time scenario verification: agent behavior validated against Feature Requirements in the Specs .md files.',
          'Drift from spec intent triggers automated alerts or opens a self-correction Cycle automatically.',
          'SRE agents surface anomalies proactively; GenAI writes incident summaries tied to the relevant spec section.',
        ],
        output: 'A self-steering, spec-aligned production system',
      },
    ],
  },

  // notVibeCoding — "What You Just Saw Has a Name" (the summary of the Agentic SDLC)
  {
    type: 'notVibeCoding',
    title: 'What You Just Saw Has a Name',
    subtitle: 'A discipline with rules, contracts, and accountability — by design.',
    definitionLead: 'The practice',
    definitionTerm: 'Governed Agentic Development',
    pillars: [
      {
        key: 'teal',
        icon: 'spec',
        ordinal: '01',
        label: 'The spec is the contract',
        detail: 'No code before the spec is approved. The single source of truth every agent reads.',
      },
      {
        key: 'emerald',
        icon: 'guardrails',
        ordinal: '02',
        label: 'Guardrails are law',
        detail: 'Tests, types, linters, constraints agents cannot bypass. Every error becomes a permanent test case.',
      },
      {
        key: 'blue',
        icon: 'human',
        ordinal: '03',
        label: 'The human is the judge',
        detail: 'Human-in-the-loop checkpoints at every gate. Oversight, not rubber-stamping.',
      },
      {
        key: 'violet',
        icon: 'trail',
        ordinal: '04',
        label: 'Every move is on the record',
        detail: 'Decisions, specs, and outputs are version-controlled and traceable. Nothing evaporates with the chat.',
      },
    ],
    verdict: 'So when people call it vibe coding — it isn\'t. This is.',
  },

  // harness — SCROLLABLE · guardrail use-cases
  {
    type: 'harness',
    scrollable: true,

    kicker: 'ACT 3 · THE EXECUTION PIPELINE',
    heroTitle: 'The Execution Pipeline',
    heroSubtitle: 'A methodology for running AI agents with control. Every task flows through a structured pipeline — specs feed it, gates enforce it, humans govern it.',
    scrollHint: 'Scroll to see four pipeline gates through real agent moments',

    introKicker: 'The methodology',
    introHeading: 'Spec in. Verified output out.',
    introBody:
      'Every agent task enters a structured pipeline: it starts from a spec, executes under a focused brief, and passes through automated gates before any output lands in the codebase. The gates do not slow the agent down — they make every output trustworthy. Here are four of those gates through something the agent actually tried to do.',

    casesKicker: 'Four pipeline gates · four real moments',

    cases: [
      {
        iconKey: 'Boxes',
        accent: 'blue',
        kicker: 'Gate 01 · Tech Stack',
        name: 'Tech Stack Enforcement',
        attemptLabel: 'Agent tried',
        scenario: 'Mid-task, the agent decides it would be easier to pull in a brand-new charting library — and a second framework to go with it.',
        attemptCode: '$ npm install some-random-charts vue\n+ added 2 frameworks outside the approved stack',
        verdict: 'BLOCKED',
        responseLabel: 'Guardrail response',
        response: 'The dependency gate compares the install against the approved stack and rejects anything outside it. The agent has to solve the problem with what the project already uses.',
        ruleLabel: 'Rule enforced',
        rule: 'Approved stack only: React + TypeScript + Postgres',
      },
      {
        iconKey: 'ScrollText',
        accent: 'violet',
        kicker: 'Gate 02 · Conventions',
        name: 'Coding Conventions',
        attemptLabel: 'Agent tried',
        scenario: 'The agent writes working code, but in its own style — snake_case names, 2-space tabs, no semicolons — nothing like the rest of the repo.',
        attemptCode: 'const user_data = fetch_user( id )\n  return user_data',
        verdict: 'BLOCKED',
        responseLabel: 'Guardrail response',
        response: 'lint + format run on every change. The code is auto-rewritten to the project style, and anything the formatter cannot fix fails the check until the agent matches the conventions.',
        ruleLabel: 'Rule enforced',
        rule: 'ESLint + Prettier: project style or no merge',
      },
      {
        iconKey: 'Lock',
        accent: 'cyan',
        kicker: 'Gate 03 · Security',
        name: 'Security',
        attemptLabel: 'Agent tried',
        scenario: 'To "just make it work", the agent hardcodes an API key and builds a SQL query by gluing user input straight into the string.',
        attemptCode: "const KEY = 'sk_live_9f3a...'\ndb.query('SELECT * FROM users WHERE id=' + req.id)",
        verdict: 'BLOCKED',
        responseLabel: 'Guardrail response',
        response: 'Secret scanning catches the hardcoded key and SAST flags the injection-prone query. The commit is blocked before it ever reaches the branch.',
        ruleLabel: 'Rule enforced',
        rule: 'No secrets in code · parameterized queries only',
      },
      {
        iconKey: 'Layers',
        accent: 'emerald',
        kicker: 'Gate 04 · Architecture',
        name: 'Architecture',
        attemptLabel: 'Agent tried',
        scenario: 'Taking a shortcut, the agent calls the database directly from a UI component instead of going through the service layer.',
        attemptCode: "// components/UserCard.tsx\nimport { db } from '../db'\nconst rows = await db.query('SELECT ...')",
        verdict: 'BLOCKED',
        responseLabel: 'Guardrail response',
        response: 'The architecture boundary rule sees the UI layer reaching past the service layer into the DB and rejects it. The call has to go back through the defined layering.',
        ruleLabel: 'Rule enforced',
        rule: 'UI → Service → DB · no layer skipping',
      },
    ],

    loopKicker: 'And it compounds',
    loopHeading: 'The pipeline only ever gets stronger.',
    loopBody:
      'Here is the part that changes everything: every agent error is not just blocked — it is captured and encoded back into the pipeline as a permanent rule. The pipeline never shrinks. It grows with every mistake it has ever seen.',
    loopSteps: [
      'Agent executes',
      'Gate catches the error',
      'Error encoded as permanent rule',
      'Pipeline grows',
    ],
    loopBackNote: 'every error makes the next run safer',
    callout: 'Every agent error becomes a permanent gate. Humans never have to catch the same mistake twice — the pipeline only ever gets stronger.',
  },

  // sdlcRoles
  {
    type: 'sdlcRoles',
    title: 'Roles Reinvented',
    subtitle: 'Nobody is replaced. Everybody is promoted.',
    roles: [
      { icon: '🎯', oldRole: 'Product Owner', newRole: 'Outcome Owner', oneLiner: "Owns the 'what'; approves spec.md", stage: 'Stages 1, 6', accent: 'blue' },
      { icon: '🏛️', oldRole: 'Architect / Tech Lead', newRole: 'Governance Owner', oneLiner: 'Defines the Guardrails; interrogates the plan', stage: 'Stages 1–3', accent: 'violet' },
      { icon: '🔬', oldRole: 'Developer', newRole: 'Dev Orchestrator', oneLiner: 'Reviews agent PRs, edge cases, writes the guardrails', stage: 'Stages 4–5', accent: 'teal' },
      { icon: '🤖', oldRole: 'N/A', newRole: 'Autonomous Workforce', oneLiner: 'Drafts all artifacts; executes bounded tasks under guardrails', stage: 'Stages 2–7', accent: 'cyan' },
      { icon: '🔭', oldRole: 'SRE / DevOps', newRole: 'Intelligent Infrastructure Guardian', oneLiner: 'Guardian of self-healing infra and agent telemetry', stage: 'Stage 7', accent: 'emerald' },
      { icon: '🎨', oldRole: 'Designer', newRole: 'Creative Director', oneLiner: "Human taste, vibe, brand — what AI can't encode", stage: 'Stages 1–5', accent: 'amber' },
    ],
    coreShiftTitle: 'The Core Shift',
    coreShift: [
      { type: 'check', text: 'Value shifts from writing code to verifying and validating agent output.' },
      { type: 'check', text: 'The core skill becomes intent — define what software should do, verify it does.' },
      { type: 'check', text: 'Training focus shifts to understanding the problem (not syntax), AI system monitoring, and verification techniques.' },
      { type: 'warn', text: 'HITL is a mandatory checkpoint, not a rubber stamp.' },
    ],
  },

  // ── ACT 4 — IMPLEMENTED WITH SPEC-DRIVEN DEVELOPMENT ─────────────────────────

  // orchestrator
  {
    type: 'orchestrator',
    scrollable: true,
    kicker: 'ACT 4 · THE PATTERN',
    title: 'Humans Orchestrate. Agents Execute.',
    subtitle: 'Orchestration is not just parallelism — it is context architecture.',
    providers: [
      { id: 'copilot', name: 'GitHub Copilot', icon: '🔵', accent: 'blue', orchestratorModel: 'GPT 5.4', agentModel: 'GPT 5.2' },
      { id: 'cline', name: 'Cline', icon: '🤖', accent: 'indigo', orchestratorModel: 'Claude / GPT-5', agentModel: 'BYO model' },
      { id: 'continue', name: 'Continue (Local)', icon: '🟢', accent: 'green', orchestratorModel: 'GPT OSS 120B', agentModel: 'GPT OSS 7B' },
    ],
    orchestrator: {
      roleLabel: 'Governance Owner',
      tasks: ['Writes Cycle briefs', 'Spawns parallel agents', 'Sequences by dependency graph', 'Reviews results & merges'],
    },
    agents: [
      { roleLabel: 'Agent A', task: 'Backend tickets in worktree-a' },
      { roleLabel: 'Agent B', task: 'Frontend tickets in worktree-b' },
      { roleLabel: 'Agent C', task: 'Docs & config in worktree-c' },
    ],
    benefits: ['Clean main context', 'Parallel execution', 'Isolated worktrees'],
    callout: 'Same specs. Same guardrails. Any model.',
    withoutBeat: {
      kicker: 'BEAT 1 · WITHOUT ORCHESTRATION',
      title: 'Without orchestration, every task costs context.',
      body: 'When there is no separation of concerns, the main context does all the work: planning, executing, reviewing, debugging. It fills fast. Compaction kicks in. The project loses its memory.',
      trapReference: 'Remember slide 5 — The Compaction Trap',
      contextSteps: [
        'Feature 1 planned and executed in main context — context at 30%',
        'Bug triage + fix in same context — context at 55%',
        'Feature 2 kicked off — context at 75%, model summarises quietly',
        'Review and debugging — context compacted, early decisions forgotten',
        'Feature 3: AI no longer remembers the original architecture decisions',
        'The second feature is where most AI projects go to die.',
      ],
    },
    withBeat: {
      kicker: 'BEAT 2 · WITH ORCHESTRATION',
      title: 'With orchestration, agents carry the load.',
      body: 'The orchestrator holds the brief: vision, specs, dependency order, guardrails. Each agent receives a targeted handoff and executes in its own isolated context window. The main context barely moves.',
      agentLabels: ['Agent A', 'Agent B', 'Agent C'],
      agentTasks: [
        'Backend tickets\nworktree-a',
        'Frontend tickets\nworktree-b',
        'Docs & config\nworktree-c',
      ],
    },
    handoffBeat: {
      kicker: 'BEAT 3 · THE HANDOFF BRIEF',
      title: 'The agent gets exactly what it needs — no more.',
      body: 'The orchestrator does not hand over the full conversation history. It writes a targeted brief: the relevant spec, the ticket list, the acceptance criteria, the guardrails. The agent starts fresh with focused context.',
      briefItems: [
        'Relevant spec (scoped to this ticket set)',
        'Ticket list with acceptance criteria',
        'Guardrails and code standards',
        'Dependency references (API contracts, schema)',
      ],
      notIncluded: 'NOT included: the full conversation history, previous features, planning debates, or any context outside this agent\'s lane.\n\nThis is intentional — isolation is the mechanism.',
    },
    payoffBeat: {
      kicker: 'BEAT 4 · THE PAYOFF',
      title: 'Your main context stays coherent for the entire project.',
      body: 'Not just the first feature. Not just sprint one. The orchestrator holds the full picture — architecture, decisions, dependencies — because it never burned its memory on execution tasks.',
      callbackQuote: 'The second feature is where AI projects go to die.',
      resolution: 'With orchestration, there is no second-feature wall. Agents bear the context cost of execution. The main context stays long-lived, coherent, and in command — for as long as the project runs.',
      providerLine: 'Same specs. Same guardrails. Any model.',
    },
  },

  // specRot — capstone of the methodology act: name the enemy, show it defeated by construction
  {
    type: 'specRot',
    scrollable: true,
    kicker: 'ACT 4 · THE CAPSTONE',
    enemyLabel: 'SPEC ROT',
    enemySub: 'a.k.a. doc drift · design drift · the cousin of code rot',
    definition: 'The spec and the implementation slowly drift out of sync. Code keeps changing; the spec doesn’t. Inch by inch it goes from accurate, to misleading, to distrusted, to abandoned.',
    decayTitle: 'How a source of truth quietly dies',
    specTrackLabel: 'spec.md',
    codeTrackLabel: 'the code',
    stages: [
      { commits: '+0 commits', label: 'Born trusted — the single source of truth', trust: 100 },
      { commits: '+12 commits', label: 'Fix shipped in chat, never written back', trust: 70 },
      { commits: '+31 commits', label: 'Now misleading — people read the code instead', trust: 35 },
      { commits: '+47 commits', label: 'Abandoned — an agent fed it builds the wrong thing', trust: 10 },
    ],
    staleStamp: 'last updated · 47 commits ago',
    verdict: 'A rotted spec is worse than no spec.',
    verdictSub: 'It doesn’t just go silent — it actively misleads, and revives the Reverse Engineering Tax.',
    cureKicker: 'THE TURN',
    cureTitle: 'SDD makes rot impossible by construction',
    gates: [
      { icon: 'FileCheck', title: 'Spec-first gate', detail: 'The spec is updated before the code changes — never after.' },
      { icon: 'GitMerge', title: 'No spec, no merge', detail: 'Code can’t land without an approved, current spec.' },
      { icon: 'RefreshCw', title: 'Cycle summaries', detail: 'Every cycle closes by writing the spec back to live.' },
      { icon: 'ShieldCheck', title: 'Guardrails enforce it', detail: 'Drift is caught mechanically, not by goodwill.' },
    ],
    lockedLabel: 'spec ⟷ code · locked',
    payoff: 'The spec can’t silently go stale. The truth stays the truth.',
  },

  // ── ACT 5 — TOOLING & ADOPTION (slides 19–20) ────────────────────────────────

  // 19. tooling — SCROLLABLE · TABBED COMPARE · PIPELINE · MEMORY
  {
    type: 'tooling',
    scrollable: true,
    kicker: 'ACT 5 · THE TOOLING',
    title: 'Make It Real',
    subtitle: 'The methodology, tooled — pick a spec framework, enforce the guardrails, and let docs alongside specs become the project’s living memory.',
    scrollHint: 'Scroll through the toolchain',
    intro: {
      roadmap: [
        { id: '1', label: 'Spec Frameworks', accent: 'teal' },
        { id: '2', label: 'Guardrails', accent: 'violet' },
        { id: '3', label: 'Living Memory', accent: 'emerald' },
      ],
    },

    // ── PAGE 1 — SPEC FRAMEWORKS (4 tabs) ──
    specPage: {
      page: '1',
      accent: 'teal',
      label: 'Spec Frameworks',
      eyebrow: 'Where the truth is written.',
      dimensions: [
        'Spec approval gate',
        'TDD / guardrail enforcement',
        'Cycle summaries / memory',
        'ALM & tool sync (Jira / TFS)',
        'Model-agnostic',
        'License / openness',
      ],
      frameworks: [
        {
          id: 'spec-kit', glyph: '⚙️', name: 'Spec-Kit', short: 'Spec-Kit', role: 'The Backbone', accent: 'teal',
          tagline: 'Spec at the center; no code until the spec is approved.',
          whatItIs: "GitHub's open framework that puts a machine-readable spec at the center of the workflow and gates implementation on human approval.",
          bullets: ['spec.md is the contract', 'Human approval gate before code', 'Phase-driven workflow', 'Open source, vendor-neutral'],
          terminal: [
            { text: '$ specify init && specify spec --from PROJ-421', type: 'command' },
            { text: '✓ spec.md created — awaiting approval', type: 'success' },
            { text: '⛔ implementation blocked: spec.approved = false', type: 'error' },
          ],
          repo: 'github.com/github/spec-kit',
          cells: ['✓ Enforced gate', '~ Conventions', '✗', '~ Via scripts', '✓', '✓ OSS (MIT)'],
        },
        {
          id: 'openspec', glyph: '📐', name: 'OpenSpec', short: 'OpenSpec', role: 'The Proposal Flow', accent: 'teal',
          tagline: 'Change-as-proposal: every delta is a reviewed spec.',
          whatItIs: 'An open spec-driven approach where each change is authored as a proposal and approved before execution, keeping a reviewable history of intent.',
          bullets: ['Change = proposal', 'Reviewable spec history', 'Lightweight, repo-native', 'Open source, no API keys'],
          terminal: [
            { text: '$ openspec propose "add waitlist"', type: 'command' },
            { text: '✓ proposal/waitlist.md → review', type: 'success' },
            { text: '✓ approved → ready to implement', type: 'success' },
          ],
          repo: 'openspec.dev',
          cells: ['✓ Proposal → approve', '~ Spec-level', '~ Change history', '~ Via scripts', '✓', '✓ OSS'],
        },
        {
          id: 'autospec', glyph: '🧬', name: 'AutoSpec', short: 'AutoSpec', role: 'The Unifier', accent: 'teal', home: true,
          tagline: 'Spec gate + guardrails + living memory + ALM sync — one framework.',
          whatItIs: 'The framework this very deck is built with. It unifies the disciplines: the spec gate, guardrail/TDD enforcement, and docs kept alongside specs as long-term living memory, with skills that sync Jira / TFS.',
          bullets: ['Spec gate + role-based specs', 'Guardrails enforced, not suggested', 'Docs ⇄ specs = durable memory', 'Skills: Jira/TFS → spec → PR', 'Any model (FinOps routing)'],
          terminal: [
            { text: '$ autospec cycle start --from PROJ-421', type: 'command' },
            { text: '✓ spec.md gated · guardrails armed', type: 'success' },
            { text: '✓ cycle-12 summary will persist to docs/', type: 'success' },
          ],
          repo: 'github.com/Hundia/autospec',
          cells: ['✓ Gate + roles', '✓ Built-in guardrails', '✓ Docs ⇄ specs memory', '✓ Jira / TFS', '✓ Any model', '✓ OSS (Hundia/autospec)'],
        },
        {
          id: 'diy', glyph: '✍️', name: 'Write Your Own Spec', short: 'DIY', role: 'The DIY Path', accent: 'teal',
          tagline: 'No framework? Encode the discipline yourself.',
          whatItIs: "You don't need a product — you need the disciplines. A constitution.md, a spec template, a CI approval gate, and pre-commit guardrails reproduce most of the value.",
          bullets: ['constitution.md as your rules', 'spec template + PR approval gate', 'guardrails via CI / pre-commit', 'Full control, full maintenance'],
          terminal: [
            { text: '$ mkdir specs && touch constitution.md spec-template.md', type: 'command' },
            { text: '# CI: block merge unless spec.approved label', type: 'info' },
            { text: '# pre-commit: tests + lint + types = guardrails', type: 'info' },
          ],
          repo: 'your repo',
          cells: ['~ You define it', '~ DIY hooks', '~ Roll your own', '~ You wire it', '✓', 'n/a — your repo'],
        },
      ],
    },

    // ── PAGE 2 — SUPERPOWERS / GUARDRAILS (2 tabs) ──
    guardPage: {
      page: '2',
      accent: 'violet',
      label: 'Execution Discipline',
      eyebrow: 'Where the truth is protected.',
      thesis: 'The Guardrails are the Protection.',
      dimensions: [
        'No code before a failing test',
        'Enforced automatically (not advisory)',
        'Hooks into the agent loop',
        'Encodes every fix as a test',
        'Setup cost',
      ],
      frameworks: [
        {
          id: 'superpowers', glyph: '🦸', name: 'Superpowers', short: 'Superpowers', role: 'Guardrail Enforcement', accent: 'violet',
          tagline: 'Strict TDD for agents — no implementation before a failing test exists.',
          whatItIs: 'An execution-discipline layer that governs agent behavior during implementation: agents are prohibited from writing implementation code until a failing test exists.',
          bullets: ['Strict TDD, enforced on the agent', 'Blocks implementation without a red test', 'Plugs into the cycle loop', 'Turns every bug into a permanent test'],
          terminal: [
            { text: '$ superpowers cycle --task tasks.md#42', type: 'command' },
            { text: '⛔ No implementation without failing test', type: 'error' },
            { text: '✓ Test fails → OK to implement now', type: 'success' },
          ],
          repo: 'github.com/obra/superpowers',
          cells: ['✓ Enforced', '✓ Hard block', '✓ Cycle hooks', '✓ Regression tests', '~ Install + config'],
        },
        {
          id: 'diy-guard', glyph: '🛠️', name: 'Write Your Own Guardrails', short: 'DIY', role: 'The DIY Path', accent: 'violet',
          tagline: 'CI + pre-commit can enforce the same discipline you build yourself.',
          whatItIs: 'Reproduce the discipline with tooling you already own: pre-commit hooks, a CI gate that fails on missing tests, and an agent prompt contract that forbids untested code.',
          bullets: ['pre-commit: tests + lint + types', 'CI gate fails on coverage drop', 'Prompt contract: red test first', 'Full control, you maintain it'],
          terminal: [
            { text: '$ pre-commit install', type: 'command' },
            { text: '# CI: fail if new code lacks a failing-then-passing test', type: 'info' },
            { text: '✓ guardrails enforced in your pipeline', type: 'success' },
          ],
          repo: 'your repo',
          cells: ['~ If you wire it', '~ Via CI only', '~ Manual', '~ If disciplined', '~ DIY effort'],
        },
      ],
    },

    // ── PAGE 3 — LIVING MEMORY (Docs ⇄ Specs mapping) ──
    memoryPage: {
      page: '3',
      accent: 'emerald',
      label: 'The Living Memory',
      eyebrow: 'Where every decision is remembered.',
      headline: 'Docs alongside Specs = Living Memory.',
      syncBadge: 'specs/ ⇄ docs/',
      specHeading: 'Specs',
      docHeading: 'Docs',
      mappings: [
        { spec: 'specs/02-architect.md', doc: 'docs/architecture/', relation: 'defines' },
        { spec: 'specs/05-security.md', doc: 'docs/guardrails/', relation: 'enforces' },
        { spec: 'specs/07-flows.md', doc: 'docs/flows/', relation: 'describes' },
        { spec: 'specs/backlog.md', doc: 'docs/cycles/cycle-12.md', relation: 'records' },
      ],
      callout: 'The spec is the truth, the guardrails are the protection — and docs mapped to specs are the living memory. No context ever lost.',
    },

    // ── CLOSING HANDOFF ──
    closing: 'These are the tools that make the methodology real. Next: how to adopt them — Foundation → Expand → Optimize.',
  },

  // openSpec — SCROLLABLE · merged "What is OpenSpec" + "Anatomy of a Spec"
  {
    type: 'openSpec',
    variant: 'unified',
    scrollable: true,

    kicker: 'THE TOOL BEHIND THE DEMO',
    heroTitle: 'OpenSpec',
    heroSubtitle: 'Align humans and AI on what to build before any code — version control for intent.',
    scrollHint: 'See the loop, then a real spec',

    // Beat 1 — Propose → Apply → Archive loop
    loopKicker: 'ONE CALM LOOP',
    loopHeading: 'Propose → Apply → Archive',
    loopBody:
      'Every change flows through the same three steps. Propose the intent, apply the tasks, archive it as the new source of truth.',
    loopSteps: [
      { iconKey: 'FilePlus2',    label: 'Propose', command: '/opsx:propose add-mfl-telemetry', note: 'Creates the change folder', accent: 'teal' },
      { iconKey: 'Workflow',     label: 'Apply',   command: '/opsx:apply',                     note: 'Implements the tasks',     accent: 'violet' },
      { iconKey: 'CheckCircle2', label: 'Archive', command: '/opsx:archive',                   note: 'Becomes source of truth',  accent: 'emerald' },
    ],
    loopBackNote: 'Archived truth feeds the next change — brownfield-first, 1 → n',

    // Beat 2 — An example spec (the drone MFL requirement)
    folderLabel: 'openspec/changes/add-mfl-telemetry/',
    reqKicker: 'REQ-MFL-001',
    reqHeading: 'What a real spec looks like',
    reqBody:
      'A spec opens with a requirement anyone can read — no jargon, no ambiguity about what success means.',
    requirementBlock: `Requirement: MFL Telemetry Status

Each drone subsystem — camera, rotors, INS,
IMU, GPS, comms — MUST report its health as
OK / DEGRADED / FAIL on every telemetry cycle.`,
    scenarioBody:
      'Behavior comes as scenarios in plain conditional language. Humans read them like sentences; the agent reads them like tests.',
    scenarioBlock: `Scenario: Healthy subsystem
  WHEN the camera responds within the cycle
  THEN the MFL reports camera = OK

Scenario: Missed heartbeat
  WHEN the GPS misses its heartbeat
  THEN the MFL reports gps = FAIL`,
  },

  // demoIntro
  {
    type: 'demoIntro',
    scrollable: true,

    // HERO
    kicker: 'REQ-MFL-001 · LIVE DEMO',
    heroTitle: 'Game Of Drones',
    heroSubtitle: 'From Jira ticket to reviewed PR — with SDD.',
    heroTag: 'Ground Station · Drone Telemetry Platform',
    scrollHint: 'Follow the requirement — from filed ticket to shipped PR',

    // Beat 1 — The Project
    projectKicker: 'THE PROJECT',
    projectTitle: 'A Drone Telemetry Platform',
    projectBody:
      'An airborne drone. A ground crew. One radio link carrying everything they need to keep the flight safe. Every subsystem on board — managed independently, critical to airworthiness.',
    droneModules: [
      { iconKey: 'Cpu',      label: 'Main Computer', subLabel: 'Mission processor' },
      { iconKey: 'Camera',   label: 'Camera',        subLabel: 'Optical payload' },
      { iconKey: 'Wind',     label: 'Rotors',        subLabel: 'Propulsion' },
      { iconKey: 'Compass',  label: 'INS',           subLabel: 'Inertial Nav' },
      { iconKey: 'Activity', label: 'IMU',           subLabel: 'Motion sensing' },
      { iconKey: 'MapPin',   label: 'GPS',           subLabel: 'Geo-location' },
      { iconKey: 'Radio',    label: 'Comms',         subLabel: 'Datalink' },
    ],
    droneImageUrl: '/drone-anatomy.png',

    // Beat 2 — ICD / Communication
    commsKicker: 'THE ICD',
    commsTitle: 'Strict Message Types — No Free-Form',
    commsBody:
      'All data flows via an Interface Control Document (ICD): only pre-defined message types are permitted. Two messages run today. A third has just landed on the sprint board — and it touches every subsystem on the drone.',
    currentMessages: [
      { type: 'NAV',    accentKey: 'blue',  desc: 'Geo-location — lat / lon / alt / heading' },
      { type: 'STATUS', accentKey: 'teal',  desc: 'Battery level · time-in-air · system uptime' },
    ],
    newMessage: {
      type: 'MFL',
      accentKey: 'amber',
      desc: 'Module Functionality Log — per-subsystem operational health',
    },
    commsImageUrl: '/drone-comms.png',

    // Beat 3 — Requirement
    demandKicker: 'THE REQUIREMENT',
    demandTitle: 'REQ-MFL-001',
    demandBody:
      'Operators need to assess airworthiness in real time and respond to in-flight degradation. Every subsystem must report its operational status — OK, DEGRADED, or FAIL — on every telemetry cycle.',
    mflModules: [
      { id: 'camera', label: 'Camera' },
      { id: 'rotors', label: 'Rotors' },
      { id: 'ins',    label: 'INS' },
      { id: 'imu',    label: 'IMU' },
      { id: 'gps',    label: 'GPS' },
      { id: 'comms',  label: 'Comms' },
    ],
    mflPayloadSample: `{
  "type": "MFL",
  "timestamp": "2026-06-19T14:32:11Z",
  "modules": {
    "camera": "OK",
    "rotors": "OK",
    "ins":    "OK",
    "imu":    "DEGRADED",
    "gps":    "OK",
    "comms":  "FAIL"
  }
}`,
    scope: ['Backend', 'Frontend', 'Simulator'],

    // Beat 4 — Workflow
    workflowKicker: 'THE SDD PIPELINE',
    workflowTitle: 'Six Steps. One Spec. No Chaos.',
    workflowSteps: [
      {
        num: '01',
        label: 'Pull Jira Ticket',
        detail: 'Agent fetches REQ-MFL-001 via API key',
        icon: 'ClipboardList',
        accent: 'blue',
      },
      {
        num: '02',
        label: 'Create Spec',
        detail: 'OpenSpec generates a living spec from the requirement',
        icon: 'FileText',
        accent: 'violet',
      },
      {
        num: '03',
        label: 'Generate Code',
        detail: 'Agent implements backend · frontend · simulator',
        icon: 'Code2',
        accent: 'indigo',
      },
      {
        num: '04',
        label: 'HITL Review',
        detail: 'Human-in-the-Loop review gates the next step',
        icon: 'UserCheck',
        accent: 'teal',
      },
      {
        num: '05',
        label: 'Generate QA Tests',
        detail: 'Agent generates E2E tests from the spec',
        icon: 'FlaskConical',
        accent: 'emerald',
      },
      {
        num: '06',
        label: 'PR + AI Review',
        detail: 'AWS Bedrock Agent summarizes for dev + team lead',
        icon: 'GitPullRequest',
        accent: 'cyan',
      },
    ],

    // Beat 5 — Handoff
    handoffKicker: 'OVER TO YOU',
    handoffTitle: 'The Stage Is Yours.',
    handoffBody:
      'You know the rules. REQ-MFL-001 just entered the pipeline. Watch SDD close it.',
    handoffCallout: 'REQ-MFL-001 · Drone Telemetry Platform',
  },

  // finalTagline
  {
    type: 'finalTagline',
    title: 'The Agentic SDLC',
    tagline: 'The Spec is the Truth. The Guardrails are the Protection. The Human is the Judge.',
  },

  // ── CLOSE — finishing slides (returned to after the demos) ──────────────────────

  // adoption — SCROLLABLE · VISUAL JOURNEY
  {
    type: 'adoption',
    scrollable: true,
    title: 'Your SDD Adoption Journey',
    subtitle: 'From pilot repo to compounding team velocity — in 60 days',
    phases: [
      {
        number: '01',
        name: 'Foundation & Quick Wins',
        timeline: 'Week 1–2',
        claim: 'You prepare your AI co-pilot for real work.',
        color: 'emerald',
        capabilities: [
          { icon: 'Wrench', label: 'SDD Tool Setup', toolingLink: true },
          { icon: 'Zap', label: 'Superpowers Active' },
          { icon: 'Brain', label: 'Long-Term Memory', toolBadge: 'confluence' },
          { icon: 'FileCheck', label: 'Spec Before Code' },
          { icon: 'ShieldCheck', label: 'QA Regression Net', toolBadge: 'playwright' },
        ],
        terminalLines: [
          '✓ SDD tool installed on pilot repo',
          '✓ Superpowers active — 12 guardrail rules',
          '✓ docs/ seeded — architecture memory live',
          '✓ QA baseline: 0 → first spec committed',
          '→ AI co-pilot ready for real work',
        ],
        vignette: 'cockpit',
        milestone: 'First AI-generated PR that actually matches the spec',
      },
      {
        number: '02',
        name: 'Team Scale & Integration',
        timeline: 'Week 3–6',
        claim: 'You deploy the co-pilot across the whole team.',
        color: 'blue',
        capabilities: [
          { icon: 'Users', label: 'Full Team Onboard' },
          { icon: 'Tag', label: 'Ticket → Spec Pipeline', toolBadge: 'jira' },
          { icon: 'GitBranch', label: 'CI/CD Spec Gates', toolBadge: 'github' },
          { icon: 'Calendar', label: 'Review Cadence' },
          { icon: 'BarChart2', label: 'Defect Rate Tracked' },
        ],
        vignette: 'teamTopology',
        milestone: 'Sprint where AI closes 30%+ of tickets autonomously',
      },
      {
        number: '03',
        name: 'Optimize & Compound',
        timeline: 'Month 2–3',
        claim: 'The system learns and the gains compound.',
        color: 'violet',
        capabilities: [
          { icon: 'Search', label: 'Retrospec Audits' },
          { icon: 'Sliders', label: 'Guardrail Tuning' },
          { icon: 'BookOpen', label: 'Architecture Memory', toolBadge: 'confluence' },
          { icon: 'TrendingUp', label: 'Velocity Tracked' },
          { icon: 'RefreshCw', label: 'Quarterly Health Check' },
        ],
        vignette: 'compoundChart',
        milestone: 'Docs-as-memory: architecture never needs re-explained',
      },
    ],
    metrics: [
      { icon: '📈', value: '3×', label: 'ROI by Month 2', color: 'emerald' },
      { icon: '⚡', value: '60%', label: 'Faster first PR', color: 'teal' },
      { icon: '🛡️', value: '40%', label: 'Fewer defects', color: 'blue' },
      { icon: '🤝', value: '100%', label: 'Team on SDD', color: 'violet' },
    ],
    closingQuote: "Velocity compounds. Chaos doesn't.",
  },

  // closing — Your Launchpad (the final slide)
  {
    type: 'closing',
    title: 'Your Launchpad',
    subtitle: 'Everything we covered — bookmark it, then go build.',
    categories: [
      {
        label: 'Spec Frameworks',
        accent: 'emerald',
        icon: 'Compass',
        links: [
          { name: 'GitHub Spec Kit', url: 'https://github.com/github/spec-kit', note: 'Spec → Plan → Tasks → Implement' },
          { name: 'OpenSpec', url: 'https://github.com/Fission-AI/OpenSpec', note: 'Lightweight spec-driven workflow' },
          { name: 'AutoSpec', url: 'https://github.com/Hundia/autospec', note: 'This framework' },
        ],
      },
      {
        label: 'Agentic Tooling & CLIs',
        accent: 'blue',
        icon: 'Terminal',
        links: [
          { name: 'GitHub Copilot', url: 'https://github.com/features/copilot', note: 'AI pair programmer' },
          { name: 'Copilot CLI', url: 'https://github.com/github/copilot-cli', note: 'Copilot in your terminal' },
          { name: 'Superpowers', url: 'https://github.com/obra/superpowers', note: 'Agentic skills methodology' },
        ],
      },
      {
        label: 'Skills & Guides',
        accent: 'cyan',
        icon: 'Sparkles',
        links: [
          { name: 'Spec Kit Docs', url: 'https://github.github.com/spec-kit/', note: 'Getting started guide' },
          { name: 'Spec-Driven w/ AI', url: 'https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/', note: 'The GitHub Blog intro' },
        ],
      },
      {
        label: 'AutoSpec Ecosystem',
        accent: 'violet',
        icon: 'Rocket',
        links: [
          { name: 'AutoSpec Docs', url: 'https://hundia.github.io/autospec', note: 'Methodology & guides' },
          { name: 'AutoDeck', url: 'https://github.com/Hundia/AutoDeck', note: 'This deck, open source' },
          { name: 'EasyDeck', url: 'https://github.com/Hundia/EasyDeck', note: 'Deck builder' },
        ],
      },
    ],
    tagline: 'From intent to steering.',
  },
];
