# TaskFlow - FinOps Model Selection Guide

## Overview

This guide helps select the appropriate Claude model for different TaskFlow development tasks, optimizing for cost and quality.

---

## Model Tiers

### Claude Haiku (Fast & Economical)

**Best for:**
- Code formatting and linting fixes
- Simple refactoring
- Boilerplate generation
- Documentation writing
- Test data generation
- Simple bug fixes
- Code comments and JSDoc

**Cost**: ~$0.25 per 1M input tokens, ~$1.25 per 1M output tokens

**TaskFlow Examples:**
```
- Generate seed data for tasks/projects
- Add TypeScript types to existing functions
- Format and lint code
- Write JSDoc comments
- Generate simple CRUD boilerplate
- Fix typos and syntax errors
- Convert JavaScript to TypeScript
```

### Claude Sonnet (Balanced)

**Best for:**
- Feature implementation
- Bug investigation and fixes
- Code review suggestions
- Test writing
- API endpoint implementation
- Component development
- Database queries

**Cost**: ~$3 per 1M input tokens, ~$15 per 1M output tokens

**TaskFlow Examples:**
```
- Implement task CRUD endpoints
- Write React components
- Create Prisma queries
- Implement authentication middleware
- Write unit and integration tests
- Debug API issues
- Implement filtering logic
```

### Claude Opus (Most Capable)

**Best for:**
- Complex architecture decisions
- System design
- Security review
- Performance optimization
- Complex debugging
- Multi-file refactoring
- Technical documentation

**Cost**: ~$15 per 1M input tokens, ~$75 per 1M output tokens

**TaskFlow Examples:**
```
- Design database schema
- Architect authentication system
- Security audit of auth flow
- Performance optimization of dashboard queries
- Complex state management design
- API versioning strategy
- Multi-component refactoring
```

---

## Task-Based Model Selection

### Sprint 0 Tasks

| Task | Recommended Model | Rationale |
|------|-------------------|-----------|
| Project scaffolding | Haiku | Boilerplate generation |
| Database schema design | Opus | Architecture decision |
| Auth implementation | Sonnet | Standard feature |
| JWT middleware | Sonnet | Security-sensitive |
| Task CRUD | Sonnet | Standard feature |
| Test writing | Sonnet | Needs understanding |
| Documentation | Haiku | Content generation |
| Docker setup | Haiku | Configuration files |

### Sprint 1 Tasks

| Task | Recommended Model | Rationale |
|------|-------------------|-----------|
| Project model migration | Sonnet | Database changes |
| Tag system design | Opus | Many-to-many complexity |
| Dashboard queries | Opus | Performance critical |
| Filter implementation | Sonnet | Query building |
| Frontend components | Sonnet | Feature implementation |
| Test coverage | Sonnet | Test writing |
| Performance tuning | Opus | Optimization |

---

## Cost Estimation

### Per Sprint Estimates

```
Sprint 0 (Foundation):
├─ Haiku tasks:    ~500K tokens → ~$0.75
├─ Sonnet tasks:   ~2M tokens  → ~$36
├─ Opus tasks:     ~200K tokens → ~$18
└─ Total estimate: ~$55

Sprint 1 (Features):
├─ Haiku tasks:    ~300K tokens → ~$0.50
├─ Sonnet tasks:   ~3M tokens  → ~$54
├─ Opus tasks:     ~500K tokens → ~$45
└─ Total estimate: ~$100
```

### Cost Optimization Strategies

1. **Start with Haiku**
   - Try Haiku first for simple tasks
   - Escalate to Sonnet if quality insufficient
   - Use Opus only when necessary

2. **Batch Similar Tasks**
   - Group documentation tasks for Haiku
   - Group feature tasks for Sonnet
   - Save Opus for planning sessions

3. **Cache Context**
   - Provide project context once per session
   - Reference previous outputs
   - Avoid repeating large code blocks

4. **Incremental Development**
   - Break complex tasks into smaller pieces
   - Use appropriate model for each piece
   - Validate at each step

---

## Decision Flowchart

```
START: New Development Task
        │
        ▼
┌───────────────────────────────┐
│ Is it boilerplate/formatting? │
└───────────────────────────────┘
        │
   YES ─┤──► Use HAIKU
        │
   NO ──┘
        │
        ▼
┌───────────────────────────────┐
│ Is it architecture/security?  │
└───────────────────────────────┘
        │
   YES ─┤──► Use OPUS
        │
   NO ──┘
        │
        ▼
┌───────────────────────────────┐
│ Is it performance-critical?   │
└───────────────────────────────┘
        │
   YES ─┤──► Use OPUS
        │
   NO ──┘
        │
        ▼
┌───────────────────────────────┐
│ Is it a standard feature?     │
└───────────────────────────────┘
        │
   YES ─┤──► Use SONNET
        │
   NO ──┘
        │
        ▼
    Use OPUS (complex/unknown)
```

---

## TaskFlow-Specific Guidelines

### Backend Development

```yaml
haiku:
  - Prisma seed data generation
  - Route boilerplate
  - Error message strings
  - Environment variable templates
  - TypeScript interface definitions

sonnet:
  - Controller implementation
  - Service layer logic
  - Middleware development
  - Validation schemas
  - Unit test writing
  - Integration test writing
  - Bug fixes

opus:
  - Database schema design
  - Query optimization
  - Authentication architecture
  - Caching strategy
  - Security review
```

### Frontend Development

```yaml
haiku:
  - Component boilerplate
  - CSS/Tailwind utilities
  - Mock data generation
  - Type definitions
  - Static content

sonnet:
  - React component implementation
  - Custom hooks
  - State management
  - Form handling
  - API integration
  - Component testing

opus:
  - Application architecture
  - State management design
  - Performance optimization
  - Complex component patterns
  - Accessibility review
```

### DevOps & Infrastructure

```yaml
haiku:
  - Dockerfile templates
  - GitHub Actions YAML
  - Environment configs
  - README templates

sonnet:
  - CI/CD pipeline logic
  - Docker Compose setup
  - Deployment scripts
  - Monitoring setup

opus:
  - Infrastructure architecture
  - Security configuration
  - Scaling strategy
  - Disaster recovery
```

---

## Quality Gates

### When to Escalate Model

**Haiku → Sonnet:**
- Output has logical errors
- Missing edge cases
- Incorrect API usage
- Poor code structure

**Sonnet → Opus:**
- Security concerns
- Performance issues
- Architectural questions
- Complex debugging
- Multi-system integration

### When to Downgrade Model

**Opus → Sonnet:**
- Task is well-defined
- Pattern already established
- Simple variations of existing code

**Sonnet → Haiku:**
- Repetitive changes
- Formatting only
- Simple additions
- Documentation

---

## Prompt Templates by Model

### Haiku Prompt Template

```
Task: [Simple, specific task]

Input: [Code/context if needed]

Output: [Exact format required]

Constraints:
- Keep it simple
- No extra features
- Follow existing patterns
```

### Sonnet Prompt Template

```
Context: [Project context]

Task: [Feature description]

Requirements:
- [Requirement 1]
- [Requirement 2]

Technical Details:
- Tech stack: [...]
- Existing patterns: [...]

Expected Output:
- [Deliverable 1]
- [Deliverable 2]
```

### Opus Prompt Template

```
Project: TaskFlow - Task Management Application

Context:
[Comprehensive project context including architecture,
current state, and goals]

Challenge:
[Complex problem description]

Constraints:
- [Technical constraints]
- [Business constraints]
- [Performance requirements]

Questions to Address:
1. [Architecture question]
2. [Trade-off analysis]
3. [Implementation strategy]

Expected Analysis:
- Pros and cons of approaches
- Recommended solution with rationale
- Implementation roadmap
- Risk assessment
```

---

## Tracking & Optimization

### Usage Logging Template

```markdown
## Model Usage Log - [Date]

| Time | Model | Task | Tokens | Cost | Quality |
|------|-------|------|--------|------|---------|
| 09:00 | Sonnet | Task CRUD | 50K | $0.90 | Good |
| 10:30 | Haiku | Seed data | 20K | $0.03 | Good |
| 14:00 | Opus | Auth design | 30K | $2.70 | Excellent |

Daily Total: $3.63
```

### Weekly Review Checklist

- [ ] Review model selection decisions
- [ ] Identify over-use of expensive models
- [ ] Identify under-use causing quality issues
- [ ] Update guidelines based on learnings
- [ ] Calculate cost per feature
