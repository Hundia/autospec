export const slidesEN = [
  // 1. title
  {
    type: 'title',
    title: 'AutoSpec',
    subtitle: 'From Requirements to Running Code',
    tagline: "Don't let AI think. Give it specs.",
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
  // 8. bridge
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
  // 9. sddMethodology
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
  },
  // 10. sddCostOfChaos — NEW
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
  // 11. sddThreePillars — REWORKED: Five Pillars
  {
    type: 'sddThreePillars',
    title: 'The Five Pillars of SDD',
    subtitle: 'The rules that make SDD work — concrete artifacts, enforced process',
    pillars: [
      { number: '01', title: 'Backlog-First Development', description: 'Single source of truth. Every change tracked with a ticket before implementation. Full traceability from idea to commit.', artifact: 'specs/backlog.md', icon: '📋', color: 'teal' },
      { number: '02', title: 'Living Documentation', description: 'The docs/ folder grows with every ticket. Not written separately — generated alongside code automatically.', artifact: 'docs/auth/01-architecture.md', icon: '📖', color: 'emerald' },
      { number: '03', title: 'Sprint ↔ Docs Linkage', description: 'Sprint summaries cross-reference docs, tickets, QA results, and commits. Nothing is orphaned.', artifact: 'sprints/sprint-15/summary.md', icon: '🔗', color: 'cyan' },
      { number: '04', title: 'QA Before Done', description: 'End-to-end verification. Bug fixes reproduced first. Test depth scales with change type.', artifact: 'scripts/agent-team-tests.ts', icon: '🧪', color: 'amber' },
      { number: '05', title: 'Role-Based Specs', description: '10 perspectives ensure no blind spots. PM, Backend, QA — each writes from their domain expertise.', artifact: 'specs/01_product_manager.md', icon: '🎭', color: 'violet' },
    ],
  },
  // 12. solution — REWORKED
  {
    type: 'solution',
    title: 'AutoSpec: Your SDD Toolkit',
    subtitle: 'One prompt. Ten specs. Zero context loss.',
    capabilities: [
      { number: '01', title: '10 AI-Generated Specifications', description: 'One requirements document generates 10 role-based spec files — PM, Backend, Frontend, DB, QA, DevOps, and more.', artifact: '$ autospec init → specs/*.md', icon: '📐' },
      { number: '02', title: 'Orchestrated Sprint Execution', description: 'Opus PM agent coordinates Sonnet dev agents running in parallel git worktrees. Each agent has full context from specs.', artifact: 'Opus → [Agent A, B, C] → merge', icon: '🎯' },
      { number: '03', title: 'Living Knowledge System', description: 'Every ticket updates docs/, backlog, and sprint summaries. Knowledge compounds with every sprint.', artifact: 'docs/ (100+ files after Sprint 10)', icon: '📖' },
    ],
    keyInsight: 'AutoSpec implements SDD so you can stop arguing about methodology and start shipping.',
  },
  // 13. docsFolder
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
  },
  // 14. pipeline (was workflow)
  {
    type: 'pipeline',
    scrollable: true,
    title: 'The Full AutoSpec Pipeline',
    subtitle: 'From requirements to running code — review everything before you build',
    pipelineCallout: 'The developer who reviews before coding ships faster than the one who codes before thinking.',
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
    ],
  },
  // 15. roles
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
  // 16. ticketExecution
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
  },
  // 17. backlog
  {
    type: 'backlog',
    title: 'The Backlog System',
    description: 'Structured ticket management with clear workflows',
    statuses: [
      { status: 'todo', label: 'To Do', description: 'Ready to be picked up', color: 'gray' },
      { status: 'in-progress', label: 'In Progress', description: 'Currently being worked on', color: 'blue' },
      { status: 'qa-review', label: 'QA Review', description: 'Code complete, needs testing', color: 'yellow' },
      { status: 'done', label: 'Done', description: 'Tested and merged', color: 'green' },
      { status: 'blocked', label: 'Blocked', description: 'Waiting on dependency', color: 'red' },
    ],
    ticketStructure: [
      'ID: Unique identifier (e.g., SF-042)',
      'Title: Clear, actionable description',
      'Story Points: Complexity estimate (1-8)',
      'Dependencies: Links to blocking tickets',
      'Acceptance Criteria: Definition of done',
    ],
    bugWorkflow: {
      title: 'Bug Management',
      steps: [
        'Discovered bugs get [BUG] prefix',
        'Assigned severity: Critical/High/Medium/Low',
        'Critical bugs block sprint completion',
        'Bugs traced back to original ticket',
      ],
    },
  },
  // 18. orchestrator
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
  },
  // 19. multiagent
  {
    type: 'multiagent',
    title: 'Multi-Agent Execution',
    description: 'Double your velocity with parallel AI agents',
    agents: [
      {
        name: 'Agent A',
        role: 'Backend Lead',
        tickets: ['1.1 - Create users table', '1.2 - Auth service', '1.4 - User API'],
        color: 'blue',
      },
      {
        name: 'Agent B',
        role: 'Frontend Lead',
        tickets: ['1.3 - Login form', '1.5 - Dashboard', '1.6 - Profile page'],
        color: 'green',
      },
    ],
    benefits: [
      '~45% time savings',
      'Clear boundaries prevent conflicts',
      'Each agent has focused context',
      'Dependencies tracked in backlog',
    ],
  },
  // 20. qaMethodology
  {
    type: 'qaMethodology',
    title: 'QA Methodology',
    pyramid: [
      { level: 'E2E', percentage: '10%', description: 'Full user flow tests' },
      { level: 'Integration', percentage: '30%', description: 'API & service tests' },
      { level: 'Unit / API', percentage: '60%', description: 'Function & endpoint tests' },
    ],
    bugProtocol: [
      'Reproduce the exact user flow',
      'Fix the code',
      'Verify by replaying user flow',
    ],
    callout: 'Every ticket is verified before Done. No exceptions.',
  },
  // 21. sprintSummary
  {
    type: 'sprintSummary',
    title: 'Sprint Summaries',
    sections: [
      { icon: '✅', title: 'Completed Tickets', example: '5.1 Auth service ✅, 5.2 Login page ✅' },
      { icon: '📄', title: 'Docs Updated', example: 'docs/auth/01-architecture.md, docs/frontend/routing.md' },
      { icon: '📁', title: 'Files Modified', example: 'src/auth/auth.service.ts, src/pages/Login.tsx' },
      { icon: '🧪', title: 'QA Results', example: 'API: 17/17 pass, UI: 6/6 pass' },
    ],
    callout: 'Future agents read summaries to understand what was built.',
  },
  // 22. modelOptimization
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
  // 23. environmentProof
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
  // 24. viewer
  {
    type: 'viewer',
    title: 'Live Viewer Dashboard',
    url: 'hundia.github.io/autospec/viewer',
    features: ['Specs Browser', 'Backlog Kanban', 'Living Docs'],
    linkText: 'Try it live →',
  },
  // 25. example
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
  // 26. results
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
  // 27. demo
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
  // 28. futureWaterfall — NEW
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
  // 29. futureMonolith — NEW
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
  // 30. beforeAfter
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
  },
  // 31. closing
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
  // 32. finalTagline
  {
    type: 'finalTagline',
    title: 'AutoSpec',
    tagline: "Don't let your AI think. Let it execute.",
  },
];
