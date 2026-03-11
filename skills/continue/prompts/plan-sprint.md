---
name: plan-sprint
description: Assemble experts to collaboratively plan a sprint
invokable: true
---

# Plan Sprint

Plan a sprint using a structured multi-phase analysis process. This simulates the expert panel approach from SDD methodology.

## Input

The user should provide:
- Sprint number or goal
- Any specific features or tickets to include
- Constraints (timeline, dependencies, etc.)

If not provided, read `specs/backlog.md` to identify unplanned tickets and suggest the next sprint.

## Important Note

Continue operates as a single agent. This command simulates the multi-expert planning process sequentially rather than spawning parallel agents. The quality of planning is maintained by following each phase carefully.

## Planning Phases

### Phase 1: Goal Analysis
- Read `specs/backlog.md` for pending tickets and priorities
- Read recent sprint summaries in `sprints/` for context and velocity
- Identify the sprint goal and scope
- List candidate tickets

### Phase 2: Technical Analysis
Act as a **Technical Lead**:
- Assess technical complexity of each candidate ticket
- Identify dependencies between tickets
- Flag any architectural concerns or technical debt
- Estimate relative effort (S/M/L/XL)
- Suggest execution order

### Phase 3: Product Analysis
Act as a **Product Manager (PM-A)**:
- Draft the sprint scope and ticket selection
- Prioritize by user impact and business value
- Ensure the sprint has a coherent theme/goal
- Balance new features vs bug fixes vs tech debt
- Propose ticket assignments and groupings

### Phase 4: Risk Review
Act as a **Risk Reviewer (PM-B)**:
- Review the draft plan for risks
- Check for over-commitment (compare to historical velocity)
- Identify single points of failure
- Suggest mitigation strategies
- Flag any missing dependencies or specs

### Phase 5: Finalization
Act as a **Finalizer (PM-C)**:
- Incorporate feedback from all phases
- Finalize ticket list and priorities
- Set clear acceptance criteria for each ticket
- Define sprint success metrics

### Phase 6: Present Plan
Output the final sprint plan:

```markdown
## Sprint X Plan

**Goal:** [Sprint goal]
**Duration:** [Estimated duration]
**Tickets:** [Count]

### Tickets

| ID | Title | Priority | Effort | Dependencies |
|----|-------|----------|--------|-------------|
| X.1 | ... | High | M | none |
| X.2 | ... | Medium | L | X.1 |

### Risks
- [Risk 1 and mitigation]

### Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

## Output

Write the sprint plan to `specs/backlog.md` under the new sprint section (after user confirmation) and optionally create `agents/sprint-X-brief.md`.
