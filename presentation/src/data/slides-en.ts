export const slidesEN = [
  // 1. title
  {
    type: 'title',
    title: 'AutoSpec',
    subtitle: 'From Requirements to Running Code',
    tagline: 'AI-Powered Spec-Driven Development',
    presenter: 'Your Name',
    date: '2026',
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
  // 9. solution
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
    keyInsight: "Don't let AI think. Let it execute. Specs are the thinking.",
  },
  // 10. docsFolder
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
  // 11. workflow
  {
    type: 'workflow',
    title: 'The AutoSpec Workflow',
    steps: [
      {
        number: '01',
        title: 'Write Requirements',
        description: 'Create an SRS document describing what you want',
        time: '1-2 hours',
        output: 'requirements.md',
      },
      {
        number: '02',
        title: 'Generate Specs',
        description: 'AutoSpec creates 10 role-based specifications',
        time: '5 minutes',
        output: 'specs/*.md',
      },
      {
        number: '03',
        title: 'Review & Refine',
        description: 'Validate specs match your vision',
        time: '30 minutes',
        output: 'Approved specs',
      },
      {
        number: '04',
        title: 'Execute Sprints',
        description: 'AI agents work through tickets systematically',
        time: '2-4 hours/sprint',
        output: 'Working features',
      },
    ],
  },
  // 12. roles
  {
    type: 'roles',
    title: 'The 10-Role Model',
    description: 'Every project is specified from 10 perspectives',
    roles: [
      { num: '01', name: 'Product Manager', focus: 'Vision, personas, flows' },
      { num: '02', name: 'Backend Lead', focus: 'APIs, auth, services' },
      { num: '03', name: 'Frontend Lead', focus: 'Components, design system' },
      { num: '04', name: 'DB Architect', focus: 'Schema, migrations' },
      { num: '05', name: 'QA Lead', focus: 'Testing strategy' },
      { num: '06', name: 'DevOps Lead', focus: 'Infrastructure, CI/CD' },
      { num: '07', name: 'Marketing Lead', focus: 'Go-to-market' },
      { num: '08', name: 'Finance Lead', focus: 'Pricing, economics' },
      { num: '09', name: 'Business Lead', focus: 'Strategy, competition' },
      { num: '10', name: 'UI Designer', focus: 'Screens, wireframes' },
    ],
    insight: 'Even solo developers benefit from thinking in roles.',
  },
  // 13. sprintLifecycle
  {
    type: 'sprintLifecycle',
    title: 'The Sprint Lifecycle',
    phases: [
      { icon: '📋', title: 'Plan', description: 'Define tickets, estimate points, assign agents' },
      { icon: '📝', title: 'Document', description: 'Write briefs with full context for agents' },
      { icon: '⚙️', title: 'Execute', description: 'Agents implement tickets in isolated worktrees' },
      { icon: '🧪', title: 'QA', description: 'Verify every ticket with build + test + review' },
      { icon: '📊', title: 'Summarize', description: 'Record outcomes, docs updated, files changed' },
    ],
    callout: 'Every sprint follows this cycle. Nothing ships without all 5 phases.',
  },
  // 14. backlog
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
  // 15. orchestrator
  {
    type: 'orchestrator',
    title: 'Orchestrator Pattern',
    orchestrator: {
      name: 'Opus Orchestrator',
      tasks: ['Writes sprint briefs', 'Spawns parallel agents', 'Reviews results & merges'],
    },
    agents: [
      { name: 'Sonnet Agent A', task: 'Backend tickets in worktree-a' },
      { name: 'Sonnet Agent B', task: 'Frontend tickets in worktree-b' },
      { name: 'Sonnet Agent C', task: 'Docs & config in worktree-c' },
    ],
    benefits: ['Clean main context', 'Parallel execution', 'Isolated worktrees'],
  },
  // 16. multiagent
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
  // 17. qaMethodology
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
  // 18. sprintSummary
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
  // 19. modelOptimization
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
  // 20. skillsEnvironments
  {
    type: 'skillsEnvironments',
    title: 'Skills & Environments',
    skills: [
      '/plan-sprint',
      '/sprint-run',
      '/execute-ticket',
      '/sprint-status',
      '/qa-review',
    ],
    environments: [
      { name: 'Claude Code', support: 'Full' },
      { name: 'Copilot', support: 'Full' },
      { name: 'Cursor', support: 'Full' },
      { name: 'Windsurf', support: 'Partial' },
      { name: 'JetBrains', support: 'Partial' },
      { name: 'Aider', support: 'Basic' },
    ],
    callout: 'Same methodology, any AI assistant.',
  },
  // 21. viewer
  {
    type: 'viewer',
    title: 'Live Viewer Dashboard',
    url: 'hundia.github.io/autospec/viewer',
    features: ['Specs Browser', 'Backlog Kanban', 'Living Docs'],
    linkText: 'Try it live →',
  },
  // 22. example
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
  // 23. results
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
  // 24. demo
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
  // 25. beforeAfter
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
  // 26. closing
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
  // 27. finalTagline
  {
    type: 'finalTagline',
    title: 'AutoSpec',
    tagline: "Don't let your AI think. Let it execute.",
  },
];
