# GitHub Copilot Instructions for SDD Projects

Copy this file to `.github/copilot-instructions.md` in your project root.

---

# Copilot Instructions

## Project Overview

This project uses **Spec-Driven Development (SDD)** methodology. All code must align with specifications in the `specs/` folder.

## Core Principles

1. **Spec-First**: Read specs before implementing any feature
2. **Single Source of Truth**: `specs/backlog.md` tracks all work
3. **Status Tracking**: Update ticket status as you work
4. **Pattern Following**: Follow existing code patterns

## Key Files

### Specifications
| File | Purpose |
|------|---------|
| `specs/backlog.md` | Master work tracker - check before starting |
| `specs/01_product_manager.md` | Product vision and requirements |
| `specs/02_backend_lead.md` | API patterns and conventions |
| `specs/03_frontend_lead.md` | UI components and design system |
| `specs/04_db_architect.md` | Database schema and migrations |
| `specs/05_qa_lead.md` | Testing requirements |
| `specs/06_devops_lead.md` | Infrastructure and deployment |

### When Implementing

**Before coding:**
1. Read the relevant spec file
2. Check `specs/backlog.md` for ticket details
3. Verify dependencies are complete

**While coding:**
1. Follow patterns in spec files
2. Use existing code as reference
3. Write tests per `specs/05_qa_lead.md`

**After coding:**
1. Update ticket status in `specs/backlog.md`
2. Run tests: `npm test`
3. Commit with descriptive message

## Status Emojis

When updating `specs/backlog.md`:

| Emoji | Status | Meaning |
|-------|--------|---------|
| 🔲 | Todo | Not started |
| 🔄 | In Progress | Being worked on |
| 🧪 | QA Review | Needs testing |
| ✅ | Done | Complete |
| ⏸️ | Blocked | Cannot proceed |

## Code Conventions

### TypeScript
- Use strict types (no `any`)
- Zod for validation
- Interfaces over types where possible

### Backend (Node.js/Express)
- Repository → Service → Controller pattern
- Error handling with custom errors
- Consistent response format:
  ```typescript
  { data: T, meta?: { total, page } }  // Success
  { error: string, code: string }       // Error
  ```

### Frontend (React)
- Functional components with hooks
- Zustand for state management
- Tailwind for styling
- Component location: `src/components/[Feature]/`

### Database
- Snake_case for tables and columns
- UUID primary keys
- Always include created_at, updated_at
- Migrations in `database/migrations/`

### Testing
- Unit tests: `*.test.ts`
- Integration tests: `*.spec.ts`
- Follow AAA pattern (Arrange, Act, Assert)
- Target 70%+ coverage

## Common Tasks

### Implementing a Ticket

```
1. Read specs/backlog.md to find ticket [X.Y]
2. Read relevant spec file (02-06 based on type)
3. Update backlog: 🔲 → 🔄
4. Implement following patterns
5. Write tests
6. Update backlog: 🔄 → 🧪
7. Run tests: npm test
```

### Creating API Endpoint

Follow `specs/02_backend_lead.md`:
1. Add route in `routes/[resource].routes.ts`
2. Create controller method
3. Create service method
4. Add Zod validation schema
5. Write integration test

### Creating Component

Follow `specs/03_frontend_lead.md`:
1. Create in `components/[Feature]/[Name].tsx`
2. Use design system tokens
3. Add TypeScript props interface
4. Write component test

### Database Migration

Follow `specs/04_db_architect.md`:
1. Create `database/migrations/XXX_description.sql`
2. Use existing naming conventions
3. Include UP and DOWN
4. Test migration locally

## Agent Mode

When working as Agent A or Agent B:

### Agent A (Backend)
- Focus on: Database, API, Services
- Tickets: Odd numbers or backend-specific
- DO NOT modify frontend code

### Agent B (Frontend)
- Focus on: Components, Pages, State
- Tickets: Even numbers or frontend-specific
- DO NOT modify backend code

## Commit Messages

Format: `type(scope): description`

Types: feat, fix, docs, style, refactor, test, chore

Example: `feat(auth): implement JWT token refresh`

## Questions?

- Check spec files first
- Look at existing code for patterns
- When unclear, ask for clarification

---

**Remember: The spec is the source of truth. When in doubt, read the spec.**
