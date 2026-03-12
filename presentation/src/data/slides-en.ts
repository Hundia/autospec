export const slidesEN = [
  // ── ACT 1 — PROBLEM ──────────────────────────────────────────────────────────

  // 1. title
  {
    type: 'title',
    title: 'AutoSpec',
    subtitle: 'From Requirements to Running Code',
    tagline: "Don't let AI think. Give it specs.",
    presenter: 'Eli Hundia',
  },

  // 2. threeEras — NEW (replaces eraTraditional + eraAssistant + eraAgentic)
  {
    type: 'threeEras',
    title: 'The Three Eras of Development',
    subtitle: 'From manual coding to autonomous agents — each era gained speed but lost something critical',
    eras: [
      {
        name: 'Traditional',
        period: '2000-2020',
        tools: ['Manual Coding', 'Code Reviews', 'Documentation'],
        traits: [
          { text: 'Every line written by hand', type: 'neutral' },
          { text: 'Comprehensive documentation', type: 'positive' },
          { text: 'Institutional memory preserved', type: 'positive' },
        ],
        verdict: 'Slow but predictable',
        color: 'slate',
      },
      {
        name: 'Code Assistants',
        period: '2021-2023',
        tools: ['GitHub Copilot', 'TabNine', 'Kite'],
        traits: [
          { text: '3x faster autocomplete', type: 'positive' },
          { text: 'Design decisions still human', type: 'neutral' },
          { text: 'Architecture unchanged', type: 'neutral' },
        ],
        verdict: 'Faster typing, same thinking',
        color: 'blue',
      },
      {
        name: 'Agentic AI',
        period: '2024+',
        tools: ['Claude Code', 'Cursor', 'Devin'],
        traits: [
          { text: 'Entire modules in one prompt', type: 'positive' },
          { text: 'No memory between sessions', type: 'negative' },
          { text: 'Zero documentation generated', type: 'negative' },
        ],
        verdict: 'Revolutionary power, dangerous autonomy',
        color: 'cyan',
      },
    ],
  },

  // 3. contextPoisoning
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
  },

  // 4. reverseTax
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

  // 5. breakingPoint
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
  },

  // ── ACT 2 — TURNING POINT ────────────────────────────────────────────────────

  // 6. sddCostOfChaos (moved from old position 10)
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

  // 7. bridge (moved from old position 8)
  {
    type: 'bridge',
    title: 'What if...',
    question: 'What if AI had all the context BEFORE it wrote a single line of code?',
    points: [
      'What if every decision was recorded, not just the code?',
      'What if new sessions inherited all previous knowledge?',
      'What if AI agents worked from specs, not conversations?',
    ],
  },

  // ── ACT 3 — THE REVEAL ───────────────────────────────────────────────────────

  // 8. pipeline (moved from old position 14)
  {
    type: 'pipeline',
    scrollable: true,
    title: 'The Full AutoSpec Pipeline',
    subtitle: 'From requirements to running code — review everything before you build',
    pipelineCallout: 'The developer who reviews before coding ships faster than the one who codes before thinking. The sprint summary ensures no knowledge is ever lost.',
    steps: [
      {
        number: '01',
        title: 'Write Requirements',
        subtitle: 'Capture your vision in a structured SRS document. Human intent recorded once, executed many times.',
        time: '1-2 hours',
        output: 'requirements.md',
        hero: false,
        accentColor: 'blue',
      },
      {
        number: '02',
        title: 'Generate Specs',
        subtitle: 'One prompt generates 10 role-based specification files. PM, Backend, Frontend, DB, QA, DevOps, Marketing, Finance, Business, UI — each writing from their expertise.',
        time: '5 minutes',
        output: 'specs/*.md (10 files)',
        hero: false,
        accentColor: 'violet',
      },
      {
        number: '03',
        title: 'Generate Documentation',
        subtitle: 'Architecture diagrams, API endpoints, database ERDs, flow charts, UI wireframes — all generated from specs before a single line of code is written.',
        time: '10 minutes',
        output: 'docs/ (50+ files)',
        hero: false,
        accentColor: 'emerald',
      },
      {
        number: '04',
        title: 'Generate Skills',
        subtitle: 'Environment-aware command files that work in any IDE. Sprint execution, ticket management, QA verification — all encoded as reusable skills.',
        time: '2 minutes',
        output: '.claude/commands/ (10 skills)',
        hero: false,
        accentColor: 'cyan',
      },
      {
        number: '05',
        title: 'Build & Review Viewer',
        subtitle: 'Before writing any code, review everything visually: architecture, backlog kanban, flows, mock screens. Agree on the design first — development needs zero interpretation.',
        time: '5 minutes',
        output: 'Viewer app (live dashboard)',
        hero: true,
        accentColor: 'amber',
      },
      {
        number: '06',
        title: 'Plan & Execute Sprints',
        subtitle: 'Opus orchestrator writes sprint briefs and spawns parallel Sonnet agents in isolated git worktrees. Each agent has full context from specs — no hallucination, no drift.',
        time: '2-4 hours/sprint',
        output: 'Working features + docs/',
        hero: false,
        accentColor: 'indigo',
      },
      {
        number: '07',
        title: 'QA + Living Updates',
        subtitle: 'Verification loop: build, test, fix, verify. Every ticket updates docs/, backlog, and sprint summaries. Knowledge compounds with every sprint.',
        time: '30 minutes',
        output: 'Verified code + updated docs/',
        hero: false,
        accentColor: 'green',
      },
      {
        number: '08',
        title: 'User Review',
        subtitle: 'The product owner tests the sprint deliverables on preprod. They click through new features, verify the UX matches expectations, and approve or request changes. Human judgment before production.',
        time: '1-2 hours',
        output: 'Approval or change requests',
        hero: false,
        accentColor: 'rose',
      },
      {
        number: '09',
        title: 'Sprint Close & Summary',
        subtitle: 'Run /sprint-close to generate a comprehensive sprint summary: release notes, linked documentation, modified files, closing commit. This is the magic — next time any agent touches this code, all context is right here.',
        time: '5 minutes',
        output: 'sprints/sprint-X/summary.md',
        hero: true,
        accentColor: 'teal',
      },
    ],
  },

  // 9. solution (moved from old position 12)
  {
    type: 'solution',
    title: 'AutoSpec: Your SDD Toolkit',
    subtitle: 'One prompt. Ten specs. Zero context loss.',
    capabilities: [
      { number: '01', title: '10 AI-Generated Specifications', description: 'One requirements document generates 10 role-based spec files — PM, Backend, Frontend, DB, QA, DevOps, and more.', artifact: '$ autospec init → specs/*.md', icon: '📐' },
      { number: '02', title: 'Orchestrated Sprint Execution', description: 'Opus PM agent coordinates Sonnet dev agents running in parallel git worktrees. Each agent has full context from specs.', artifact: 'Opus → [Agent A, B, C] → merge', icon: '🎯' },
      { number: '03', title: 'Living Knowledge System', description: 'Every ticket updates docs/, backlog, and sprint summaries. Knowledge compounds with every sprint.', artifact: 'docs/ (100+ files after Sprint 10)', icon: '📖' },
      { number: '04', title: 'Visual Reviewer (Viewer App)', description: 'A generated dashboard lets you review architecture, backlog kanban, flows, and mock screens visually — before writing any code. Agree on the design first.', artifact: 'viewer/ (React SPA)', icon: '👁️' },
    ],
    keyInsight: 'AutoSpec implements SDD so you can stop arguing about methodology and start shipping.',
  },

  // ── ACT 4 — ZOOM-INS ─────────────────────────────────────────────────────────

  // 10. roles
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
  },

  // 11. orchestrator (with multiagent parallelExecution merged in)
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
    parallelExecution: {
      description: 'Double your velocity with parallel AI agents',
      agents: [
        { name: 'Agent A', role: 'Backend Lead', tickets: ['1.1 - Create users table', '1.2 - Auth service', '1.4 - User API'], color: 'blue' },
        { name: 'Agent B', role: 'Frontend Lead', tickets: ['1.3 - Login form', '1.5 - Dashboard', '1.6 - Profile page'], color: 'green' },
      ],
      savings: '~45% time savings',
    },
  },

  // 12. modelOptimization
  {
    type: 'modelOptimization',
    title: 'Model Optimization',
    subtitle: "When specs are clear, you don't need the biggest model",
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
  },

  // 13. environmentProof
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
  },

  // ── ACT 5 — PROOF ────────────────────────────────────────────────────────────

  // 14. viewer
  {
    type: 'viewer',
    title: 'Live Viewer Dashboard',
    url: 'hundia.github.io/autospec/viewer',
    features: ['Specs Browser', 'Backlog Kanban', 'Living Docs'],
    linkText: 'Try it live →',
  },

  // 15. example
  {
    type: 'example',
    title: 'Real Example: ShopFlow E-Commerce',
    project: {
      name: 'ShopFlow',
      description: 'Full-stack e-commerce platform with payments, inventory, orders',
      stats: {
        specs: 10,
        tickets: 174,
        sprints: 7,
      },
    },
    timeline: [
      { phase: 'Requirements', duration: '3 hours', output: 'SRS document' },
      { phase: 'Spec Generation', duration: '15 min', output: '10 spec files, 12000+ lines' },
      { phase: 'Sprint 0-1', duration: '6 hours', output: 'Auth, DB, product catalog' },
      { phase: 'Sprint 2-3', duration: '8 hours', output: 'Cart, checkout, payments' },
      { phase: 'Total', duration: '~20 hours', output: 'Production-ready store' },
    ],
    features: [
      'User auth & profiles',
      'Product catalog with search',
      'Shopping cart & wishlist',
      'Stripe payment integration',
      'Order management & tracking',
      'Admin dashboard',
    ],
  },

  // 16. results
  {
    type: 'results',
    title: 'Proven Results',
    metrics: [
      { label: 'Sprints Completed', value: '25+', icon: '🏃' },
      { label: 'Tickets Executed', value: '263', icon: '✅' },
      { label: 'Time to Production', value: '12 days', icon: '⚡' },
      { label: 'Test Coverage', value: '70%+', icon: '🧪' },
      { label: 'Cost Savings', value: '~40%', icon: '💰' },
      { label: 'Multi-Agent Savings', value: '~45%', icon: '🤖' },
    ],
    testimonial: {
      quote: 'AutoSpec turned AI from a unpredictable tool into a reliable development partner.',
      source: 'Battle-tested on production applications',
    },
  },

  // 17. demo
  {
    type: 'demo',
    title: 'Live Demo',
    subtitle: 'ShopFlow E-Commerce',
    steps: [
      '1. Show requirements.md input',
      '2. Run autospec init',
      '3. Review generated specs',
      '4. Execute Sprint 0 with AI',
      '5. Show working product catalog',
    ],
    note: 'Demo time: ~5 minutes',
  },

  // ── ACT 6 — FUTURE ───────────────────────────────────────────────────────────

  // 18. futureWaterfall
  {
    type: 'futureWaterfall',
    title: 'The Future: Planning-First Development',
    subtitle: 'The new development time allocation',
    insight: "We're returning to waterfall — but smarter. When specs are clear, agents don't hallucinate. When agents don't hallucinate, you can use cheaper models and get the same results.",
    allocation: [
      { phase: 'Planning & Specification', percentage: 40, color: 'blue', description: 'Understanding WHAT to build is the big investment. Define it right, agents execute it right.' },
      { phase: 'Development', percentage: 30, color: 'green', description: 'With clear specs, even smaller models deliver high-end results. The "small chunk" of the future.' },
      { phase: 'Testing & Verification', percentage: 30, color: 'amber', description: 'QA agents verify every ticket. Automated validation ensures nothing ships broken.' },
    ],
    callout: "The future developer spends more time thinking than typing. That's not slower — it's smarter.",
  },

  // 19. futureMonolith
  {
    type: 'futureMonolith',
    title: 'The Future: Monolith Renaissance',
    subtitle: 'Why agents prefer monorepos over microservices',
    comparison: {
      microservices: {
        label: 'Microservices',
        icon: '🔀',
        problems: [
          'Context scattered across repositories',
          'API contracts create ambiguity',
          'Agent must infer behavior from interfaces',
          'Cross-service debugging is guesswork',
        ],
      },
      monolith: {
        label: 'Monolith / Monorepo',
        icon: '🏛️',
        benefits: [
          'Entire codebase in one context window',
          'Direct function calls — no API ambiguity',
          'Agent sees the full process end-to-end',
          'Refactoring is atomic, not distributed',
        ],
      },
    },
    callout: 'Decoupling made sense for human teams. For agents with 200K context windows, a monolith is a superpower.',
  },

  // ── ACT 7 — CLOSE ────────────────────────────────────────────────────────────

  // 20. closing
  {
    type: 'closing',
    title: 'Get Started Today',
    install: 'npm install -g autospec',
    commands: [
      { cmd: 'autospec init', desc: 'Initialize new project' },
      { cmd: 'autospec status', desc: 'View sprint progress' },
      { cmd: 'autospec sprint 0', desc: 'Generate sprint prompt' },
    ],
    links: {
      github: 'github.com/Hundia/autospec',
      docs: 'autospec.dev/docs',
    },
    tagline: 'From requirements to running code.',
  },

  // 21. finalTagline
  {
    type: 'finalTagline',
    title: 'AutoSpec',
    tagline: "Don't let your AI think. Let it execute.",
  },
];
