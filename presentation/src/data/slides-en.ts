export const slidesEN = [
  // ── ACT 1 — PROBLEM ──────────────────────────────────────────────────────────

  // 1. title
  {
    type: 'title',
    title: 'AutoSpec',
    subtitle: 'From Requirements to Running Code',
    tagline: 'Make AI think before it codes.',
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
    bottomLine: 'Agentic development without structure is technical debt at AI speed.',
  },

  // ── ACT 2 — TURNING POINT ────────────────────────────────────────────────────

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
    question: 'What if AI had all the context BEFORE it wrote a single line of code?',
    points: [
      'What if every decision was recorded, not just the code?',
      'What if new sessions inherited all previous knowledge?',
      'What if AI agents worked from specs, not conversations?',
    ],
  },

  // ── ACT 3 — BUILDING BLOCKS ──────────────────────────────────────────────────

  // 10. sddThreePillars — introduce SDD concepts one by one
  {
    type: 'sddThreePillars',
    title: 'The Building Blocks of SDD',
    subtitle: 'Three simple ideas that solve everything we just saw',
    pillars: [
      {
        number: '01',
        title: 'Specs as Code',
        description: 'Every decision lives in a .md file in specs/. Not in chat logs, not in your head — in version-controlled files that any agent can read.',
        artifact: 'specs/*.md',
        icon: '📐',
        color: 'teal',
      },
      {
        number: '02',
        title: 'Sprint Summaries',
        description: 'Every sprint ends with a summary: what was built, what changed, what was decided. The next agent picks up exactly where you left off.',
        artifact: 'sprints/sprint-X/summary.md',
        icon: '📋',
        color: 'emerald',
      },
      {
        number: '03',
        title: 'Living Documentation',
        description: 'Docs grow with every ticket. Architecture, APIs, flows — always current, never stale. Knowledge compounds instead of decaying.',
        artifact: 'docs/ (grows every sprint)',
        icon: '📖',
        color: 'cyan',
      },
    ],
  },

  // 11. roles — different perspectives catch what a single viewpoint misses
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
        { agent: 'Orchestrator', roles: ['Product Manager', 'Business Lead'] },
        { agent: 'Agent A', roles: ['Backend Lead', 'DB Architect', 'DevOps Lead'] },
        { agent: 'Agent B', roles: ['Frontend Lead', 'QA Lead', 'UI Designer'] },
      ],
    },
    insight: 'Even solo developers benefit from thinking in roles.',
  },

  // 12. docsFolder — knowledge compounds over time
  {
    type: 'docsFolder',
    title: 'Living Documentation',
    subtitle: 'Knowledge that compounds with every sprint',
    tree: [
      { name: 'docs/', type: 'folder', depth: 0 },
      { name: 'database/', type: 'folder', depth: 1, annotation: 'Schema, ERD, relationships' },
      { name: 'auth/', type: 'folder', depth: 1, annotation: 'JWT, guards, roles' },
      { name: 'scheduling/', type: 'folder', depth: 1, annotation: 'Classes, capacity, views' },
      { name: 'bookings/', type: 'folder', depth: 1, annotation: 'State machine, waitlist' },
      { name: 'frontend/', type: 'folder', depth: 1, annotation: 'Routes, stores, services' },
      { name: 'telegram/', type: 'folder', depth: 1, annotation: 'Bot, GPT-4o, webhooks' },
      { name: 'README.md', type: 'file', depth: 1, annotation: 'Master navigation map' },
    ],
    growth: [
      { sprint: 'Sprint 0', docs: 8 },
      { sprint: 'Sprint 3', docs: 28 },
      { sprint: 'Sprint 6', docs: 62 },
      { sprint: 'Sprint 10', docs: 100 },
    ],
    comparison: {
      without: 'Docs rot after day one. New agents reverse-engineer everything.',
      with: 'Every ticket updates docs/. New agents inherit 100% of project knowledge.',
    },
  },

  // 13. qaTestingSlide — AI-driven E2E testing
  {
    type: 'qaTestingSlide',
    title: 'QA: AI-Driven End-to-End Testing',
    subtitle: "The agent doesn't just write code — it verifies its own work",
    workflow: [
      { step: '01', title: 'Plan Tests', icon: '📋', description: 'Agent reads specs and designs test strategy', color: 'blue' },
      { step: '02', title: 'Set Up Mocks', icon: '🔧', description: 'Configure test database, API stubs, fixtures', color: 'violet' },
      { step: '03', title: 'Run Playwright', icon: '🎭', description: 'Execute E2E tests against preprod environment', color: 'green' },
      { step: '04', title: 'Document Results', icon: '📝', description: 'Update sprint summary with pass/fail traceability', color: 'teal' },
    ],
    terminal: {
      title: 'playwright — test suite',
      lines: [
        { text: '> npx playwright test --project=chromium', type: 'command' },
        { text: '  Running 23 tests using 3 workers', type: 'info' },
        { text: '  ✓ TC-01 Admin login with valid credentials (1.2s)', type: 'pass' },
        { text: '  ✓ TC-02 JWT refresh token rotation (0.8s)', type: 'pass' },
        { text: '  ✓ TC-03 Create class via API (0.5s)', type: 'pass' },
        { text: '  ✓ TC-07 Booking with credit deduction (1.1s)', type: 'pass' },
        { text: '  ✗ TC-12 Waitlist promotion on cancel (2.3s)', type: 'fail' },
        { text: '    → Expected: status "confirmed", Received: "waitlisted"', type: 'error' },
        { text: '  ✓ TC-18 Schedule page renders classes (1.8s)', type: 'pass' },
        { text: '  ✓ TC-21 My Bookings displays correctly (1.4s)', type: 'pass' },
        { text: '  22 passed, 1 failed (18.4s)', type: 'summary' },
      ],
    },
    providers: ['Claude Code', 'GitHub Copilot', 'Gemini', 'Continue'],
    callout: 'Any AI agent that can read specs can run your test suite. Provider-agnostic by design.',
  },

  // 14. sprintMemorySlide — sprint summaries as execution memory
  {
    type: 'sprintMemorySlide',
    title: 'Sprint Memory: Never Lose Context Again',
    subtitle: "Sprint summaries are the handoff document that never existed before",
    summary: {
      command: '> /sprint-close',
      progress: 'Closing Sprint 11... Generating summary...',
      result: '✓ sprints/sprint-11/summary.md created',
      sections: [
        { label: 'Release Notes', color: 'blue', items: ['Added JWT auth with refresh tokens', 'Login page with OTP', '3 new API endpoints'] },
        { label: 'Linked Documentation', color: 'violet', items: ['docs/auth/01-architecture.md', 'docs/auth/02-jwt-flow.md', 'docs/frontend/03-login-page.md'] },
        { label: 'Files Modified', color: 'green', items: ['+ src/auth/auth.service.ts', '+ src/auth/auth.guard.ts', '~ src/pages/Login.tsx', '... 12 more'] },
        { label: 'Closing Commit', color: 'amber', items: ['a3f7c21 feat(sprint-11): auth + login'] },
      ],
    },
    benefits: [
      { icon: '⚡', title: 'Instant Context', description: 'Agent reads summary → Full context in 30 seconds' },
      { icon: '🔍', title: 'Sprint Comparison', description: 'Compare Sprint 3 vs Sprint 7 → See exactly what changed' },
      { icon: '🚫', title: 'No Code Reading', description: 'Everything linked — no reverse engineering needed' },
      { icon: '🤝', title: 'Perfect Handoff', description: 'Any agent, any provider, picks up where you left off' },
    ],
    callout: 'The sprint summary is the memory that AI was never given.',
  },

  // ── ACT 4 — THE REVEAL ─────────────────────────────────────────────────────────

  // 15. solution — AutoSpec packages all the building blocks
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

  // 14. pipeline — the full end-to-end workflow
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

  // 15. orchestrator — how execution works with parallel agents
  {
    type: 'orchestrator',
    title: 'Orchestrator Pattern',
    subtitle: 'Same pattern, any AI provider',
    providers: [
      { id: 'claude', name: 'Claude Code', icon: '🟣', accent: 'indigo', orchestratorModel: 'Opus 4.6', agentModel: 'Sonnet 4.6' },
      { id: 'copilot', name: 'GitHub Copilot', icon: '🔵', accent: 'blue', orchestratorModel: 'GPT 5.4', agentModel: 'GPT 5.2' },
      { id: 'gemini', name: 'Gemini', icon: '🟡', accent: 'amber', orchestratorModel: 'Gemini Ultra', agentModel: 'Gemini Pro' },
      { id: 'local', name: 'Continue (Local)', icon: '🟢', accent: 'green', orchestratorModel: 'GPT OSS 120B', agentModel: 'GPT OSS 7B' },
    ],
    orchestrator: {
      roleLabel: 'Product Manager',
      tasks: ['Writes sprint briefs', 'Spawns parallel agents', 'Sequences by dependency graph', 'Reviews results & merges'],
    },
    agents: [
      { roleLabel: 'Agent A', task: 'Backend tickets in worktree-a' },
      { roleLabel: 'Agent B', task: 'Frontend tickets in worktree-b' },
      { roleLabel: 'Agent C', task: 'Docs & config in worktree-c' },
    ],
    benefits: ['Clean main context', 'Parallel execution', 'Isolated worktrees'],
    callout: 'Same specs. Same pattern. Different models.',
  },

  // ── ACT 5 — DEEP DIVES ─────────────────────────────────────────────────────────

  // 16. modelOptimization
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

  // ── ACT 6 — PROOF ────────────────────────────────────────────────────────────

  // 17. viewer
  {
    type: 'viewer',
    title: 'Live Viewer Dashboard',
    url: 'hundia.github.io/autospec/viewer',
    features: ['Specs Browser', 'Backlog Kanban', 'Living Docs'],
    linkText: 'Try it live →',
  },

  // 18. example
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

  // 19. results
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

  // 20. demo
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

  // ── ACT 7 — FUTURE ───────────────────────────────────────────────────────────

  // 21. futureWaterfall
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

  // 22. futureMonolith
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

  // ── ACT 8 — CLOSE ────────────────────────────────────────────────────────────

  // 23. closing
  {
    type: 'closing',
    title: 'Get Started Today',
    install: 'git clone https://github.com/Hundia/autospec-starter my-project',
    commands: [
      { cmd: 'cd my-project', desc: 'Enter your new project' },
      { cmd: 'Add requirements to requirements/', desc: 'Drop in your SRS, PRD, or project brief' },
      { cmd: 'Run @QUICKSTART.md', desc: 'Tell your AI assistant — specs, backlog & docs generated' },
    ],
    links: {
      github: 'github.com/Hundia/autospec',
      docs: 'autospec.dev/docs',
    },
    tagline: 'From requirements to running code.',
  },

  // 24. finalTagline
  {
    type: 'finalTagline',
    title: 'AutoSpec',
    tagline: 'AI thought first. Then it shipped.',
  },
];
