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
      { title: 'Context Poisoning', description: 'Extended sessions corrupt earlier decisions — the AI contradicts itself turn by turn' },
      { title: 'The Reverse Engineering Tax', description: 'Every session resets to zero — you pay the full rediscovery cost before every new feature' },
      { title: 'The Breaking Point', description: 'No documentation means no continuity — teams hit an invisible wall at the second feature' },
    ],
  },

  // 5. contextPoisoning
  {
    type: 'contextPoisoning',
    title: 'Context Poisoning',
    subtitle: "Long conversations don't just lose context — they actively corrupt it",
    stages: [
      { turn: 'Turn 1', status: 'Clean', color: 'green', snippet: 'Use PostgreSQL with Prisma ORM', description: 'Clear initial decisions' },
      { turn: 'Turn 25', status: 'Drift', color: 'yellow', snippet: "Actually, let's try MongoDB here...", description: 'Contradicting earlier choices' },
      { turn: 'Turn 50', status: 'Contradiction', color: 'orange', snippet: "Wait, we're using Prisma right?", description: 'Forgetting what was decided' },
      { turn: 'Turn 100', status: 'Chaos', color: 'red', snippet: 'TypeError: Cannot read undefined', description: 'Compounding errors from lost context' },
    ],
    chat: {
      windowTitle: 'AI Agent — project/database',
      messages: [
        { role: 'user', turn: 1, text: 'Set up the database layer. We want PostgreSQL with Prisma ORM for type-safe queries.' },
        { role: 'ai', turn: 1, text: "Great choice. I'll set up PostgreSQL with Prisma, define the schema, and generate the client. Creating schema.prisma..." },
        { role: 'user', turn: 25, text: 'The activity feed query is getting slow with all the joins. Any ideas?' },
        { role: 'ai', turn: 25, text: "For the activity feed, MongoDB would be a much better fit — documents map naturally to events. I'll add a Mongo connection for that collection.", flag: 'drift' },
        { role: 'user', turn: 50, text: "The activity feed is broken. I'm getting schema validation errors on every write." },
        { role: 'ai', turn: 50, text: "I see the problem — your Prisma models don't have an activityFeed relation. I'll add it to schema.prisma and run a migration.", flag: 'contradiction' },
        { role: 'user', turn: 100, text: "Now I'm getting TypeError: Cannot read properties of undefined on every DB call." },
        { role: 'ai', turn: 100, text: "The issue is the Prisma client isn't initialized. Let me add Mongoose for the relational tables too and unify everything under a single ODM layer.", flag: 'poisoned' },
        { role: 'user', turn: 100, text: "You just don't get it... you suck. I'm never using agentic development again, a waste of my time!", flag: 'frustrated' },
      ],
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
    title: 'The Cost of No Specifications',
    subtitle: 'AI-driven development without specs is a liability, not an asset',
    columns: {
      left: {
        label: 'With Conversation',
        color: 'red',
        items: [
          { icon: '💬', text: 'Context degrades after turn 30' },
          { icon: '🔄', text: 'Every session starts from zero' },
          { icon: '❌', text: 'Decisions lost when chat ends' },
          { icon: '🚫', text: 'No agent can continue your work' },
        ],
      },
      right: {
        label: 'With Specifications',
        color: 'green',
        items: [
          { icon: '📐', text: 'Decisions persisted in specs/' },
          { icon: '🔗', text: 'Any session inherits full context' },
          { icon: '✅', text: 'Choices survive forever in docs/' },
          { icon: '🤖', text: 'Any agent can continue seamlessly' },
        ],
      },
    },
    callout: 'Specifications are the memory that AI was never given.',
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

  // ── ACT 3 — THE AGENTIC SDLC METHODOLOGY (slides 10–14) ──────────────────────

  // 10. philosophy
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

  // ── ACT 4 — IMPLEMENTED WITH SPEC-DRIVEN DEVELOPMENT (slides 15–18) ─────────

  // 15. sddThreePillars
  {
    type: 'sddThreePillars',
    title: 'SDD: The Operating System of the Agentic SDLC',
    subtitle: 'The methodology runs on three artifacts',
    pillars: [
      {
        number: '01',
        title: 'Specs as Code',
        description: 'spec.md + the Constitution live in git. Stage 1–2 output, readable by any agent, approved by humans.',
        artifact: 'specs/*.md',
        icon: '📐',
        color: 'teal',
      },
      {
        number: '02',
        title: 'Cycle Summaries',
        description: 'Every Cycle closes with a summary: what was built, what changed, what was decided. The next agent starts with full context.',
        artifact: 'cycles/cycle-X/summary.md',
        icon: '📋',
        color: 'emerald',
      },
      {
        number: '03',
        title: 'Living Documentation',
        description: 'Docs grow with every task; the Constitution and architecture docs constrain future agents.',
        artifact: 'docs/ (grows every Cycle)',
        icon: '📖',
        color: 'cyan',
      },
    ],
  },

  // 16. orchestrator
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

  // 19. tooling
  {
    type: 'tooling',
    title: 'The Toolchain',
    subtitle: 'Each tool enforces one discipline',
    tools: [
      {
        icon: '⚙️',
        title: 'Spec-Kit',
        subtitle: 'The Workflow Backbone · github.com/github/spec-kit (2025, OSS)',
        description: 'Places the spec at the center of engineering. Agents cannot begin coding until humans mark the spec as approved.',
        accent: 'teal',
        terminal: [
          { text: '$ spec-kit gen spec --from PROJ-421', type: 'command' },
          { text: '✓ spec.md created — awaiting PO approval', type: 'success' },
          { text: '⛔ Coding blocked until: spec.approved = true', type: 'error' },
        ],
        valueTag: 'Eliminates vibe coding — forces documented intent.',
      },
      {
        icon: '🦸',
        title: 'Superpowers',
        subtitle: 'The Execution Discipline · Guardrail Enforcement',
        description: 'Dictates agent behavior during implementation. Strict TDD: agents are prohibited from writing implementation code before a failing test exists.',
        accent: 'violet',
        terminal: [
          { text: '$ superpowers cycle --task tasks.md#42', type: 'command' },
          { text: '⛔ No implementation without failing test', type: 'error' },
          { text: '✓ Test fails → OK to implement now', type: 'success' },
        ],
        valueTag: 'Enforces guardrail engineering automatically.',
      },
      {
        icon: '📋',
        title: 'Jira as Context Hub',
        subtitle: 'ALM · Visibility Layer',
        description: 'When spec.md or plan.md changes in the repo, agents auto-sync status to the Jira Epic — no manual status reports.',
        accent: 'blue',
        terminal: [
          { text: 'spec.md updated → agent sync', type: 'command' },
          { text: '→ PROJ-421: Status → "In Planning"', type: 'info' },
          { text: '✓ Non-technical stakeholders informed', type: 'success' },
        ],
        valueTag: 'Enterprise visibility without manual overhead.',
      },
      {
        icon: '📖',
        title: 'Confluence as Long-Term Memory',
        subtitle: 'ALM · Long-Term Memory',
        description: 'Agents read architecture docs to keep new code compliant — accumulated organizational knowledge constrains agent behavior.',
        accent: 'amber',
        terminal: [
          { text: 'agent context fetch --source confluence', type: 'command' },
          { text: '→ Loading: arch-decisions.md, security-standards.md', type: 'info' },
          { text: '✓ 14 constraints injected into guardrails', type: 'success' },
        ],
        valueTag: 'Source of truth in repo, visibility in Confluence.',
      },
    ],
  },

  // 20. adoption — SCROLLABLE
  {
    type: 'adoption',
    scrollable: true,
    title: 'Adoption Roadmap',
    subtitle: 'Three phases of compounding advantage',
    phases: [
      {
        number: '01',
        emoji: '🌱',
        name: 'Foundation',
        timeline: 'Weeks 1–6',
        win: 'Prove it works — on one team, with zero risk',
        milestone: 'First agent-authored PR merged to main — reviewed, green, shipped',
        accent: 'emerald',
        bullets: [
          'Stand up isolated agent sandboxes — telemetry, security gateways, zero production impact.',
          'Pilot Spec-Kit on one willing, non-critical team with a well-defined feature.',
          'Build the Guardrails: tests, linters, types — automated protection from day one.',
          'Define agent guardrails: what agents can and cannot touch.',
          '⚠ Governance muscle: teach the team HITL is a mandatory checkpoint, not a rubber stamp.',
        ],
      },
      {
        number: '02',
        emoji: '🔗',
        name: 'Expand',
        timeline: 'Month 2–5',
        win: 'Every team feels it — agents become part of the workflow',
        milestone: '80% of PRs reviewed by AI before a human opens them',
        accent: 'blue',
        bullets: [
          'AI code review on every PR, org-wide — measure defect escape rates, document the wins.',
          'Wire Jira + Confluence as agent context hubs: specs auto-sync, zero manual status reports.',
          'first self-correction Cycles run automatically.',
          '⚠ Train developers in prompting, AI monitoring, verification — the skill shift matters as much as the tooling shift.',
        ],
      },
      {
        number: '03',
        emoji: '🚀',
        name: 'Optimize',
        timeline: 'Month 6+',
        win: 'Compounding returns — the system gets faster the more you use it',
        milestone: 'Pioneer teams ship features in hours, not weeks — PwC 2026',
        accent: 'violet',
        bullets: [
          'Full Cycle cadence across all teams — bounded features spec-to-ship in hours.',
          'The Guardrails only get stronger: every error encoded, every edge case immortalized as a test.',
          'Reinvest velocity gains into harder problems — creative work only humans can do.',
          'Measure and publish compound ROI: cycle time, defect escape, developer satisfaction.',
        ],
      },
    ],
    metricsTitle: 'What to Measure',
    metrics: [
      {
        icon: '⚡',
        title: 'Velocity',
        accent: 'blue',
        items: ['Cycle time', 'Time-to-market', 'Deploy frequency'],
      },
      {
        icon: '🛡',
        title: 'Quality',
        accent: 'green',
        items: ['Defect escape rate', 'MTTR', 'Regression coverage'],
      },
      {
        icon: '🔗',
        title: 'Scale',
        accent: 'violet',
        items: ['Agent PRs per week', 'Guardrail coverage %', 'Parallel cycle ratio'],
      },
      {
        icon: '👥',
        title: 'People',
        accent: 'amber',
        items: ['Developer satisfaction', 'Onboarding time', 'HITL review time'],
      },
    ],
    closingQuote: 'Value shifts from writing code to verifying and validating code. The core skill becomes less about syntax and more about intent.',
    closingSource: 'Amplify Partners',
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
