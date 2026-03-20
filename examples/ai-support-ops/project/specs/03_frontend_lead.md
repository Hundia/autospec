# Frontend Lead Spec - AI Support Ops

## Stack
- React 18 + TypeScript + Vite
- TanStack Router for route-level data loaders and auth guards
- Zustand for lightweight UI state and TanStack Query for server state
- Tailwind CSS for utility styling and tokenized themes
- Recharts for dashboards and trend charts

## App Structure
```text
App
|- AuthLayout
|  |- LoginPage
|- WorkspaceLayout
   |- DashboardPage
   |- QueuePage
   |- TicketDetailPage
   |- KnowledgePage
   |- RulesPage
   |- QAReviewPage
   `- AnalyticsPage
```

## Global State
- auth session, workspace, feature flags, reduced motion, draft panel state.
- live filters for queue, SLA status, assignee, product, language.

## Local State
- form dirtiness, modal visibility, tab selection, editor content, inline validation.

## Routing Table
| Route | Guard | Purpose |
| --- | --- | --- |
| /login | public | Email or SSO sign-in |
| /dashboard | authenticated | Queue health and KPIs |
| /queues/:queueId | authenticated | Backlog lane and SLA view |
| /tickets/:ticketId | authenticated | Full agent workspace |
| /knowledge | manager+ | Article and macro operations |
| /rules | analyst+ | Automation rules and logs |
| /qa | manager+ | QA sampling and rubric review |
| /analytics | manager+ | Operational trends and exports |
| /admin | admin | Roles, integrations, retention, AI controls |

## Design Tokens
- Background `#0d1b2a`, surface `#132238`, panel `#1b3148`
- Primary `#2a9d8f`, secondary `#e76f51`, accent `#f4a261`
- Success `#52b788`, warning `#ffb703`, danger `#d62828`
- Type: `Manrope` for headings, `Source Sans 3` for body, `JetBrains Mono` for code
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64 px
- Radius: 8, 12, 20 px

## Form Pattern
- React Hook Form + Zod resolver.
- Inline field errors, form-level summary banner, optimistic save only for low-risk settings.
- Draft editor uses autosave for internal notes, explicit save for external drafts.

## API Client Pattern
- Shared `apiClient` wraps fetch with tenant header, auth refresh, and structured errors.
- Query keys follow `['entity', workspaceId, filters]`.
- AI draft responses always normalize `model`, `confidence`, `warnings`, and `sources`.

## Performance Targets
- Workspace load p95 under 2.5 s.
- Search results p95 under 800 ms.
- Draft generation perceived loading under 6 s with skeleton and progress hints.
- Avoid layout shift over 0.1 on queue and ticket pages.

## Copilot Routing
- gpt-5.4 for page architecture, accessibility fixes, and hard UI bugs.
- gpt-5.3 for normal feature components and data wiring.
- gpt-5.2 for table columns, story fixtures, docs, and component tests.
