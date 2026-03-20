# User Journeys

## Agent Journey - Triage to Resolution

1. Open assigned queue filtered by team, region, and shift.
2. Sort by SLA risk, severity, and customer tier.
3. Open ticket and review:
   - customer/account history
   - entitlement status
   - recent incidents
   - prior AI drafts and approvals
4. Generate summary or reply draft.
5. Inspect confidence, citations, and warnings.
6. Decide one of:
   - edit and send
   - request approval
   - escalate to specialist queue
   - snooze with reason
   - resolve after response
7. If customer replies inside reopen window, ticket returns to `Reopened` and re-enters triage.

### Agent Failure Paths

- If AI is disabled for queue, draft actions are hidden and policy block is logged.
- If citations are missing or confidence is low, agent must write manually or escalate.
- If state transition is invalid, ticket remains in current state and timeline logs the failure.

## Manager Journey - Approvals and Coaching

1. Monitor dashboard for SLA breaches, approval queue, and QA sample volume.
2. Open high-risk draft with source citations, policy warnings, and requested action.
3. Approve, reject, or request revision.
4. Add coaching note when rejection occurs.
5. Review sampled tickets for quality and create QA scorecards.
6. Export weekly operational summary by queue, agent, and AI acceptance trend.

### Manager Decision Rules

- Refund, legal, compliance, and policy exception replies require explicit manager action.
- Managers cannot bypass audit logging or hidden AI-disabled queue settings.

## Analyst Journey - Routing and Automation Tuning

1. Inspect routing outcomes and compare predicted vs actual queue placement.
2. Review automation conflict logs and retry counts.
3. Dry-run new or edited rules against sample ticket scenarios.
4. Check queue aging, breach hotspots, and AI acceptance trend shifts.
5. Publish approved rule changes with timestamped change notes.

## Knowledge Manager Journey - Publish Safe Guidance

1. Create or update runbook, macro, or help-center article.
2. Assign owner, category, and review date.
3. Submit for approval.
4. After approval, confirm retrieval index update.
5. Review stale-article queue and retire or refresh low-trust content.
