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

  // 2. eraTraditional
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

  // 5. contextPoisoning (The Compaction Trap)
  {
    type: 'contextPoisoning',
    kicker: 'CONTEXT WINDOW · 98% FULL',
    title: 'The Compaction Trap',
    subtitle: 'When the context window fills, the agent summarizes the conversation to keep going — and silently deletes the decisions it was built on.',
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
    verdict: {
      agentLine: 'Adding MongoDB for the activity feed — documents fit better here.',
      dagger: "It isn't confused. It can't see what it lost.",
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

  // ── ACT 2 — TURNING POINT (slides 8–9) ────────────────────────────────────────

  // 8. sddCostOfChaos
  {
    type: 'sddCostOfChaos',
    kicker: 'DIAGNOSIS',
    title: 'The Cost of No Specifications',
    reframe: {
      myth: 'The AI forgot everything.',
      truth: 'You never gave it memory.',
    },
    findings: [
      { label: 'Session #51 — starting over', cause: 'NO PERSISTENT MEMORY' },
      { label: 'Turn 30 — context corrupts', cause: 'NO EXTERNAL ANCHOR' },
      { label: 'Agent B — starts from zero', cause: 'NO SHARED DOCUMENT' },
    ],
    crystal: {
      word: 'SPECIFICATION',
      definition: 'The memory you never gave it.',
    },
  },

  // 9. bridge
  {
    type: 'bridge',
    title: 'What if...',
    question: 'What if the SDLC itself was rebuilt for agents?',
    points: [
      'What if no agent could write code before a human approved the spec?',
      'What if every agent error became a permanent guardrail?',
      'What if speed was the output of structure — not shortcuts?',
    ],
  },

  // 10. sddThreePillars — SDD DECLARATION (moved here from Act 4; defines the system before all methodology slides)
  {
    type: 'sddThreePillars',
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

  // 11. notVibeCoding
  {
    type: 'notVibeCoding',
    title: 'This Is Not Vibe Coding',
    subtitle: 'Governance is the difference',
    left: {
      label: 'Vibe Coding',
      accent: 'red',
      items: [
        'Solo dev prompting to a prototype',
        'No audit trail',
        'Decisions evaporate with the chat',
        'Quality = luck',
      ],
    },
    right: {
      label: 'Governed AI Development',
      accent: 'green',
      items: [
        'Specs, guardrails, audit trails',
        'Human checkpoints at every gate',
        'Every output traceable',
        'Every agent error becomes a permanent test case',
      ],
    },
    callout: 'The difference is accountability.',
  },

  // 12. agentic5Acts — SCROLLABLE
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

  // 13. harness
  {
    type: 'harness',
    title: 'Guardrail Engineering',
    subtitle: 'Automated protection that grows stronger with every agent error',
    loopSteps: [
      'Agent acts',
      'Guardrails check',
      'Error caught',
      'Encoded as permanent test',
      'Guardrails grow',
    ],
    layers: [
      { icon: '✅', title: 'Tests (TDD-enforced)', description: 'No implementation without a failing test. Every agent error becomes a test case.', accent: 'green' },
      { icon: '🔍', title: 'Linters & Static Analysis', description: 'Code style, security patterns, anti-patterns caught before merge.', accent: 'blue' },
      { icon: '🔷', title: 'Type Systems', description: 'Types constrain what agents can generate — catching errors before runtime.', accent: 'violet' },
      { icon: '⚖️', title: 'Constitution Constraints', description: 'Stack, security, architecture bounds injected into every agent context.', accent: 'amber' },
    ],
    callout: 'Every agent error becomes a permanent test case. The guardrails only ever get stronger.',
  },

  // 14. sdlcRoles
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
    title: 'Humans Orchestrate. Agents Execute.',
    subtitle: 'Same specs. Same guardrails. Any model.',
    providers: [
      { id: 'claude', name: 'Claude Code', icon: '🟣', accent: 'indigo', orchestratorModel: 'Opus 4.6', agentModel: 'Sonnet 4.6' },
      { id: 'copilot', name: 'GitHub Copilot', icon: '🔵', accent: 'blue', orchestratorModel: 'GPT 5.4', agentModel: 'GPT 5.2' },
      { id: 'gemini', name: 'Gemini', icon: '🟡', accent: 'amber', orchestratorModel: 'Gemini Ultra', agentModel: 'Gemini Pro' },
      { id: 'local', name: 'Continue (Local)', icon: '🟢', accent: 'green', orchestratorModel: 'GPT OSS 120B', agentModel: 'GPT OSS 7B' },
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
  },

  // ── ACT 5 — TOOLING & ADOPTION (slides 19–20) ────────────────────────────────

  // 19. tooling — SCROLLABLE · TABBED COMPARE · PIPELINE · MEMORY
  {
    type: 'tooling',
    scrollable: true,
    kicker: 'ACT 5 · THE TOOLING',
    title: 'Make It Real',
    subtitle: 'The methodology, tooled — pick a spec framework, enforce the guardrails, and close the loop from ticket to PR.',
    scrollHint: 'Scroll through the toolchain',
    intro: {
      roadmap: [
        { id: '1', label: 'Spec Frameworks', accent: 'teal' },
        { id: '2', label: 'Guardrails', accent: 'violet' },
        { id: '3', label: 'Ticket → PR', accent: 'cyan' },
        { id: '4', label: 'Long-Term Memory', accent: 'emerald' },
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
        'ALM & tool sync (Jira/Confluence)',
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
          tagline: 'Spec gate + guardrails + cycle memory + ALM sync — one framework.',
          whatItIs: 'The framework this very deck is built with. It unifies the disciplines: the spec gate, guardrail/TDD enforcement, cycle summaries as long-term memory, and skills that sync Jira/TFS and Confluence.',
          bullets: ['Spec gate + role-based specs', 'Guardrails enforced, not suggested', 'Cycle summaries = durable memory', 'Skills: Jira/TFS → spec → PR', 'Any model (FinOps routing)'],
          terminal: [
            { text: '$ autospec cycle start --from PROJ-421', type: 'command' },
            { text: '✓ spec.md gated · guardrails armed', type: 'success' },
            { text: '✓ cycle-12 summary will persist to docs/', type: 'success' },
          ],
          repo: 'github.com/Hundia/autospec',
          cells: ['✓ Gate + roles', '✓ Built-in guardrails', '✓ Cycle summaries', '✓ Jira / TFS / Confluence', '✓ Any model', '✓ OSS (Hundia/autospec)'],
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

    // ── PAGE 3 — TICKET → PR PIPELINE ──
    pipelinePage: {
      page: '3',
      accent: 'cyan',
      label: 'The Killer Integration',
      eyebrow: 'Where it connects to the work you already track.',
      headline: 'One Skill. Ticket → Merged PR.',
      source: { id: 'PROJ-421', title: 'Add waitlist to bookings', status: 'In Progress' },
      stages: [
        { n: '1', verb: 'Pull', sub: 'requirement → context' },
        { n: '2', verb: 'Spec', sub: 'generate spec.md, await gate' },
        { n: '3', verb: 'Execute', sub: 'agent implements in worktree' },
        { n: '4', verb: 'Test', sub: 'guardrails: TDD, lint, types' },
        { n: '5', verb: 'Open PR', sub: 'branch pushed, Jira updated' },
      ],
      terminal: [
        { text: '$ autospec skill run jira-to-pr --ticket PROJ-421', type: 'command' },
        { text: '→ pull       PROJ-421 "Add waitlist to bookings"', type: 'info' },
        { text: '→ spec       spec.md drafted · gate: approved ✓', type: 'info' },
        { text: '→ execute    agent implementing in worktree-a…', type: 'info' },
        { text: '→ test       12 passed · lint ✓ · types ✓', type: 'info' },
        { text: '→ pr         opened #318 → main · PROJ-421 → In Review ✓', type: 'info' },
        { text: '✓ ticket → merged PR, fully traceable', type: 'success' },
      ],
      callout: 'One skill closes the loop — and writes its summary back to memory.',
    },

    // ── PAGE 4 — LONG-TERM MEMORY ──
    memoryPage: {
      page: '4',
      accent: 'emerald',
      label: 'The Memory You Never Gave It',
      eyebrow: 'Where every decision is remembered.',
      headline: 'Confluence + docs/ = Long-Term Memory.',
      syncBadge: 'Confluence ⇄ docs/',
      bullets: [
        'Agents read it before they write — architecture, guardrails, and past decisions become live constraints.',
        'It grows every cycle — each cycle summary appends new folders and decision records.',
        'Nothing is re-derived — the memory you never gave it, finally given.',
      ],
      tree: [
        { name: 'docs/', depth: 0, icon: '📁' },
        { name: 'architecture/', depth: 1, icon: '📁', files: ['01-system.md', '02-decisions.md'] },
        { name: 'guardrails/', depth: 1, icon: '📁', files: ['01-tdd.md', '02-security.md'] },
        { name: 'flows/', depth: 1, icon: '📁', files: ['01-ticket-to-pr.md'] },
        { name: 'cycles/', depth: 1, icon: '📁', files: ['cycle-10/', 'cycle-11/', 'cycle-12/ ← new'] },
      ],
      treeFooter: '+1 cycle summary written back, every loop',
      callout: 'The spec is the truth, the guardrails are the protection, and the docs are the memory — no context ever lost.',
    },

    // ── CLOSING HANDOFF ──
    closing: 'These are the tools that make the methodology real. Next: how to adopt them — Foundation → Expand → Optimize.',
  },

  // 20. adoption — SCROLLABLE · VISUAL JOURNEY
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

  // ── ACT 6 — CLOSE (slides 21–22) ──────────────────────────────────────────────

  // 21. closing
  {
    type: 'closing',
    title: 'Start Your First Cycle',
    install: 'git clone https://github.com/Hundia/autospec my-project',
    commands: [
      { cmd: 'Pick one bounded, non-critical feature', desc: 'your pilot' },
      { cmd: 'Write spec.md and get it approved', desc: 'the gate comes first' },
      { cmd: 'Let AI execute it under guardrails', desc: 'TDD-enforced, guardrail-verified' },
      { cmd: '/cycle-close', desc: 'the summary is the memory' },
    ],
    links: {
      github: 'github.com/Hundia/autospec',
      docs: 'hundia.github.io/autospec',
    },
    tagline: 'From intent to steering.',
  },

  // 22. finalTagline
  {
    type: 'finalTagline',
    title: 'The Agentic SDLC',
    tagline: 'The Spec is the Truth. The Guardrails are the Protection. The Human is the Judge.',
  },
];
