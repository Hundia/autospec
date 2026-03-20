# Sprint 19A Brief — Template Repo + QUICKSTART Refactor

**Agent:** Sonnet (general-purpose)
**Theme:** Create `autospec-starter/` template repo structure + refactor QUICKSTART.md header

## Context

AutoSpec's real workflow is:
1. User clones/uses template repo (or downloads QUICKSTART.md)
2. User puts requirements in `requirements/` folder
3. User tells AI: "Run @QUICKSTART.md"
4. AI generates everything

The `npx autospec init` CLI approach is being demoted. The template repo becomes the primary distribution.

## Tickets

### 19.1 — Create `autospec-starter/` directory structure

Create the full template at `/opt/FitnessAiManager/autospec/autospec-starter/`:

```
autospec-starter/
  QUICKSTART.md          → symlink or copy of root QUICKSTART.md
  requirements/
    README.md            → "Place your SRS/PRD here"
    project-brief.md     → Guided template (19.2)
    example-srs.md       → Example requirements doc
  .autospec/
    config.yml           → Environment + project metadata (19.3)
  .claude/commands/      → Copy all 11 skill files from /opt/FitnessAiManager/autospec/skills/claude/
  .github/
    copilot-instructions.md → Copilot-compatible instructions
  .cursor/rules/
    autospec.md          → Cursor-compatible rules (19.4)
  .windsurf/rules.md     → Windsurf-compatible rules (19.5)
  CLAUDE.md              → Minimal bootstrap CLAUDE.md
  README.md              → 4-step quickstart (19.7)
  .gitignore
```

### 19.2 — Create `requirements/project-brief.md`

Guided template with sections:
- Project Name
- One-Sentence Description
- Target Users (who are they?)
- Core Features (bullet list, prioritized)
- Technical Preferences (stack, hosting, language)
- Constraints (budget, timeline, existing systems)
- Out of Scope

Also create `requirements/example-srs.md` with a simple example (e.g., a task management app).

Also create `requirements/README.md`:
```markdown
# Requirements

Place your SRS, PRD, or requirements documents in this folder.

QUICKSTART.md will read all files here as input.
```

### 19.3 — Create `.autospec/config.yml`

```yaml
# AutoSpec Configuration
project:
  name: "My Project"
  description: ""

environment: claude-code
# Options: claude-code, cursor, vscode-copilot, windsurf, jetbrains-ai, aider

models:
  orchestrator: opus    # For planning and coordination
  agent: sonnet         # For implementation
  quick: haiku          # For simple tasks

options:
  generate_viewer: false
  generate_ci: true
  language: en          # en | he
```

### 19.4 — Create `.cursor/rules/autospec.md`

Cursor rules file that tells Cursor's AI about SDD methodology:
- Read QUICKSTART.md for generation instructions
- Read requirements/ for project requirements
- Follow SDD methodology (specs → backlog → sprints → docs)
- Use skills from .claude/commands/ as reference patterns

### 19.5 — Create `.windsurf/rules.md`

Same concept as Cursor rules but formatted for Windsurf.

### 19.6 — Refactor QUICKSTART.md header

The current QUICKSTART.md at `/opt/FitnessAiManager/autospec/QUICKSTART.md` starts with "How To Use" instructions mixed with the generation prompt.

Refactor lines 1-43 to be a clearer human-readable header:

**New header (approximately 50 lines):**
```markdown
# QUICKSTART.md — AutoSpec Generation Prompt

> **What is this?** The single file that turns your requirements into a complete, AI-ready project structure. No CLI required.

## Prerequisites

- An AI coding assistant (Claude Code, Cursor, Copilot, Windsurf, or any LLM-based IDE)
- Your requirements document(s) in the `requirements/` folder
- A `.autospec/config.yml` with your environment set (optional — defaults to claude-code)

## 3 Steps

1. **Add your requirements** → Place your SRS, PRD, or project brief in `requirements/`
2. **Tell your AI** → "Run @QUICKSTART.md" (or paste the content below)
3. **Watch it generate** → 10 expert specs, sprint backlog, docs structure, CI/CD prompts

## What Gets Generated

```
your-project/
├── specs/           # 10 role-based specifications
├── docs/            # Living documentation
├── sprints/         # Sprint plans & summaries
├── prompts/         # Environment-optimized AI prompts
└── CLAUDE.md        # Project memory & conventions
```

## What's NOT Generated (pre-installed)

- `QUICKSTART.md` (this file)
- `requirements/` (your input)
- `.claude/commands/` (11 SDD skills)
- `.autospec/config.yml` (your settings)

---

Everything below this line is consumed by your AI assistant.
Do not edit unless you know what you're doing.

---
```

Then keep the existing generation prompt content starting from `---START---`.

### 19.7 — Create `autospec-starter/README.md`

4-step quickstart:

```markdown
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

### Step 3: Configure (Optional)

Edit `.autospec/config.yml` to set your AI environment:

```yaml
environment: claude-code  # or: cursor, vscode-copilot, windsurf
```

### Step 4: Generate

Tell your AI assistant:

> Run @QUICKSTART.md

That's it. AutoSpec generates 10 expert specifications, a sprint backlog, documentation structure, and environment-optimized prompts.

## What's Included

| File/Folder | Purpose |
|-------------|---------|
| `QUICKSTART.md` | Master generation prompt |
| `requirements/` | Your project requirements go here |
| `.autospec/config.yml` | Environment & project settings |
| `.claude/commands/` | 11 SDD skills for Claude Code |
| `.cursor/rules/` | Cursor IDE integration |
| `.windsurf/rules.md` | Windsurf IDE integration |
| `.github/copilot-instructions.md` | GitHub Copilot integration |
| `CLAUDE.md` | Project memory bootstrap |

## Learn More

- [QUICKSTART.md](./QUICKSTART.md) — Full generation reference
- [AutoSpec Repository](https://github.com/Hundia/autospec) — Framework source
- [Academic Paper](https://github.com/Hundia/autospec#paper) — SDD methodology research
```

## Files to Create/Modify

| Action | Path |
|--------|------|
| CREATE | `autospec-starter/README.md` |
| CREATE | `autospec-starter/CLAUDE.md` |
| CREATE | `autospec-starter/.gitignore` |
| CREATE | `autospec-starter/QUICKSTART.md` (copy from root) |
| CREATE | `autospec-starter/requirements/README.md` |
| CREATE | `autospec-starter/requirements/project-brief.md` |
| CREATE | `autospec-starter/requirements/example-srs.md` |
| CREATE | `autospec-starter/.autospec/config.yml` |
| CREATE | `autospec-starter/.claude/commands/` (copy 11 files from skills/claude/) |
| CREATE | `autospec-starter/.github/copilot-instructions.md` |
| CREATE | `autospec-starter/.cursor/rules/autospec.md` |
| CREATE | `autospec-starter/.windsurf/rules.md` |
| MODIFY | `QUICKSTART.md` (refactor header, keep body) |

## Important

- Copy the ACTUAL skill files from `/opt/FitnessAiManager/autospec/skills/claude/` into `autospec-starter/.claude/commands/`
- The QUICKSTART.md in the starter should be a copy of the root one (after header refactor)
- Mark tickets 19.1-19.7 as ✅ in `specs/backlog.md` when done
