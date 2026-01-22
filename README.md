# AutoSpec

**From requirements to running code — AI-powered spec-driven development**

```
   _         _        ____
  / \  _   _| |_ ___ / ___| _ __   ___  ___
 / _ \| | | | __/ _ \\___ \| '_ \ / _ \/ __|
/ ___ \ |_| | || (_) |___) | |_) |  __/ (__
/_/   \_\__,_|\__\___/|____/| .__/ \___|\___|
                            |_|
```

AutoSpec is a battle-tested methodology for AI-assisted software development. It transforms vague requirements into comprehensive specifications, enabling AI coding assistants to execute with precision.

**Validated on 263 tickets across two production case studies.**

---

## The Problem

Most developers use AI like this:

1. Ask AI to "build a login system"
2. Get 500 lines of code
3. Spend hours debugging and adapting
4. Realize it doesn't fit the codebase
5. Start over

**The result:** Wasted time, inconsistent outputs, poor scalability.

## The Solution

```
Requirements → Specs → Backlog → Sprint 0 → Sprint 1 → ... → Done
```

1. Write what you want (requirements)
2. Generate 10 comprehensive specs covering all perspectives
3. Extract tickets into a structured backlog
4. Execute sprints with AI agents following the specs exactly

---

## Get Started in 5 Minutes

**Read the [QUICKSTART Guide](./QUICKSTART.md)** for step-by-step instructions with copy-paste prompts.

Or jump straight to an example:
- **[ShopFlow E-commerce](./examples/ecommerce/)** - Full example (174 tickets, 7 sprints)
- **[DataHub API Service](./examples/api-service/)** - Working code example (89 tickets)

---

## How It Works

### 1. The 10-Role Model

Every project gets 10 specification documents, each from a specialist perspective:

| Role | What It Covers |
|------|----------------|
| Product Manager | Vision, personas, user flows |
| Backend Lead | API design, auth, services |
| Frontend Lead | Design system, components, state |
| DB Architect | Schema, migrations, indexes |
| QA Lead | Test strategy, coverage targets |
| DevOps Lead | CI/CD, infrastructure, monitoring |
| Marketing Lead | Go-to-market, positioning |
| Finance Lead | Pricing, unit economics |
| Business Lead | Strategy, competition |
| UI Designer | Screen specs, wireframes |

Even solo developers benefit from thinking in roles — it ensures nothing is overlooked.

### 2. Single Source of Truth

All work is tracked in `specs/backlog.md`:

```markdown
## Sprint 1: Authentication

| ID | Ticket | Status | Owner | Model | Depends |
|----|--------|--------|-------|-------|---------|
| 1.1 | Create users table | done | DB | haiku | - |
| 1.2 | Implement auth service | in-progress | Backend | sonnet | 1.1 |
| 1.3 | Build login form | todo | Frontend | sonnet | 1.2 |
```

### 3. Multi-Agent Execution (Optional)

Run two AI agents in parallel:
- **Agent A (Backend):** Database + API tickets
- **Agent B (Frontend):** UI + component tickets

**~45% time savings** with clear boundaries preventing conflicts.

### 4. Model Selection (FinOps)

Match AI model to task complexity:

| Model | Use For | % of Tasks |
|-------|---------|------------|
| Haiku/GPT-3.5 | Migrations, configs, CRUD | 40% |
| Sonnet/GPT-4 | Services, components, tests | 45% |
| Opus/GPT-4+ | Architecture, security | 15% |

**~40% cost savings** vs. using premium models for everything.

---

## Repository Structure

```
autospec/
├── QUICKSTART.md           # Start here!
├── examples/               # Complete worked examples
│   ├── ecommerce/          # ShopFlow (7 sprints)
│   └── api-service/        # DataHub with source code
├── templates/              # Templates for new projects
│   ├── requirements.template.md
│   ├── specs/              # All 10 role templates
│   └── prompts/            # Sprint execution prompts
├── skills/                 # AI assistant integrations
│   ├── claude/             # Claude Code commands
│   └── copilot/            # Copilot instructions
├── docs/                   # Deep-dive documentation
│   ├── methodology/        # 9 chapters on the method
│   └── environments/       # IDE-specific guides
├── cli/                    # TypeScript CLI tool
└── demo/                   # Live demo prompts
```

---

## Using the CLI (Optional)

For automation, install the CLI:

```bash
npm install -g autospec

autospec init              # Initialize project with specs
autospec status            # Show sprint progress
autospec sprint <number>   # Generate sprint prompt
```

See [cli/README.md](./cli/README.md) for full documentation.

---

## Documentation

### Methodology (the "why")

- [Philosophy](./docs/methodology/01_philosophy.md) — Why spec-driven development works
- [Spec Structure](./docs/methodology/02_spec_structure.md) — How to write effective specs
- [Team Roles](./docs/methodology/03_team_roles.md) — The 10-role model explained
- [Backlog Management](./docs/methodology/04_backlog_management.md) — Sprint patterns
- [Multi-Agent](./docs/methodology/05_multi_agent.md) — Parallel execution
- [QA Methodology](./docs/methodology/06_qa_methodology.md) — Testing strategy
- [Model Selection](./docs/methodology/07_model_selection.md) — Cost optimization

### Environment Guides

- [Terminal + Claude Code](./docs/environments/terminal/claude_code.md)
- [VSCode + GitHub Copilot](./docs/environments/vscode/github_copilot.md)

### Templates

- [Requirements Template](./templates/requirements.template.md) — Starting point
- [Spec Templates](./templates/specs/) — All 10 role templates
- [Prompt Templates](./templates/prompts/) — Sprint execution prompts

---

## Proven Results

| Metric | Result |
|--------|--------|
| Case studies completed | 2 (ShopFlow, DataHub) |
| Total tickets executed | 263 |
| Test coverage achieved | 70%+ |
| Cost savings vs. all-premium models | ~40% |
| Time savings with multi-agent | ~45% |

---

## Platform Support

**AI Models:** Claude, GitHub Copilot, OpenAI GPT, Gemini

**IDEs:** VSCode, JetBrains, Cursor, Terminal (Claude Code)

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md).

**Good first contributions:**
- Additional environment guides
- More example projects
- CLI tool improvements
- Documentation translations

---

## License

MIT — see [LICENSE](./LICENSE)

---

## Quick Links

| Resource | Description |
|----------|-------------|
| [QUICKSTART.md](./QUICKSTART.md) | Get started in 5 minutes |
| [examples/](./examples/) | Complete worked examples |
| [templates/](./templates/) | Templates for new projects |
| [docs/methodology/](./docs/methodology/) | Deep-dive on the method |

---

*"The best code is the code you never have to debug. AutoSpec catches issues in specs before they become bugs."*
