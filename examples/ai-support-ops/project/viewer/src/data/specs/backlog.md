# AI Support Ops Backlog

Generated: 2026-03-14
Total Tickets: 38
Total Story Points: 157

Environment: vscode-copilot
Routing policy: use gpt-5.4 for planning, architecture, security, debugging, and reviews; gpt-5.3 for standard implementation; gpt-5.2 for boilerplate, docs, tests, and simple repetitive work.

## Sprint 0: Foundation and Walking Skeleton
Goal: Stand up the tenant-aware platform skeleton, baseline auth, queue intake, UI shell, and delivery pipeline.

| ID | Title | Description | Points | Status | Owner | Model | Dependencies |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0.1 | Scaffold mono-repo service layout | Create api, worker, web, and viewer-ready data package skeleton with shared configs. | 5 | todo | DevOps | gpt-5.2 | - |
| 0.2 | Create tenant and identity schema baseline | Model workspaces, users, roles, queues, and session tables with migration strategy. | 3 | todo | DB | gpt-5.3 | 0.1 |
| 0.3 | Implement queue and ticket walking skeleton | Expose health, auth bootstrap, queue list, and basic ticket create/read endpoints. | 5 | todo | Backend | gpt-5.3 | 0.2 |
| 0.4 | Build support workspace shell | Create dashboard shell, navigation, queue list view, and shared design tokens. | 3 | todo | Frontend | gpt-5.2 | 0.1 |
| 0.5 | Add CI, Docker, and quality gates | Wire lint, typecheck, tests, build, and Docker Compose for local and CI usage. | 4 | todo | DevOps | gpt-5.4 | 0.1, 0.2, 0.3, 0.4 |

## Sprint 1: Intake, Routing, and SLA Control
Goal: Ship ticket intake channels, metadata normalization, routing rules, SLA timers, and queue operations dashboards.

| ID | Title | Description | Points | Status | Owner | Model | Dependencies |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1.1 | Build multichannel ticket intake adapters | Support email, web form, chat simulation, and API ingestion with idempotency keys. | 5 | todo | Backend | gpt-5.3 | 0.3 |
| 1.2 | Extend ticket schema for timeline and metadata | Add attachments, custom fields, tags, language, sentiment, account tier, and immutable timeline events. | 3 | todo | DB | gpt-5.2 | 0.2 |
| 1.3 | Implement routing and SLA policy engine | Classify tickets, assign queues, compute first-response and resolution timers, and flag breach risk. | 5 | todo | Backend | gpt-5.4 | 1.1, 1.2 |
| 1.4 | Deliver queue workspace and SLA views | Show queue cards, priority lanes, breach risk badges, and agent assignment actions. | 5 | todo | Frontend | gpt-5.3 | 1.1, 1.3 |
| 1.5 | Create intake and routing test packs | Add unit, integration, and curl scenarios for normalization, idempotency, and SLA timers. | 3 | todo | QA | gpt-5.2 | 1.1, 1.3 |
| 1.6 | Log AI telemetry envelope fields | Capture model version, template id, latency, token usage, sources, and human outcome for every AI event. | 3 | todo | Backend | gpt-5.2 | 1.2 |
| 1.7 | Publish viewer backlog and flow seeds | Generate backlog JSON, intake flow graphs, and SLA state data for viewer validation. | 2 | todo | Frontend | gpt-5.2 | 1.3, 1.4 |

## Sprint 2: Agent Workspace and AI Assist
Goal: Enable grounded AI summaries and reply drafting with required human review and approval-safe outbound flows.

| ID | Title | Description | Points | Status | Owner | Model | Dependencies |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2.1 | Assemble unified ticket context service | Aggregate customer history, entitlements, incidents, related tickets, and recent telemetry into one API. | 5 | todo | Backend | gpt-5.3 | 1.1, 1.2 |
| 2.2 | Design high-risk AI planning and policy checks | Add planner-first validation for refunds, policy exceptions, and high-risk reply suggestions. | 5 | todo | Backend | gpt-5.4 | 2.1, 1.6 |
| 2.3 | Build grounded reply composer | Show summaries, draft replies, confidence band, citations, warnings, and rewrite actions in the agent workspace. | 5 | todo | Frontend | gpt-5.3 | 2.1, 2.2 |
| 2.4 | Add approval workflow for outbound replies | Route selected replies to managers for approval before send and enforce draft-only AI responses. | 5 | todo | Frontend | gpt-5.3 | 2.2, 2.3 |
| 2.5 | Implement approved knowledge retrieval index | Index runbooks, macros, and help articles for citation-backed AI suggestions. | 5 | todo | Backend | gpt-5.3 | 1.2 |
| 2.6 | Create AI assist policy and regression tests | Test human review gates, citation rendering, approval rules, and latency budgets. | 3 | todo | QA | gpt-5.2 | 2.2, 2.3, 2.4, 2.5 |
| 2.7 | Package AI assist viewer artifacts | Add architecture, flow, and screen data for AI draft lifecycle and approval states. | 2 | todo | Frontend | gpt-5.2 | 2.3, 2.4 |

## Sprint 3: Knowledge, Automation, and Escalations
Goal: Operationalize approved knowledge, automation rules, escalations, collaboration, and admin AI controls.

| ID | Title | Description | Points | Status | Owner | Model | Dependencies |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 3.1 | Ship knowledge lifecycle workflows | Support article drafts, approvals, ownership, review dates, categories, and stale content flags. | 5 | todo | Backend | gpt-5.3 | 2.5 |
| 3.2 | Create macro and canned response admin UI | Provide CRUD views, usage stats, and guardrails for macros and canned replies. | 3 | todo | Frontend | gpt-5.2 | 3.1 |
| 3.3 | Build automation rule engine with dry-run | Execute event and scheduled rules, block recursion, and write conflict and execution logs. | 5 | todo | Backend | gpt-5.4 | 1.3, 3.1 |
| 3.4 | Implement escalations and collaboration | Support specialist handoffs, internal notes, mentions, watchers, and checklist tasks. | 5 | todo | Frontend | gpt-5.3 | 3.3 |
| 3.5 | Add queue-level AI control settings | Allow admins to disable AI by queue, channel, or action type with audit coverage. | 3 | todo | Frontend | gpt-5.2 | 2.2, 3.3 |
| 3.6 | Create integration and webhook framework | Connect CRM, billing, incident tooling, and outbound automation hooks. | 5 | todo | Backend | gpt-5.3 | 3.3 |
| 3.7 | Expand knowledge and automation QA suites | Cover dry-run logs, escalation transitions, AI disable rules, and webhook retries. | 3 | todo | QA | gpt-5.2 | 3.1, 3.3, 3.4, 3.5, 3.6 |

## Sprint 4: QA, Compliance, and Analytics
Goal: Deliver QA sampling, audit visibility, operational analytics, privacy tooling, and production-grade accessibility and performance.

| ID | Title | Description | Points | Status | Owner | Model | Dependencies |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 4.1 | Implement QA sampling and scorecards | Sample resolved tickets by policy and score accuracy, empathy, compliance, and completeness. | 5 | todo | Backend | gpt-5.3 | 2.4, 3.4 |
| 4.2 | Build audit log explorer | Expose prompt, output, approval, workflow, latency, and override events with tenant-safe filters. | 5 | todo | Frontend | gpt-5.3 | 1.6, 2.2, 3.3 |
| 4.3 | Launch analytics dashboards and exports | Show backlog, SLA, reopen, escalation, QA, and AI acceptance metrics with filters and exports. | 5 | todo | Frontend | gpt-5.3 | 4.1, 4.2 |
| 4.4 | Schedule recurring ops summaries | Generate and deliver daily and weekly summaries to managers and analysts. | 3 | todo | Backend | gpt-5.2 | 4.3 |
| 4.5 | Implement privacy retention and redaction controls | Add retention schedules, export/delete flows, and PII redaction in logs and telemetry. | 5 | todo | Backend | gpt-5.4 | 4.2 |
| 4.6 | Complete accessibility and performance hardening | Meet WCAG 2.1 AA for core flows and hold p95 workspace, search, and AI latency targets. | 4 | todo | QA | gpt-5.2 | 4.2, 4.3 |

## Sprint 5: Production Readiness and Launch
Goal: Finish enterprise auth, deployment hardening, observability, recovery, and launch validation artifacts.

| ID | Title | Description | Points | Status | Owner | Model | Dependencies |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 5.1 | Integrate SSO, SAML, and MFA policies | Support enterprise identity flows, role sync, and session hardening for admin-controlled tenants. | 5 | todo | Backend | gpt-5.4 | 0.2, 4.5 |
| 5.2 | Finalize AWS-compatible deployment topology | Publish IaC-ready service topology, autoscaling, backups, and storage controls. | 5 | todo | DevOps | gpt-5.3 | 0.5, 4.5 |
| 5.3 | Add health views, traces, and alerts | Track queue lag, SLA breach spikes, AI latency, webhook failures, and auth errors. | 5 | todo | DevOps | gpt-5.3 | 5.2 |
| 5.4 | Write staging and rollback runbooks | Document deploy checks, smoke tests, rollback triggers, and recovery drills. | 3 | todo | DevOps | gpt-5.2 | 5.2 |
| 5.5 | Execute launch verification suite | Run load, security, integration, and release packaging checks before launch. | 5 | todo | QA | gpt-5.3 | 5.1, 5.2, 5.3, 5.4 |
| 5.6 | Assemble executive viewer validation pack | Publish final viewer data, sprint metrics, diagrams, and review checklist for stakeholder signoff. | 2 | todo | Frontend | gpt-5.2 | 5.5 |

## Bug Backlog
| ID | Title | Severity | Status | Sprint | Notes |
| --- | --- | --- | --- | --- | --- |
| B.01 | Prevent recursive automation cascade on status updates | high | todo | 3 | Validate loop guards when rules update tickets that trigger sibling rules. |
| B.02 | Reopen window should ignore merged child replies | medium | todo | 4 | Merged child tickets cannot create outbound or reopen parent without correction flow. |
| B.03 | Redact billing account numbers from audit export | high | todo | 4 | Applies to prompt logs, webhook payload snapshots, and CSV exports. |
