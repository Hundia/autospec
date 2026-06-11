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
  },

  // 4. eraAgentic
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

  // 6. reverseTax
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
  },

  // 7. breakingPoint
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
    bottomLine: 'Agentic development without governance is technical debt at AI speed.',
  },

  // ── ACT 2 — TURNING POINT (slides 8–9) ────────────────────────────────────────

  // 8. sddCostOfChaos
  {
    type: 'sddCostOfChaos',
    title: 'The Cost of No Specifications',
    subtitle: 'Agentic AI without specs is a liability, not an asset',
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
        title: 'Bolts, Not Sprints',
        description: 'A Bolt is a bounded, independently-testable feature cycle — spec-approved, agent-executed, harness-verified. Measured in hours or days, not weeks. Speed is the output of structure.',
        accent: 'blue',
      },
      {
        icon: '👁',
        title: 'Humans as Orchestrators',
        description: 'Engineers move from Executors (writing code) to Orchestrators — designing specs, reviewing agent output, maintaining the harness.',
        accent: 'violet',
      },
      {
        icon: '✍️',
        title: 'Governors & Reviewers',
        description: 'Without strong governance, HITL becomes rubber-stamping. Agentic execution + structured specs + enforced governance is what separates genuine oversight from theater.',
        accent: 'teal',
      },
      {
        icon: '🛡',
        title: 'The Harness is the Guardrail',
        description: 'Tests, linters, types, constraints agents cannot violate. Every agent error is encoded as a permanent test case.',
        accent: 'emerald',
      },
      {
        icon: '📄',
        title: 'The Spec is the Truth',
        description: 'No code before the spec is approved. Spec is version-controlled and updated before code changes. Kills spec rot.',
        accent: 'amber',
      },
    ],
    quote: 'The Spec is the Truth, the Harness is the Guardrail, and the Human is the Judge.',
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
      label: 'Governed Agentic SDLC',
      accent: 'green',
      items: [
        'Specs, harnesses, audit trails',
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
    subtitle: 'Five acts. One complete loop. No context ever lost.',
    closingCallout: 'Spec. Architect. Bolt. Remember. Steer. Five disciplines that collapse the clock — without skipping a single stage.',
    keyInsight: {
      headline: 'The Key Insight: Compress, Don\'t Skip',
      body: 'The traditional linear SDLC is collapsing — not being eliminated. AI is merging requirements, design, and development into a highly compressed, iterative "Design & Experiment" super-phase. Cross-functional teams move from idea to functional prototype in days or hours. The discipline of each stage still matters; only the clock changes.',
    },
    acts: [
      {
        number: 'I',
        name: 'SPECIFY',
        tagline: 'Before a single line of code exists, the truth is written.',
        stageRef: 'Stages 1–2',
        owners: ['Product Manager', 'Architect', 'Software System Engineer'],
        hero: false,
        accent: 'blue',
        bullets: [
          'GenAI distills unstructured inputs — conversations, Jira tickets, interviews — into a Requirement Paper or high-fidelity spec.md. Problem only; no implementation.',
          'The Product Manager approves before any agent may proceed. Anti-spec-rot: spec.md is version-controlled and updated before code changes.',
          'Project laws encoded as Instructions & Skills files: architecture patterns, design conventions, security standards.',
          'These constraints form the base of the Harness — hard bounds injected into every agent context, making non-compliant suggestions mechanically impossible.',
        ],
        output: 'spec.md / Requirement Paper + constitution.md + Instructions & Skills',
      },
      {
        number: 'II',
        name: 'ARCHITECT',
        tagline: 'The roadmap agents cannot deviate from.',
        stageRef: 'Stage 3',
        owners: ['Architect', 'Dev Team Lead', 'QA Team Lead (optional)'],
        hero: false,
        accent: 'emerald',
        bullets: [
          'Iterative conversation with a planning agent produces plan.md and granular tasks.md.',
          'Tasks are designed to be independently testable and decoupled where possible — enabling parallel agentic execution by design.',
          'An orchestrating agent assigns independent tasks to multiple specialist agents simultaneously.',
          'Senior engineers interrogate the plan, not write it — focusing on legacy constraints, security, blast radius.',
          'QA Team Lead shapes test architecture upfront: testability baked in before a single line is written.',
        ],
        output: 'plan.md + tasks.md (testable, parallelizable by design)',
      },
      {
        number: 'III',
        name: 'BOLT',
        tagline: 'Agents execute in hours under mechanical guardrails.',
        stageRef: 'Stages 4–5',
        owners: ['Developer (HITL)', 'QA Tech Lead'],
        hero: true,
        accent: 'indigo',
        bullets: [
          'Parallel agentic execution where tasks are decoupled — multiple agents in isolated worktrees tackle independent work simultaneously.',
          'Every implementation is grounded in the Specs .md files defined for the task. No free-form generation.',
          'All agent-generated code is reviewed by the Developer HITL before merge — without exception.',
          'TDD-enforced: no implementation before a failing test. Every agent error becomes a permanent harness test — it cannot recur.',
          'QA Tech Lead implements AND runs system tests based on scenarios in Feature Specs .md files. Every new test added to regression; full suite runs on every Bolt close.',
        ],
        output: 'Merged, HITL-reviewed, regression-green code',
      },
      {
        number: 'IV',
        name: 'REMEMBER',
        tagline: 'The memory that makes every next Bolt faster than the last.',
        stageRef: 'Stage 6',
        owners: ['Product Manager (HITL)', 'Dev Tech Lead (HITL)', 'QA Tech Lead (HITL)'],
        hero: true,
        accent: 'teal',
        bullets: [
          'Every Bolt closes with a development summary: what was built, what changed, what was decided — including the reasoning behind key technical choices.',
          'Reasoning captured: why an approach was chosen, alternatives considered, constraints encountered.',
          'Release notes, linked docs, modified files, closing commit — all in one artifact.',
          'The next agent reads the summary and inherits full context in 30 seconds — including the decision trail. No reverse engineering.',
        ],
        output: 'bolts/bolt-X/summary.md (with embedded reasoning log)',
      },
      {
        number: 'V',
        name: 'STEER',
        tagline: 'The system that corrects itself back to the spec.',
        stageRef: 'Stage 7',
        owners: ['SRE / DevOps'],
        hero: false,
        accent: 'orange',
        bullets: [
          'Observability agents monitor real-time telemetry against the spec\'s intended behavior — based on metrics and logs.',
          'Real-time scenario verification: agent behavior validated against Feature Requirements in the Specs .md files.',
          'Drift from spec intent triggers automated alerts or opens a self-correction Bolt automatically.',
          'SRE agents surface anomalies proactively; GenAI writes incident summaries tied to the relevant spec section.',
        ],
        output: 'A self-steering, spec-aligned production system',
      },
    ],
  },

  // 13. harness
  {
    type: 'harness',
    title: 'Harness Engineering',
    subtitle: 'The mechanical guardrail agents cannot violate',
    loopSteps: [
      'Agent acts',
      'Harness checks',
      'Error caught',
      'Encoded as permanent test',
      'Harness grows',
    ],
    layers: [
      { icon: '✅', title: 'Tests (TDD-enforced)', description: 'No implementation without a failing test. Every agent error becomes a test case.', accent: 'green' },
      { icon: '🔍', title: 'Linters & Static Analysis', description: 'Code style, security patterns, anti-patterns caught before merge.', accent: 'blue' },
      { icon: '🔷', title: 'Type Systems', description: 'Types constrain what agents can generate — catching errors before runtime.', accent: 'violet' },
      { icon: '⚖️', title: 'Constitution Constraints', description: 'Stack, security, architecture bounds injected into every agent context.', accent: 'amber' },
    ],
    callout: 'Every agent error becomes a permanent test case. The harness only ever gets stronger.',
  },

  // 14. sdlcRoles
  {
    type: 'sdlcRoles',
    title: 'Roles Reinvented',
    subtitle: 'Nobody is replaced. Everybody is promoted.',
    roles: [
      { icon: '🎯', oldRole: 'Product Owner', newRole: 'Outcome Owner', oneLiner: "Owns the 'what'; approves spec.md", stage: 'Stages 1, 6', accent: 'blue' },
      { icon: '🏛️', oldRole: 'Architect / Tech Lead', newRole: 'Governance Owner', oneLiner: 'Defines the Harness; interrogates the plan', stage: 'Stages 1–3', accent: 'violet' },
      { icon: '🔬', oldRole: 'Developer', newRole: 'Dev Orchestrator', oneLiner: 'Reviews agent PRs, edge cases, writes the harness', stage: 'Stages 4–5', accent: 'teal' },
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
        title: 'Bolt Summaries',
        description: 'Every Bolt closes with a summary: what was built, what changed, what was decided. The next agent starts with full context.',
        artifact: 'bolts/bolt-X/summary.md',
        icon: '📋',
        color: 'emerald',
      },
      {
        number: '03',
        title: 'Living Documentation',
        description: 'Docs grow with every task; the Constitution and architecture docs constrain future agents.',
        artifact: 'docs/ (grows every Bolt)',
        icon: '📖',
        color: 'cyan',
      },
    ],
  },

  // 16. orchestrator
  {
    type: 'orchestrator',
    title: 'Humans Orchestrate. Agents Execute.',
    subtitle: 'Same specs. Same harness. Any model.',
    providers: [
      { id: 'claude', name: 'Claude Code', icon: '🟣', accent: 'indigo', orchestratorModel: 'Opus 4.6', agentModel: 'Sonnet 4.6' },
      { id: 'copilot', name: 'GitHub Copilot', icon: '🔵', accent: 'blue', orchestratorModel: 'GPT 5.4', agentModel: 'GPT 5.2' },
      { id: 'gemini', name: 'Gemini', icon: '🟡', accent: 'amber', orchestratorModel: 'Gemini Ultra', agentModel: 'Gemini Pro' },
      { id: 'local', name: 'Continue (Local)', icon: '🟢', accent: 'green', orchestratorModel: 'GPT OSS 120B', agentModel: 'GPT OSS 7B' },
    ],
    orchestrator: {
      roleLabel: 'Governance Owner',
      tasks: ['Writes Bolt briefs', 'Spawns parallel agents', 'Sequences by dependency graph', 'Reviews results & merges'],
    },
    agents: [
      { roleLabel: 'Agent A', task: 'Backend tickets in worktree-a' },
      { roleLabel: 'Agent B', task: 'Frontend tickets in worktree-b' },
      { roleLabel: 'Agent C', task: 'Docs & config in worktree-c' },
    ],
    benefits: ['Clean main context', 'Parallel execution', 'Isolated worktrees'],
    callout: 'Same specs. Same harness. Any model.',
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
        subtitle: 'The Execution Discipline · Harness Enforcement',
        description: 'Dictates agent behavior during implementation. Strict TDD: agents are prohibited from writing implementation code before a failing test exists.',
        accent: 'violet',
        terminal: [
          { text: '$ superpowers bolt --task tasks.md#42', type: 'command' },
          { text: '⛔ No implementation without failing test', type: 'error' },
          { text: '✓ Test fails → OK to implement now', type: 'success' },
        ],
        valueTag: 'Enforces harness engineering automatically.',
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
          { text: '✓ 14 constraints injected into harness', type: 'success' },
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
          'Build the test/CI Harness: tests, linters, types — your first mechanical guardrails.',
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
          'Observability agents in production; first self-correction Bolts run automatically.',
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
          'Full Bolt cadence across all teams — bounded features spec-to-ship in hours.',
          'The Harness only gets stronger: every error encoded, every edge case immortalized as a test.',
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
        items: ['Bolt cycle time', 'Time-to-market', 'Deploy frequency'],
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
        items: ['Agent PRs per week', 'Harness coverage %', 'Parallel bolt ratio'],
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
    title: 'Start Your First Bolt',
    install: 'git clone https://github.com/Hundia/autospec my-project',
    commands: [
      { cmd: 'Pick one bounded, non-critical feature', desc: 'your pilot' },
      { cmd: 'Write spec.md and get it approved', desc: 'the gate comes first' },
      { cmd: 'Let agents bolt it under the harness', desc: 'TDD-enforced, sandboxed' },
      { cmd: '/bolt-close', desc: 'the summary is the memory' },
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
    tagline: 'The Spec is the Truth. The Harness is the Guardrail. The Human is the Judge.',
  },
];
