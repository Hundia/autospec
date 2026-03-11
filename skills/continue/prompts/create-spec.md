---
name: create-spec
description: Generate a new feature specification from requirements
invokable: true
---

# Create Spec

Generate a new feature specification document following the SDD methodology.

## Input

The user should provide:
- Feature name or title
- High-level description of what the feature does
- Any known requirements or constraints

## Process

### 1. Gather Requirements

If the user hasn't provided enough detail, ask about:
- **Problem**: What problem does this feature solve?
- **Users**: Who will use this feature?
- **Scope**: What is in scope and out of scope?
- **Dependencies**: What existing systems does this interact with?
- **Constraints**: Any technical or business constraints?

### 2. Read Existing Specs

Review the current spec files to understand:
- Project architecture (`specs/04-architecture.md`)
- Data model (`specs/05-data-model.md`)
- API contracts (`specs/06-api-contract.md`)
- Existing feature specs for patterns and formatting

### 3. Determine Spec Number

Read the `specs/` directory to find the next available spec number:
- Core specs: 01-06 (reserved)
- Feature specs: 07+
- Special: 10 (Definition of Done)
- Choose the next unused number

### 4. Generate Spec Document

Create `specs/XX-feature-name.md` following this template:

```markdown
# Spec XX: Feature Name

## Overview
[1-2 paragraph description of the feature]

## Problem Statement
[What problem this solves and why it matters]

## Requirements

### Functional Requirements
1. **FR-1**: [Requirement description]
   - Acceptance criteria
2. **FR-2**: [Requirement description]
   - Acceptance criteria

### Non-Functional Requirements
1. **NFR-1**: [Performance, security, etc.]
2. **NFR-2**: [Requirement description]

## Design

### Architecture
[How this feature fits into the existing architecture]

### Data Model
[New or modified data structures, Zod schemas]

### API Changes
[New or modified endpoints]

### UI Changes
[New or modified viewer components, if applicable]

## Dependencies
- [List of dependencies on other specs or features]

## Implementation Plan
1. [Phase 1 description]
2. [Phase 2 description]

## Testing Strategy
- Unit tests: [What to test]
- Integration tests: [What to test]
- Manual verification: [What to check]

## Open Questions
- [Any unresolved decisions]
```

### 5. Create Backlog Tickets

Ask the user if they want to generate backlog tickets from this spec:
- Break the spec into implementable tickets
- Add them to the next sprint in `specs/backlog.md`
- Each ticket should reference the spec number

### 6. Report

Confirm the spec was created and provide:
- File path of the new spec
- Summary of requirements captured
- Suggested next steps (create tickets, review with team)
