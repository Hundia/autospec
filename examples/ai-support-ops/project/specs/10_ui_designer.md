# UI Designer Spec - AI Support Ops

## Visual Direction
A confident operations-console look: deep ocean backgrounds, teal primary actions, warm alert colors, dense but calm dashboards, and explicit trust indicators around AI output.

## Screen Inventory
- Login and SSO handoff
- Dashboard with queue health and AI adoption
- Queue board with SLA lanes and assignment drawer
- Ticket detail workspace with history rail, draft composer, approvals panel, and timeline
- Knowledge center with article approval queue and stale content alerts
- Automation rules builder with dry-run logs
- QA review desk with rubric scoring and override reasons
- Analytics command center with exports and scheduled summaries
- Admin settings for identity, retention, integrations, and AI controls
- Modals: merge ticket, split ticket, escalate, request approval, confirm send, publish article

## Wireframe Notes
```text
[Header metrics] [queue filters]
[Ticket list]    [Ticket detail main panel]    [Context / AI / approvals rail]
[Timeline + notes + tasks under main panel]
```

## Component States
- Buttons: default, hover, pressed, disabled, loading.
- Badges: SLA healthy, at-risk, breached, approval-needed, ai-disabled.
- Tables: loading skeleton, empty state, dense populated state.
- Composer: draft, policy-blocked, awaiting approval, approved, sent.

## Responsive Rules
- Mobile < 640: stacked panels, bottom sheets for details.
- Tablet 640-1024: two-column split, collapsible context rail.
- Desktop > 1024: three-column workspace with sticky activity rail.

## Tokens
- Headings: Manrope 700, 40/32/24/20 px.
- Body: Source Sans 3 400, 16 px base.
- Code and ids: JetBrains Mono 13 px.
- Palette repeats frontend spec for self-containment.

## Accessibility
- WCAG 2.1 AA contrast for queue states and charts.
- Full keyboard triage flow: open ticket, navigate tabs, request approval, resolve.
- Live regions for draft generation and approval outcome.
- Focus returns to the triggering control after modal close.

## Motion
- Queue cards slide in on filter change.
- Draft panel uses short fade and height transition.
- Avoid flashy chart motion on critical incident pages.

## Copilot Routing
- gpt-5.4 for complex interaction patterns and accessibility review.
- gpt-5.3 for normal page composition and state wiring.
- gpt-5.2 for screen inventory docs, fixtures, and showcase data.
