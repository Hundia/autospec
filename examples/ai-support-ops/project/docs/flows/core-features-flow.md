# Core Features Flow

## Ticket Intake to Resolution

```text
Inbound event
  -> normalize channel payload and dedupe
  -> classify topic, language, severity, account tier
  -> assign queue and start SLA timers
  -> agent opens workspace
  -> fetch context, incidents, entitlements, history, and approved knowledge
  -> generate summary or draft
  -> if high risk: approval flow
  -> send response
  -> move to Pending Customer
  -> resolve or reopen based on customer response window
  -> QA sample and analytics aggregation
```

## Knowledge Publish Flow

```text
Draft article
  -> assign owner and review date
  -> manager approval
  -> publish approved version
  -> update retrieval index
  -> track usage, acceptance, and freshness
  -> stale flag review and refresh decision
```

## Escalation Flow

```text
Agent requests escalation
  -> require target team and reason code
  -> sync watchers and checklist tasks
  -> move ticket to Escalated
  -> specialist team works ticket
  -> resolution feedback returns to originating queue timeline
```

## AI Approval Flow

```text
Draft requested
  -> AI returns draft, citations, warnings, telemetry
  -> policy gate checks risk and queue settings
  -> if blocked: return Policy Blocked
  -> if approval required: Awaiting Approval
  -> manager approves or rejects
  -> approved draft can be sent by human agent
```
