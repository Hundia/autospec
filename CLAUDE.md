# Claude Code Memory — AutoSpec

## About This Project

AutoSpec is a Spec-Driven Development (SDD) framework. **This project develops itself using its own tools.** Use `/sprint-run`, `/execute-ticket`, `/sprint-status` etc. in Claude Code.

---

## MANDATORY Development Workflow

### Rule 1: Backlog-First Development

Every fix, feature, or change MUST be tracked in `specs/backlog.md` before or during implementation:

1. Determine if this is a **bug** (B.XX), **new feature**, or **enhancement**
2. Add ticket to `specs/backlog.md` in the appropriate sprint section
3. Set status to 🔄 In Progress when starting
4. Set status to ✅ Done when complete

**Skip ONLY when user explicitly says** "skip backlog", "don't track this"

### Rule 2: Living Documentation

Every implemented feature MUST update `docs/`:

- Viewer changes → `docs/viewer/`
- CLI changes → `docs/cli/`
- Methodology changes → `docs/methodology/`
- Deployment changes → `docs/deployment/`
- New subsystem → create new `docs/<subsystem>/` directory

### Rule 3: QA Before Done

No ticket is ✅ Done without verification:

| Change Type | QA Required |
|-------------|-------------|
| Bug fix | Reproduce first, fix, verify user flow passes |
| CLI change | `npm run build` + `npm test` in `cli/` |
| Viewer change | `npm run build` in `viewer/` + visual check |
| Docs/config only | No QA — mark ✅ directly |
| New feature | Full test suite + new test cases if needed |

### Rule 4: Orchestrator + Agent Execution Pattern

This project uses **Opus 4.6 as Orchestrator + Sonnet 4.6 as Sprint Agents**:

1. Orchestrator writes `agents/sprint-X-brief.md` before spawning
2. Orchestrator spawns: `Agent(subagent_type=general-purpose)` with briefing
3. Agent reads brief + relevant specs + docs, implements tickets
4. Agent updates: `specs/backlog.md` (🔲→✅), docs/, `sprints/sprint-X/summary.md`
5. Orchestrator reviews summary, spawns next sprint(s)

**Parallel execution:** Sprints with no dependencies run as parallel agents in one message.

---

## Project Structure

```
autospec/
├── .opencode/               # OpenCode commands + skills
│   ├── commands/            # OpenCode slash-style command wrappers
│   └── skills/              # OpenCode skill wrappers pointing to source workflows
├── .claude/commands/       # 10 SDD skill files (symlinked from skills/claude/)
├── specs/                  # Role spec files (01-10) + backlog.md
├── agents/                 # Sprint briefing files (sprint-X-brief.md)
├── sprints/                # Sprint summaries (sprint-X/summary.md)
├── docs/                   # Living documentation
│   ├── methodology/        # 10 files: SDD philosophy, roles, patterns
│   ├── environments/       # IDE/terminal setup guides
│   ├── viewer/             # Viewer app docs (created Sprint 1+)
│   ├── cli/                # CLI docs (created Sprint 4+)
│   └── deployment/         # CI/CD + GitHub Pages (created Sprint 5)
├── skills/claude/          # Source skill .md files
├── cli/                    # CLI tool source (Node/TypeScript)
├── viewer/                 # React viewer app (created Sprint 1)
└── QUICKSTART.md           # Full usage guide
```

## Key Commands

```bash
# OpenCode
opencode

# CLI
cd cli && npm run build
cd cli && npm test

# Viewer (Sprint 1+)
cd viewer && npm run dev
cd viewer && npm run build

# Tests
cd cli && HEADLESS=true npx vitest run
```

## Current Sprint

See `specs/backlog.md` for active sprint and tickets.
