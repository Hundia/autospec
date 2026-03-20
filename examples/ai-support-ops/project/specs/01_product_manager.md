# Product Manager Spec - AI Support Ops

## Vision
AI Support Ops gives B2B SaaS support teams one operational workspace for intake, routing, grounded AI assistance, approvals, QA, and analytics so they can move faster without losing human accountability.

## Problem Statement
Support teams usually split work across a help desk, internal docs, dashboards, spreadsheets, and ad hoc AI tools. That fragmentation slows first response, hides SLA risk, and makes auditability weak. This product unifies the queue and forces AI actions to stay observable, reviewable, and policy-safe.

## Assumptions
- First release serves B2B SaaS support operations, not consumer support centers.
- English is the default working language; translation is a workflow, not a full localization program.
- AI stays advisory. External replies always require a human send action.
- AWS-compatible deployment is acceptable for v1.

## Personas
### Maya Chen - Support Agent
- Goals: clear queue priority, grounded reply drafts, less tab switching.
- Frustrations: missing customer history, inconsistent macros, unclear escalation paths.
- Tech comfort: high in support tools, medium in analytics.

### Jordan Patel - Support Manager
- Goals: protect SLA, coach agents, manage approvals, monitor AI quality.
- Frustrations: blind spots in queue risk and inconsistent response quality.
- Tech comfort: medium-high.

### Elena Ruiz - Operations Analyst
- Goals: tune routing, automation, tags, and operational reporting.
- Frustrations: workflow drift and hard-to-debug automations.
- Tech comfort: high.

### Samir Okafor - Knowledge Manager
- Goals: publish approved runbooks, retire stale content, improve retrieval quality.
- Frustrations: conflicting docs and missing article ownership.
- Tech comfort: medium.

### Priya Singh - Workspace Admin
- Goals: secure tenant setup, control integrations, set retention and AI usage policy.
- Frustrations: weak audit trails and too many one-off settings.
- Tech comfort: high.

## Core User Stories
1. As an agent, I want a ticket summary with cited sources so I can respond quickly without guessing.
   - Given a routed ticket with approved knowledge
   - When AI summary runs
   - Then the UI shows a summary, source links, confidence band, and warnings.
2. As a manager, I want high-risk replies to require approval so humans remain accountable.
   - Given a draft marked refund, legal risk, or policy exception
   - When an agent requests send approval
   - Then the reply stays draft-only until a manager approves or rejects it.
3. As an analyst, I want routing and SLA rules to be explainable so I can debug queue behavior.
   - Given a breached ticket
   - When I inspect its timeline
   - Then I can see classification inputs, chosen rule, and timer events.
4. As a knowledge manager, I want stale article flags so retrieval stays grounded in current guidance.
   - Given an approved article without recent review
   - When its review date expires or usage drops
   - Then it appears in the stale content queue.
5. As an admin, I want to disable AI by queue or action so I can control compliance exposure.
   - Given a regulated queue
   - When I disable outbound draft generation
   - Then the queue still works but AI reply actions are blocked and audited.

## Primary User Flow
```text
Inbound ticket -> normalize metadata -> classify and route -> start SLA timers
-> agent opens ticket -> view history, entitlements, related incidents, and suggestions
-> generate summary or draft -> human edits -> if high risk, request approval
-> manager approves/rejects -> agent sends response -> ticket moves pending customer
-> resolve -> QA sampling -> analytics and audit logging
```

## Edge Cases
- Customer reply within reopen window moves Resolved to Reopened.
- Merged child tickets cannot receive outbound replies.
- Ticket cannot enter Pending Customer without a sent response or draft prepared.
- Closed ticket changes require admin or auditor correction flow.
- Recursive automation attempts are prevented and logged.

## Feature Prioritization
### Must Have
- Multi-tenant workspaces, SSO/JWT sessions, RBAC
- Ticket intake, queueing, timeline, SLA tracking
- Grounded AI summaries and reply drafts with human review
- Knowledge approval workflow and retrieval
- Audit logs, QA sampling, core analytics

### Should Have
- Automation dry runs and conflict logging
- Escalation checklists, watchers, mentions
- Report exports and scheduled ops summaries

### Could Have
- Translation assist for secondary languages
- More advanced incident correlation
- Deeper billing and CRM enrichment cards

### Wont Have in v1
- Autonomous AI sending to customers
- Native mobile apps
- Voice support or transcript workflows
- Multi-region active-active deployment

## Success Metrics
- First response p95 improves by 35 percent within 90 days.
- Resolution time p95 improves by 20 percent within 90 days.
- AI-assisted draft acceptance rate reaches 55 percent by month 3.
- QA score stays above 92 percent for AI-assisted replies.
- SLA attainment stays above 97 percent for priority queues.
- Search p95 stays under 800 ms and workspace load p95 stays under 2.5 s.

## Release Slices
- Sprint 0: foundation and walking skeleton.
- Sprint 1: intake, routing, SLA, telemetry.
- Sprint 2: agent workspace and grounded AI assist.
- Sprint 3: knowledge lifecycle, automation, escalations.
- Sprint 4: QA, compliance, analytics, privacy.
- Sprint 5: enterprise auth, launch hardening, viewer validation pack.
