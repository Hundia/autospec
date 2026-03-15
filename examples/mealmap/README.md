# AutoSpec Starter

> Spec-Driven Development for AI-assisted coding. Your AI writes better code when it thinks first.

## Quick Start

### Step 1: Create Your Project

```bash
gh repo create my-project --template Hundia/autospec-starter --clone
cd my-project
```

Or click **"Use this template"** on GitHub.

### Step 2: Add Your Requirements

Edit `requirements/project-brief.md` with your project details, or drop your own SRS/PRD files into `requirements/`.

See `requirements/example-srs.md` for an example of the level of detail that works best.

### Step 3: Configure (Optional)

Edit `.autospec/config.yml` to set your AI environment:

```yaml
environment: claude-code  # or: cursor, vscode-copilot, windsurf, jetbrains-ai, aider
```

### Step 4: Generate

Tell your AI assistant:

> Run @QUICKSTART.md

That's it. AutoSpec generates 10 expert specifications, a sprint backlog, documentation structure, and environment-optimized prompts — all from your requirements.

## What Gets Generated

```
your-project/
├── specs/           # 10 role-based specifications (product, backend, frontend, DB, QA, ...)
├── docs/            # Living documentation (architecture, API, flows)
├── sprints/         # Sprint plans and summaries
├── prompts/         # Environment-optimized AI prompts
└── CLAUDE.md        # Updated with project conventions
```

## What's Included (Pre-Installed)

| File/Folder | Purpose |
|-------------|---------|
| `QUICKSTART.md` | Master generation prompt (the AI reads this) |
| `requirements/` | Your project requirements go here |
| `requirements/project-brief.md` | Guided template with prompting questions |
| `requirements/example-srs.md` | Example requirements document |
| `.autospec/config.yml` | Environment and project settings |
| `.claude/commands/` | 11 SDD skills for Claude Code |
| `.cursor/rules/autospec.md` | Cursor IDE integration |
| `.windsurf/rules.md` | Windsurf IDE integration |
| `.github/copilot-instructions.md` | GitHub Copilot integration |
| `CLAUDE.md` | Project memory bootstrap |

## After Generation

Once your AI generates the project structure, use SDD skills to build iteratively:

```
/plan-sprint "Build authentication"    # Plan a sprint
/sprint-run 0                          # Execute Sprint 0
/sprint-status                         # Check progress
/sprint-close 0                        # Close with summary
```

## Learn More

- [QUICKSTART.md](./QUICKSTART.md) — Full generation reference
- [AutoSpec Repository](https://github.com/Hundia/autospec) — Framework source
- [Academic Paper](https://hundia.github.io/autospec/#/paper) — SDD methodology research
- [Live Demo](https://hundia.github.io/autospec/) — Interactive presentation
