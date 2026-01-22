# Changelog

All notable changes to AutoSpec will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-21

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

#### Specification Framework
- **10-Role Model** - Comprehensive specification coverage
  - Product Manager (01) - Vision, personas, user flows
  - Backend Lead (02) - API design, authentication, services
  - Frontend Lead (03) - Design system, components, interactions
  - DB Architect (04) - Schema design, migrations, indexing
  - QA Lead (05) - Testing strategy, acceptance criteria
  - DevOps Lead (06) - Infrastructure, CI/CD, deployment
  - Marketing Lead (07) - Go-to-market strategy
  - Finance Lead (08) - Pricing, unit economics
  - Business Lead (09) - Strategy, competitive analysis
  - UI Designer (10) - Wireframes, screen specifications

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
  - Foundation sprint (Sprint 0)
  - Business sprint template
  - Multi-agent coordination
  - QA review process
- **Skill Templates** - AI assistant configurations

#### AI Platform Support
- **Claude (Anthropic)** - Full support with Claude Code skills
  - execute-ticket skill
  - qa-review skill
  - sprint-status skill
  - update-backlog skill
  - create-spec skill
  - create-sprint-docs skill
- **GitHub Copilot** - Full support with custom instructions
- **Google Gemini** - Partial support
- **OpenAI GPT** - Partial support via API

#### IDE Support
- **VSCode** - Extensions and multi-window setup
- **JetBrains** - AI Assistant integration
- **Terminal** - Claude Code CLI support
- **Cursor** - Built-in AI support

#### Documentation
- **Methodology Guides**
  - Philosophy and principles
  - Spec structure guidelines
  - Team roles explanation
  - Backlog management patterns
  - Multi-agent coordination
  - QA methodology
  - Model selection guide
- **Environment Guides**
  - VSCode setup
  - GitHub Copilot configuration
  - Claude Code terminal usage

#### Developer Experience
- TypeScript implementation with full type safety
- Comprehensive test suite with Vitest
- Clean CLI interface with chalk and ora
- YAML and Handlebars template support
- Cross-platform compatibility (Node.js >= 18)

### Technical Details

- **Runtime**: Node.js >= 18.0.0
- **Language**: TypeScript 5.4+
- **Build System**: tsup
- **Testing**: Vitest
- **CLI Framework**: Commander.js
- **Template Engine**: Handlebars
- **Styling**: Chalk, Ora

---

## Roadmap

### [1.1.0] - Planned

- `autospec validate` command for project structure validation
- Enhanced multi-agent coordination
- Additional IDE integrations
- Template marketplace

### [1.2.0] - Planned

- Git integration for automatic branch management
- PR template generation
- Sprint retrospective automation
- Metrics dashboard

---

[1.0.0]: https://github.com/user/autospec/releases/tag/v1.0.0
