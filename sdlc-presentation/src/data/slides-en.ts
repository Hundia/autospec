export const slidesEN = [
  // ── ACT 1 — THE PROBLEM (slides 1–7) ────────────────────────────────────────

  // 1. title
  {
    type: 'title',
    title: 'The Agentic SDLC',
    subtitle: 'Spec-Driven Development at Enterprise Scale',
    tagline: 'Agents execute. Humans govern.',
    presenter: 'Eli Hundia',
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
        description: 'Feature cycles measured in hours or days, not weeks. Agents execute; humans govern. Speed is the output of structure.',
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
        description: 'Without strong governance, HITL becomes rubber-stamping. Agentic execution + structured specs + enforced governance.',
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

  // 12. sixStages — SCROLLABLE
  {
    type: 'sixStages',
    scrollable: true,
    title: 'The 6 Stages of the Agentic SDLC',
    subtitle: 'Scroll down — every stage is a gate',
    stages: [
      {
        number: 1,
        emoji: '🔍',
        name: 'Intent & Discovery',
        tag: 'Specify & Clarify',
        owner: 'Product Owner',
        hero: true,
        accent: 'blue',
        bullets: [
          'High-fidelity spec.md defines the problem only — not implementation.',
          'GenAI turns unstructured inputs (conversations, Jira tickets) into clear requirements.',
          'Anti-spec-rot: spec.md is version-controlled, updated before code changes.',
          'No agent may begin implementation until the PO formally approves the spec.',
        ],
        output: 'spec.md — the single source of truth',
      },
      {
        number: 2,
        emoji: '⚖️',
        name: 'Alignment & Constraints',
        tag: 'The Constitution',
        owner: 'Architect + PO',
        hero: false,
        accent: 'violet',
        bullets: [
          "The project's laws: tech stack, security protocols, architecture standards.",
          'These constraints form the base of the Harness — agents cannot suggest out-of-spec architectures.',
          'Includes SSDLC requirements and guardrails as hard-coded bounds.',
          'Most expensive decisions to change later — invest upfront.',
        ],
        output: 'constitution.md / constraint set injected into every agent',
      },
      {
        number: 3,
        emoji: '🗺️',
        name: 'Design & Planning',
        tag: 'Plan & Tasks',
        owner: 'Architect + Team Lead',
        hero: false,
        accent: 'emerald',
        bullets: [
          'Agents produce plan.md (technical strategy) and tasks.md (granular, testable units).',
          'Senior engineers interrogate the plan — not write it — focusing on legacy constraints, security, blast radius.',
          'Team Lead approves the implementation map before any code.',
          'Each task independently testable — this is what makes Bolts possible.',
        ],
        output: 'plan.md + tasks.md',
      },
      {
        number: 4,
        emoji: '⚡',
        name: 'Execution & Verification',
        tag: 'Implement (Bolts)',
        owner: 'Developer (HITL)',
        hero: true,
        accent: 'indigo',
        bullets: [
          'Agents implement tasks in small, testable units — hours, not weeks.',
          'TDD-enforced: no implementation before a failing test exists.',
          'Every agent error encoded as a permanent harness test — it cannot recur.',
          'Developer = Quality Orchestrator: reviews agent PRs, edge cases, maintains harness.',
          'Agents run in secure sandboxes (isolated containers / dynamic sessions).',
        ],
        output: 'Merged, verified code',
      },
      {
        number: 5,
        emoji: '🧪',
        name: 'Testing & QA',
        tag: 'Quality Bolts',
        owner: 'QA Developer (HITL)',
        hero: false,
        accent: 'cyan',
        bullets: [
          "Agents implement test cases aligned to the spec's acceptance criteria.",
          'Test spec defines the AC only — not implementation details.',
          'AI code review: 38.7% of AI review comments drive real fixes (Atlassian 2026).',
          'QA Developer reviews agent test PRs and maintains the quality harness.',
        ],
        output: 'E2E + regression suites bound to spec ACs',
      },
      {
        number: 6,
        emoji: '📝',
        name: 'Summarization: Bolt Close',
        tag: 'Memory Layer',
        owner: 'Dev Team',
        hero: true,
        accent: 'teal',
        bullets: [
          'Every Bolt closes with a summary: what was built, what changed, what was decided.',
          'Release notes, linked documentation, modified files, closing commit — all in one artifact.',
          'The next agent reads the summary and inherits full context in 30 seconds — no reverse engineering.',
          'Any provider, any session, any team member picks up exactly where you left off.',
          'The summary is the memory that AI was never given.',
        ],
        output: 'bolts/bolt-X/summary.md — permanent knowledge, zero context loss',
      },
      {
        number: 7,
        emoji: '📡',
        name: 'Continuous Steering',
        tag: 'Observability Loop',
        owner: 'SRE / DevOps',
        hero: false,
        accent: 'orange',
        bullets: [
          "Agents monitor real telemetry against the spec's intended behavior; drift triggers alerts or a self-correction Bolt.",
          'SRE agents proactively open issues on anomalies; GenAI writes incident summaries.',
          'CI/CD remains constant — DevOps discipline carries into the agentic world.',
          'All agent communications logged for audit.',
        ],
        output: 'A system that steers itself back to spec',
      },
    ],
    closingCallout: "Compress, don't skip. The linear SDLC is collapsing into a compressed Design-&-Experiment loop — the discipline of each stage remains; only the clock changes.",
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
      { icon: '🤖', oldRole: 'N/A', newRole: 'Autonomous Workforce', oneLiner: 'Drafts all artifacts; executes bounded tasks under guardrails', stage: 'Stages 2–6', accent: 'cyan' },
      { icon: '🔭', oldRole: 'SRE / DevOps', newRole: 'Infrastructure Guardian', oneLiner: 'Guardian of self-healing infra and agent telemetry', stage: 'Stage 6', accent: 'emerald' },
      { icon: '🎨', oldRole: 'Designer', newRole: 'Creative Director', oneLiner: "Human taste, vibe, brand — what AI can't encode", stage: 'Stages 1–5', accent: 'amber' },
    ],
    coreShiftTitle: 'The Core Shift',
    coreShift: [
      { type: 'check', text: 'Value shifts from writing code to verifying and validating agent output.' },
      { type: 'check', text: 'The core skill becomes intent — define what software should do, verify it does.' },
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
        artifact: 'sprints/bolt-X/summary.md',
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

  // 16. pipeline — SCROLLABLE
  {
    type: 'pipeline',
    scrollable: true,
    title: 'The Agentic SDLC Pipeline',
    subtitle: 'From intent to steering — scroll the whole loop',
    pipelineCallout: 'The team that governs before coding ships faster than the team that codes before thinking. The Bolt summary ensures no knowledge is ever lost.',
    steps: [
      {
        number: '01',
        title: 'Capture Intent',
        subtitle: "GenAI distills conversations + tickets into a high-fidelity problem-only spec.md.",
        time: '1–2 hours',
        output: 'spec.md',
        hero: false,
        accentColor: 'blue',
      },
      {
        number: '02',
        title: 'Write the Constitution',
        subtitle: 'Stack, security, architecture laws; injected into every agent as hard bounds.',
        time: '1 hour',
        output: 'constitution.md',
        hero: false,
        accentColor: 'violet',
      },
      {
        number: '03',
        title: 'Spec Approval Gate',
        subtitle: 'HITL: the Product Owner approves; agents are mechanically blocked until spec.approved = true.',
        time: '30 min',
        output: 'Approved spec',
        hero: false,
        accentColor: 'rose',
      },
      {
        number: '04',
        title: 'Plan & Tasks',
        subtitle: 'Agents derive plan.md + tasks.md; seniors interrogate the plan.',
        time: '1 hour',
        output: 'plan.md, tasks.md',
        hero: false,
        accentColor: 'emerald',
      },
      {
        number: '05',
        title: 'Bolt Execution',
        subtitle: 'TDD-enforced agents implement independently-testable tasks in parallel worktrees. Hours, not weeks.',
        time: '2–6 hours',
        output: 'Working code',
        hero: true,
        accentColor: 'indigo',
      },
      {
        number: '06',
        title: 'Harness Verification',
        subtitle: 'Tests, linters, types, AI code review; every failure becomes a permanent test.',
        time: 'continuous',
        output: 'Green harness',
        hero: false,
        accentColor: 'cyan',
      },
      {
        number: '07',
        title: 'QA Bolts',
        subtitle: "QA agents build E2E suites from the spec's acceptance criteria.",
        time: '1–2 hours',
        output: 'Test suites',
        hero: false,
        accentColor: 'green',
      },
      {
        number: '08',
        title: 'Human Review',
        subtitle: 'The Outcome Owner validates on preprod; approve or request changes. Human judgment before production.',
        time: '1 hour',
        output: 'Approval',
        hero: false,
        accentColor: 'amber',
      },
      {
        number: '09',
        title: 'Summarization: Bolt Close',
        subtitle: 'Generate the Bolt summary: release notes, linked docs, modified files, closing commit. This is the magic — the next agent inherits everything.',
        time: '5 min',
        output: 'summary.md',
        hero: true,
        accentColor: 'teal',
      },
      {
        number: '10',
        title: 'Continuous Steering',
        subtitle: 'Observability agents compare telemetry to spec intent; drift opens a self-correction Bolt. The system steers itself.',
        time: 'always on',
        output: 'Self-steering system',
        hero: false,
        accentColor: 'orange',
      },
    ],
  },

  // 17. sprintMemorySlide
  {
    type: 'sprintMemorySlide',
    title: 'Summarization: The Memory Layer',
    subtitle: 'The handoff document that never existed before',
    summary: {
      command: '> /bolt-close',
      progress: 'Closing Bolt 11... Generating summary...',
      result: '✓ bolts/bolt-11/summary.md created',
      sections: [
        { label: 'Release Notes', color: 'blue', items: ['Added JWT auth with refresh tokens', 'Login page with OTP', '3 new API endpoints'] },
        { label: 'Linked Documentation', color: 'violet', items: ['docs/auth/01-architecture.md', 'docs/auth/02-jwt-flow.md', 'docs/frontend/03-login-page.md'] },
        { label: 'Files Modified', color: 'green', items: ['+ src/auth/auth.service.ts', '+ src/auth/auth.guard.ts', '~ src/pages/Login.tsx', '... 12 more'] },
        { label: 'Closing Commit', color: 'amber', items: ['a3f7c21 feat(bolt-11): auth + login'] },
      ],
    },
    benefits: [
      { icon: '⚡', title: 'Instant Context', description: 'Agent reads summary → Full context in 30 seconds' },
      { icon: '🔍', title: 'Bolt Comparison', description: 'Compare Bolt 3 vs Bolt 7 → See exactly what changed' },
      { icon: '🚫', title: 'No Code Reading', description: 'Everything linked — no reverse engineering needed' },
      { icon: '🤝', title: 'Perfect Handoff', description: 'Any agent, any provider, picks up where you left off' },
    ],
    callout: 'The summary is the memory that AI was never given.',
  },

  // 18. orchestrator
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
    subtitle: 'Three phases — scroll through the rollout',
    phases: [
      {
        number: '01',
        emoji: '🗓',
        name: 'Phase 1 — Foundation',
        accent: 'blue',
        bullets: [
          'Sandboxes + telemetry + secure gateways; start on non-critical repetitive paths.',
          'Build the Harness (tests / linters / types).',
          'Pilot Spec-Kit on one team.',
        ],
      },
      {
        number: '02',
        emoji: '📈',
        name: 'Phase 2 — Expand',
        accent: 'violet',
        bullets: [
          'AI code review for all teams — measure defect escape rates.',
          'Jira + Confluence as Context Hubs.',
          'Observability agents in production.',
          '⚠ Train developers in prompting, AI monitoring, verification — the skill shift matters as much as the tooling shift.',
        ],
      },
      {
        number: '03',
        emoji: '🚀',
        name: 'Phase 3 — Optimize',
        accent: 'emerald',
        bullets: [
          'Full Bolt cadence — hours for bounded tasks.',
          'Measure ROI; continuously grow the Harness.',
          '"Pioneer" teams gain speed AND quality (PwC 2026).',
        ],
      },
    ],
    metricsTitle: 'ROI Metrics',
    metrics: [
      {
        icon: '📝',
        title: 'Velocity',
        accent: 'blue',
        items: ['Story points per Bolt', 'Bolt cycle time', 'Feature throughput'],
      },
      {
        icon: '🛡',
        title: 'Quality',
        accent: 'green',
        items: ['Defect escape rate', 'MTTR', 'HITL approval rate'],
      },
      {
        icon: '🚀',
        title: 'Speed',
        accent: 'violet',
        items: ['Time-to-market', 'Infra cost delta', 'Deploy frequency'],
      },
      {
        icon: '👥',
        title: 'People',
        accent: 'amber',
        items: ['Developer satisfaction', 'Onboarding time', 'Spec approval cycle time'],
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
      docs: 'hundia.github.io/autospec/#/presentation',
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
