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

---

## What is AutoSpec?

**AutoSpec** is a battle-tested methodology and CLI tool for AI-assisted software development. It transforms vague requirements into comprehensive specifications, enabling AI coding assistants to execute with precision.

### The Problem

Most developers use AI like this:
1. Ask AI to "build a login system"
2. Get 500 lines of code
3. Spend hours debugging and adapting
4. Realize it doesn't fit the codebase
5. Start over

### The AutoSpec Solution

```
Requirements → Specs → Tickets → AI Execution → Working Code
```

1. **Auto-generate specifications** from your requirements
2. **Create structured backlogs** with sized tickets
3. **Execute with multiple AI agents** in parallel
4. **Ship faster** with fewer bugs

---

## Quick Start

### Install

```bash
# Install globally
npm install -g autospec

# Or use npx
npx autospec init
```

### Bootstrap a New Project

```bash
# Initialize AutoSpec in your project
autospec init

# Answer prompts about your project
# ✓ Project name: My App
# ✓ Project type: Web Application
# ✓ Stack: React + Node.js
# ✓ AI platform: Claude

# AutoSpec creates:
# specs/
#   01_product_manager.md
#   02_backend_lead.md
#   03_frontend_lead.md
#   04_db_architect.md
#   05_qa_lead.md
#   06_devops_lead.md
#   10_ui_designer.md
#   backlog.md
# prompts/
#   prompt_sprint0.md
# .claude/commands/
#   execute-ticket.md
#   qa-review.md
#   ...
```

### Run Your First Sprint

```bash
# Generate sprint prompt
autospec sprint 0

# Open your AI assistant (Claude, Copilot, etc.)
# Paste the generated prompt
# Watch it execute Sprint 0

# Check status
autospec status
```

---

## Core Concepts

### 1. The 10-Role Model

Every project is specified from 10 perspectives:

| # | Role | Responsibility |
|---|------|----------------|
| 01 | Product Manager | Vision, personas, user flows |
| 02 | Backend Lead | API design, auth, services |
| 03 | Frontend Lead | Design system, components |
| 04 | DB Architect | Schema, migrations |
| 05 | QA Lead | Testing strategy |
| 06 | DevOps Lead | Infrastructure, CI/CD |
| 07 | Marketing Lead | Go-to-market |
| 08 | Finance Lead | Pricing, economics |
| 09 | Business Lead | Strategy, competition |
| 10 | UI Designer | Screen specs, wireframes |

Even solo developers benefit from thinking in roles.

### 2. Single Source of Truth

`specs/backlog.md` is the master tracker:

```markdown
## Sprint 1: Authentication

| # | Ticket | Status | Owner | Model | Depends |
|---|--------|--------|-------|-------|---------|
| 1.1 | Create users table | 🔲 Todo | DB | haiku | - |
| 1.2 | Implement auth service | 🔲 Todo | Backend | sonnet | 1.1 |
| 1.3 | Build login form | 🔲 Todo | Frontend | sonnet | 1.2 |
```

### 3. Multi-Agent Execution

Two AI agents working in parallel:

```
Agent A (Backend): 1.1, 1.2, 1.4
Agent B (Frontend): 1.3, 1.5, 1.6
```

**~45% time savings** with clear boundaries.

### 4. Model Selection (FinOps)

Match AI model to task complexity:

| Model | Use For | % of Tasks | Cost |
|-------|---------|------------|------|
| Haiku | Migrations, configs, seeds | 40% | $ |
| Sonnet | Services, components, tests | 45% | $$ |
| Opus | Architecture, security, debugging | 15% | $$$ |

---

## CLI Commands

```bash
autospec init              # Initialize new project
autospec status            # Show sprint progress
autospec sprint <number>   # Generate sprint prompt
autospec spec <name>       # Generate feature spec
autospec dashboard         # Launch monitoring dashboard
autospec validate          # Validate project structure
```

### Monitoring Dashboard

Launch a real-time web dashboard to monitor your project:

```bash
autospec dashboard
```

The dashboard provides:
- **Backlog Board** - Kanban view of all tickets
- **Sprint Burndown** - Progress charts and velocity tracking
- **Agent Activity** - Multi-agent execution monitoring
- **Screen Preview** - Visualize wireframes from UI specs
- **Cost Analysis** - Model usage and savings metrics

See [dashboard/README.md](./dashboard/README.md) for details.

---

## Documentation

### Methodology

- [01 - Philosophy](./docs/methodology/01_philosophy.md) - Why AutoSpec works
- [02 - Spec Structure](./docs/methodology/02_spec_structure.md) - How to write specs
- [03 - Team Roles](./docs/methodology/03_team_roles.md) - The 10-role model
- [04 - Backlog Management](./docs/methodology/04_backlog_management.md) - Sprint patterns
- [05 - Multi-Agent](./docs/methodology/05_multi_agent.md) - Parallel execution
- [06 - QA Methodology](./docs/methodology/06_qa_methodology.md) - Testing & quality
- [07 - Model Selection](./docs/methodology/07_model_selection.md) - Cost optimization
- [09 - Ground Truth](./docs/methodology/09_ground_truth_schema.md) - Validation schema

### Environment Guides

- [VSCode Setup](./docs/environments/vscode/setup.md)
- [VSCode + GitHub Copilot](./docs/environments/vscode/github_copilot.md)
- [JetBrains Setup](./docs/environments/jetbrains/setup.md)
- [Terminal + Claude Code](./docs/environments/terminal/claude_code.md)

### Templates

- [Spec Templates](./templates/specs/) - All 10 role templates
- [Prompt Templates](./templates/prompts/) - Sprint execution prompts
- [AI Skills](./skills/) - Claude commands, Copilot instructions

---

## Platform Support

### AI Models

| Platform | Supported | Notes |
|----------|-----------|-------|
| Claude (Anthropic) | ✅ Full | Primary development platform |
| GitHub Copilot | ✅ Full | VSCode & JetBrains |
| Gemini (Google) | 🟡 Partial | Context-based |
| OpenAI GPT | 🟡 Partial | Via API |

### IDEs

| IDE | Supported | Features |
|-----|-----------|----------|
| VSCode | ✅ Full | Extensions, multi-window |
| JetBrains | ✅ Full | AI Assistant |
| Terminal | ✅ Full | Claude Code CLI |
| Cursor | ✅ Full | Built-in AI |

---

## Example: Multi-Agent Setup

### VSCode with Two Copilot Windows

```
┌───────────────────────────────────────────────┐
│ VSCode                                         │
├─────────────────────┬─────────────────────────┤
│ Copilot Chat        │ Copilot Chat            │
│ (Agent A - Backend) │ (Agent B - Frontend)    │
├─────────────────────┴─────────────────────────┤
│ Editor                                         │
└───────────────────────────────────────────────┘
```

### Agent A Prompt

```
You are Agent A - Backend Lead for Sprint 1.

Project: My App
Your tickets: 1.1, 1.2, 1.4

Read specs/02_backend_lead.md before implementing.
Update backlog.md status as you work.

Do NOT touch frontend code.
```

### Agent B Prompt

```
You are Agent B - Frontend Lead for Sprint 1.

Project: My App
Your tickets: 1.3, 1.5, 1.6

Read specs/03_frontend_lead.md before implementing.
Wait for 1.2 before starting 1.3 (API dependency).

Do NOT touch backend code.
```

---

## Generated Project Structure

```
my-project/
├── specs/                    # Specification documents
│   ├── 01_product_manager.md
│   ├── 02_backend_lead.md
│   ├── 03_frontend_lead.md
│   ├── 04_db_architect.md
│   ├── 05_qa_lead.md
│   ├── 06_devops_lead.md
│   ├── 10_ui_designer.md     # Screen wireframes
│   └── backlog.md            # Master work tracker
├── prompts/                  # Sprint execution prompts
│   ├── prompt_sprint0.md
│   └── prompt_sprint1.md
├── sprints/                  # Sprint documentation
│   └── sprint-01-auth/
│       ├── summary.md
│       ├── qa-results.md
│       └── release-notes.md
├── .claude/commands/         # Claude Code skills
│   ├── execute-ticket.md
│   ├── qa-review.md
│   └── ...
├── .github/
│   └── copilot-instructions.md
└── .autospecrc.json          # AutoSpec configuration
```

---

## Proven Results

AutoSpec was developed and refined through building a production application:

| Metric | Result |
|--------|--------|
| Sprints completed | 16+ |
| Tickets executed | 200+ |
| Time from idea to production | 12 days |
| Test coverage | 70%+ |
| Cost savings (vs. all-Opus) | ~40% |
| Multi-agent time savings | ~45% |

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Areas for Contribution

- Additional environment guides
- More example projects
- CLI tool improvements
- Template refinements
- Documentation translations

---

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

## Support

- **Issues:** [GitHub Issues](https://github.com/user/autospec/issues)
- **Discussions:** [GitHub Discussions](https://github.com/user/autospec/discussions)
- **Documentation:** [Full Docs](./docs/)

---

*"The best code is the code you never have to debug. AutoSpec catches issues in specs before they become bugs."*
