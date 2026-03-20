# Changelog

All notable changes to AutoSpec will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-02-27

Initial open-source release. Previously published as `1.0.0` (now deprecated).

### BREAKING CHANGES

- Config file renamed: `.sddrc.json` → `.autospecrc.json`
- Internal interface renamed: `SDDConfig` → `AutoSpecConfig`
- Version reset from `1.0.0` to `0.1.0` (semver-correct for initial release)

### Added

#### CLI Commands
- **`autospec init`** - Initialize AutoSpec in new or existing projects
  - Interactive prompts for project configuration
  - Support for multiple AI providers (Claude, Copilot, Gemini)
  - Auto-generates complete spec structure
  - Creates AI-specific skill files and instructions
- **`autospec status`** - Display sprint status from backlog
  - Visual progress indicators
  - Ticket status breakdown
  - Sprint completion metrics
- **`autospec sprint <number>`** - Generate sprint execution prompts
  - Context-aware prompt generation
  - Multi-agent prompt support
  - Dependency-aware ticket ordering
- **`autospec spec <name>`** - Create new feature specifications
  - Template-based generation
  - Interactive and non-interactive modes
- **`autospec dashboard`** - Launch monitoring dashboard
  - Kanban board, burndown charts, cost analysis

#### Specification Framework
- **10-Role Model** - Comprehensive specification coverage
  - Product Manager, Backend Lead, Frontend Lead, DB Architect,
    QA Lead, DevOps Lead, Marketing Lead, Finance Lead,
    Business Lead, UI Designer

#### Backlog Management
- **Single Source of Truth** - `specs/backlog.md` as master tracker
- **Sprint Organization** - Structured sprint planning
- **Ticket Tracking** - Status, owner, model, dependencies
- **Progress Visualization** - Visual status indicators

#### Multi-Agent Support
- **Parallel Execution** - Run multiple AI agents simultaneously
- **Role-Based Assignment** - Backend and Frontend agent separation
- **Dependency Management** - Automatic wait conditions
- **Conflict Prevention** - Clear file ownership boundaries

#### Model Selection (FinOps)
- **Task-Based Routing** - Match model to task complexity
- **Haiku Tier** - Migrations, configs, seeds (40% of tasks)
- **Sonnet Tier** - Services, components, tests (45% of tasks)
- **Opus Tier** - Architecture, security, debugging (15% of tasks)
- **Cost Optimization** - ~40% savings vs all-premium approach

#### Templates
- **Spec Templates** - Complete templates for all 10 roles
- **Prompt Templates** - Sprint execution prompts
- **Skill Templates** - AI assistant configurations

#### AI Platform Support
- **Claude (Anthropic)** - Full support with 9 Claude Code slash commands
- **GitHub Copilot** - Full support with custom instructions
- **Google Gemini** - Partial support
- **OpenAI GPT** - Partial support via API

#### Documentation
- **Methodology Guides** - 9 chapters covering philosophy, specs, roles, backlog, multi-agent, QA, model selection, validation, and ground truth schema
- **Environment Guides** - VSCode, GitHub Copilot, Claude Code terminal
- **Academic Paper** - Peer-review style research paper with methodology and results

### Technical Details

- **Runtime**: Node.js >= 18.0.0
- **Language**: TypeScript 5.4+
- **Build System**: tsup
- **Testing**: Vitest
- **CLI Framework**: Commander.js
- **Template Engine**: Handlebars
- **Styling**: Chalk, Ora

---

[Unreleased]: https://github.com/Hundia/autospec/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Hundia/autospec/releases/tag/v0.1.0
