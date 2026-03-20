# Product Manager Spec — AutoSpec

## Vision
AutoSpec is the definitive SDD toolkit for AI-assisted development. Any developer or team should be able to bootstrap a well-structured project in under 5 minutes and maintain it with rigorous spec-driven practices.

## The 4 Personas

### 1. Solo Developer (primary)
- Builds side projects / SaaS with Claude Code
- Needs: fast bootstrap, AI-friendly structure, minimal overhead
- Pain: context drift, AI hallucinating architecture, no traceability

### 2. Small Team (3-8 devs)
- Startup or agency building production software
- Needs: shared specs, parallel agents, role clarity, QA gates
- Pain: AI agents step on each other, no single source of truth

### 3. OSS Contributor
- Maintains open-source project, wants AI PRs to follow spec
- Needs: CLAUDE.md conventions, structured backlog, PR templates
- Pain: AI PRs ignore architecture, break conventions

### 4. Enterprise Adopter
- Regulated industry, needs audit trails
- Needs: all decisions traceable to spec, sprint summaries for compliance
- Pain: AI "just works" but no documentation, can't audit

## MoSCoW Prioritization

### Must Have (MVP)
- `autospec init` CLI command generating project scaffold
- 10 role spec templates (01-10)
- Backlog management with status tracking
- CLAUDE.md generation with backlog-first rules
- Skills for: sprint-run, execute-ticket, sprint-status, update-backlog

### Should Have
- Visual viewer (React) for specs, backlog, docs
- Sprint orchestrator pattern (Opus + Sonnet agents)
- GitHub Actions CI/CD
- NPM publish

### Could Have
- Environments compatibility matrix
- GitHub Pages auto-deploy
- Mermaid diagram rendering
- Product Hunt launch kit

### Won't Have (v1)
- Team collaboration server
- Cloud-hosted viewer
- Payment integration
- Mobile app

## User Stories

- As a solo dev, I want `npx autospec init` to scaffold my project in <5min
- As a team lead, I want all sprint work traceable to spec tickets
- As a Claude Code user, I want `/sprint-run 3` to execute a full sprint
- As an OSS maintainer, I want CLAUDE.md to enforce spec-first AI contributions
- As a viewer user, I want to browse all project docs in a warm, readable UI
