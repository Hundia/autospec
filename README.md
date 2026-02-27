[![npm version](https://img.shields.io/npm/v/autospec.svg)](https://www.npmjs.com/package/autospec)
[![CI](https://github.com/Hundia/autospec/actions/workflows/ci.yml/badge.svg)](https://github.com/Hundia/autospec/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-blue.svg)](https://www.typescriptlang.org/)

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

> **Validated on 263 tickets across 2 production case studies.**
> AI frameworks generate boilerplate. AutoSpec builds real applications.

---

## Quick Start

### Option A: CLI (30 seconds)

```bash
npx autospec init
```

Or install globally:

```bash
npm install -g autospec
autospec init
```

### Option B: Zero-install (single paste)

Copy the prompt from [QUICKSTART.md](./QUICKSTART.md) into Claude Code, Copilot, or any AI assistant. No npm required.

---

## Why AutoSpec?

### The Problem

Most developers use AI like this:

1. Ask AI to "build a login system"
2. Get 500 lines of code
3. Spend hours debugging and adapting
4. Realize it doesn't fit the codebase
5. Start over

**The result:** Wasted time, inconsistent outputs, poor scalability.

### The Solution

```
Requirements --> Specs --> Backlog --> Sprint 0 --> Sprint 1 --> ... --> Done
```

1. **Write** what you want (requirements document)
2. **Generate** 10 comprehensive specs covering every perspective
3. **Extract** tickets into a structured backlog
4. **Execute** sprints with AI agents following the specs exactly

---

## What Makes AutoSpec Different

| Capability | AutoSpec | Spec-Kit | BMAD | OpenSpec |
|-----------|----------|----------|------|---------|
| Production-validated | 263 tickets, 2 case studies | Examples only | Examples only | Community projects |
| Setup method | Single prompt OR CLI | Python `uvx` | `npx bmad` | `npx @fission-ai/openspec` |
| FinOps model routing | Built-in (haiku/sonnet/opus) | No | No | No |
| Living docs linkage | Sprint <-> docs cross-refs | No | Agent-based | Partial |
| Bug fix protocol | Reproduce -> fix -> verify | No | No | No |
| Zero-install option | QUICKSTART.md single paste | No | No | No |
| Academic paper | Published | No | No | No |

### Key Differentiators

1. **Production-validated, not theoretical.** 263 tickets executed across two real applications (ShopFlow e-commerce, DataHub API). Every pattern in AutoSpec was stress-tested in production before being documented.

2. **FinOps-optimized model routing.** Every ticket specifies which AI model tier to use (haiku/sonnet/opus). Result: ~40% cost savings vs. using premium models for everything, with no quality loss.

3. **True living documentation.** Sprint summaries cross-reference docs, docs reference sprint tickets, backlog links to both. Nothing goes stale because everything is connected.

4. **Bug Fix Verification Protocol.** Reproduce the exact user flow first, fix, then verify by replaying the user flow (not just the code change). Catches multi-bug-same-symptom scenarios that other frameworks miss entirely.

5. **Zero-to-productive in 5 minutes.** Copy one prompt from QUICKSTART.md and paste it into any AI assistant. No CLI install, no Python, no Docker. Works with Claude, Copilot, GPT, Gemini, Cursor.

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
│   ├── claude/             # 9 Claude Code slash commands
│   └── copilot/            # GitHub Copilot instructions
├── docs/                   # Deep-dive documentation
│   ├── methodology/        # 9 chapters on the method
│   └── environments/       # IDE-specific guides
├── cli/                    # TypeScript CLI tool
├── dashboard/              # Web monitoring dashboard
└── demo/                   # Live demo prompts
```

---

## Using the CLI

```bash
# Quick start with npx (no install)
npx autospec init

# Or install globally
npm install -g autospec

# Or add to your project
npm install --save-dev autospec
```

### Commands

```bash
autospec init              # Initialize project with specs
autospec status            # Show sprint progress
autospec sprint <number>   # Generate sprint prompt
autospec spec <name>       # Generate feature spec
autospec dashboard         # Launch monitoring dashboard
```

---

## AI Assistant Support

| Platform | Integration | Details |
|----------|------------|---------|
| **Claude Code** | 9 slash commands | `/sprint-run`, `/execute-ticket`, `/sprint-status`, `/update-backlog`, `/qa-review`, `/create-spec`, `/create-sprint-docs`, `/sprint-close`, `/help` |
| **GitHub Copilot** | Custom instructions | `.github/copilot-instructions.md` with full SDD context |
| **Cursor** | Rules file | Drop specs into Cursor rules for context |
| **OpenAI GPT** | Prompt templates | Copy sprint prompts into ChatGPT/API |
| **Google Gemini** | Context file | `.gemini/context.md` with project patterns |

---

## Documentation

### Research Paper

- [Academic Paper (PDF)](./docs/ACADEMIC_PAPER.pdf) — Full research paper with methodology and results
- [Academic Paper (Markdown)](./docs/ACADEMIC_PAPER.md) — Source document

### Methodology

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

## Links

| Resource | Description |
|----------|-------------|
| [QUICKSTART.md](./QUICKSTART.md) | Get started in 5 minutes |
| [CHANGELOG.md](./CHANGELOG.md) | Version history |
| [ROADMAP.md](./ROADMAP.md) | Planned milestones |
| [examples/](./examples/) | Complete worked examples |
| [templates/](./templates/) | Templates for new projects |
| [docs/methodology/](./docs/methodology/) | Deep-dive on the method |

---

*"The best code is the code you never have to debug. AutoSpec catches issues in specs before they become bugs."*
