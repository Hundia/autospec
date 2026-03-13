// Hero metadata
export const paperMeta = {
  title: 'AutoSpec: A Specification-Driven Framework for Scalable AI-Assisted Software Development',
  authors: ['Eli Hundia'],
  date: 'March 2026',
  journal: 'Software Engineering Practice',
  abstract:
    'We present AutoSpec, a Specification-Driven Development (SDD) framework that structures AI-assisted software engineering through comprehensive role-based specifications, a two-tier orchestrator-agent execution model, and cost-optimized model routing. Validated across three real-world projects spanning 837+ tickets and 29+ sprints, AutoSpec achieves 100% ticket completion rates, zero merge conflicts in parallel execution, and approximately 40% cost savings through intelligent FinOps model selection. Our results demonstrate that systematic specification coverage transforms AI coding assistants from ad-hoc tools into a reproducible, scalable engineering methodology.',
  stats: [
    { label: 'Sprints', value: '29+' },
    { label: 'Story Points', value: '2,500+' },
    { label: 'Case Studies', value: '3' },
    { label: 'Cost Savings', value: '~40%' },
  ],
};

// 8-phase workflow
export const phases = [
  { num: 1, title: 'Requirements', icon: 'FileText', description: 'Define project vision, personas, user flows', color: 'blue' },
  { num: 2, title: 'Specifications', icon: 'BookOpen', description: '10-role spec model covering all perspectives', color: 'violet' },
  { num: 3, title: 'Backlog', icon: 'ListTodo', description: 'Decompose specs into atomic, sized tickets', color: 'emerald' },
  { num: 4, title: 'Agent Briefing', icon: 'FileCode', description: 'Orchestrator writes context packages for agents', color: 'cyan' },
  { num: 5, title: 'Sprint Execution', icon: 'Play', description: 'Parallel agents implement tickets in worktrees', color: 'indigo' },
  { num: 6, title: 'QA Verification', icon: 'Shield', description: 'Build checks, test suites, regression testing', color: 'amber' },
  { num: 7, title: 'Documentation', icon: 'BookMarked', description: 'Living docs updated with every feature', color: 'green' },
  { num: 8, title: 'Sprint Close', icon: 'CheckCircle2', description: 'Summary, retrospective, knowledge capture', color: 'rose' },
];

// 10 roles
export const roles = [
  { num: '01', name: 'Product Manager', focus: 'Vision, personas, user flows', icon: 'FileText', color: 'blue' },
  { num: '02', name: 'Backend Lead', focus: 'API design, services, auth', icon: 'Server', color: 'green' },
  { num: '03', name: 'Frontend Lead', focus: 'Components, state, routing', icon: 'Layout', color: 'purple' },
  { num: '04', name: 'DB Architect', focus: 'Schema, migrations, indexes', icon: 'Database', color: 'orange' },
  { num: '05', name: 'QA Lead', focus: 'Test strategy, E2E, coverage', icon: 'TestTube2', color: 'yellow' },
  { num: '06', name: 'DevOps Lead', focus: 'CI/CD, containers, monitoring', icon: 'Cloud', color: 'cyan' },
  { num: '07', name: 'Marketing Lead', focus: 'GTM, positioning, launch', icon: 'Megaphone', color: 'pink' },
  { num: '08', name: 'Finance Lead', focus: 'FinOps, cost, pricing', icon: 'DollarSign', color: 'emerald' },
  { num: '09', name: 'Business Lead', focus: 'Strategy, KPIs, risk', icon: 'BarChart3', color: 'indigo' },
  { num: '10', name: 'UI Designer', focus: 'Design system, screens', icon: 'Palette', color: 'rose' },
];

// Orchestrator pattern data
export const orchestratorData = {
  orchestrator: {
    model: 'Opus 4.6',
    capabilities: [
      'Writes sprint briefs with full context',
      'Spawns parallel agents in worktrees',
      'Reviews results and merges',
    ],
  },
  agents: [
    { label: 'Agent A', task: 'Paper Update', model: 'Sonnet 4.6' },
    { label: 'Agent B', task: 'Showcase Page', model: 'Sonnet 4.6' },
    { label: 'Agent C', task: 'Link Fixes', model: 'Sonnet 4.6' },
  ],
  comparison: {
    sequential: { label: 'Sequential', hours: 12, color: 'red' },
    parallel: { label: 'Parallel (AutoSpec)', hours: 6.5, color: 'emerald' },
    savings: '45%',
  },
};

// FinOps data
export const finopsData = {
  tiers: [
    { model: 'Haiku', allocation: '40%', cost: '~$0.001/task', tasks: 'Data extraction, boilerplate, CRUD', color: 'cyan' },
    { model: 'Sonnet', allocation: '45%', cost: '~$0.01/task', tasks: 'Multi-file refactors, component synthesis', color: 'purple' },
    { model: 'Opus', allocation: '15%', cost: '~$0.05/task', tasks: 'Architecture, security, complex debugging', color: 'amber' },
  ],
  comparison: { allOpus: '$1,580', autospec: '$285', savings: '82%' },
};

// 3 case studies
export const caseStudies = [
  {
    name: 'ShopFlow',
    type: 'E-Commerce Platform',
    sprints: 7,
    tickets: 174,
    points: 520,
    coverage: '72%',
    stack: ['React', 'Node.js', 'PostgreSQL'],
    highlight: '174 tickets, 7 sprints',
  },
  {
    name: 'DataHub',
    type: 'API Gateway',
    sprints: 4,
    tickets: 89,
    points: 270,
    coverage: '78%',
    stack: ['Node.js', 'Express', 'Redis'],
    highlight: '89 tickets, 4 sprints',
  },
  {
    name: 'AutoSpec',
    type: 'Self-Validation',
    sprints: 18,
    tickets: 574,
    points: 1720,
    coverage: 'N/A',
    stack: ['React', 'Vite', 'TypeScript', 'Node.js'],
    highlight: '574+ tickets, self-referential',
    featured: true,
  },
];

// Results stats
export const resultStats = [
  { value: '100%', label: 'Completion Rate', description: 'Every ticket shipped across all projects' },
  { value: '74%', label: 'Test Coverage', description: 'AI-driven testing with Playwright' },
  { value: '0', label: 'Merge Conflicts', description: 'Clean parallel execution' },
  { value: '45%', label: 'Time Savings', description: 'Multi-agent parallelization' },
  { value: '~40%', label: 'Cost Savings', description: 'FinOps model routing' },
  { value: '837+', label: 'Total Tickets', description: 'Across 3 validated case studies' },
];

// Key contributions
export const contributions = [
  { title: '10-Role Specification Model', description: 'Systematic coverage of all project perspectives through specialized documents' },
  { title: 'Orchestrator + Agent Pattern', description: 'Two-tier execution with Opus planning and Sonnet implementing in parallel' },
  { title: 'Operationalized Skills', description: '11 slash commands encoding methodology as executable prompts' },
  { title: 'FinOps Model Selection', description: 'Cost-optimized routing achieving ~40% savings while maintaining quality' },
];

// Conclusion
export const conclusion =
  'AutoSpec demonstrates that comprehensive specifications, combined with structured multi-agent execution and cost-optimized model selection, can transform AI-assisted development from ad-hoc prompting into a reproducible engineering methodology. Across 837+ tickets in three case studies, the framework achieved 100% completion rates, zero merge conflicts, and approximately 40% cost savings.';

// References
export const references = [
  'Brooks, F. P. (1987). No Silver Bullet. Computer, 20(4), 10-19.',
  'Chen, M., et al. (2021). Evaluating Large Language Models Trained on Code. arXiv:2107.03374.',
  'Hong, S., et al. (2023). MetaGPT: Meta Programming for Multi-Agent Collaborative Framework. arXiv:2308.00352.',
  'Peng, S., et al. (2023). The Impact of AI on Developer Productivity. arXiv:2302.06590.',
];

export const bibtex = `@article{hundia2026autospec,
  title={AutoSpec: A Specification-Driven Framework for Scalable AI-Assisted Software Development},
  author={Hundia, Eli},
  year={2026},
  month={March},
  note={Available at https://github.com/Hundia/autospec}
}`;
