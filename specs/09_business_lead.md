# Business Lead Spec — AutoSpec Market Analysis

## Market Context

### The Problem Space
AI coding tools (Claude, Copilot, Cursor) are powerful but unstructured. Without explicit specs and conventions, AI agents:
- Hallucinate architecture ("let me use Redux here")
- Break conventions across sessions
- Leave no audit trail
- Can't coordinate across multiple agents

### The Solution
SDD (Spec-Driven Development) — a methodology layer that:
1. Captures intent in structured spec files before implementation
2. Enforces conventions via CLAUDE.md and skills
3. Tracks all work in a structured backlog
4. Enables multi-agent coordination with clear role boundaries

## Competitive Landscape

### Direct Competitors
- **None** — no other framework specifically addresses AI-assisted SDD at this scope

### Adjacent Tools
- **Cursor Rules** — single-file conventions, no backlog, no roles
- **GitHub Copilot Workspace** — task-level, no multi-agent, no viewer
- **.cursorrules** — per-project, no structure, no skills
- **AutoGPT** — autonomous agents, no human-in-the-loop, no SDD

### Moat
- Battle-tested on 16+ sprints of production software (English Kef)
- The "warm palette viewer" is a differentiator (beautiful, not dark-mode-default)
- OSS: community contribution amplifies methodology

## Growth Strategy
1. Launch on HN/Product Hunt with real production track record
2. Let usage data guide prioritization (GitHub Issues as product feedback)
3. Partner with Claude Code team for official mention
4. Version 2: team features (shared specs server, PR integration)

## Success Metrics (6 months)
- 1000+ GitHub stars
- 500+ NPM weekly downloads
- 3+ community-contributed examples
- Featured in Claude documentation
