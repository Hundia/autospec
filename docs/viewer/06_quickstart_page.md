---
title: QuickStart Page
created: 2026-03-21
sprint: 29
status: complete
---

# QuickStart Page

**Sprint:** 29 (tickets 29.15, 29.16, 29.17)
**Route:** `/quickstart`
**Component:** `viewer/src/pages/QuickStartPage.tsx`

## Purpose

The QuickStart page is a "for dummies" guide to AutoSpec — it assumes zero prior knowledge of Spec-Driven Development (SDD). It explains what AutoSpec IS before explaining how to use it, removing the common barrier of jumping straight into steps without context.

## Page Sections

### 1. Hero Section

Introduces AutoSpec with a high-level value proposition ("Turn your project requirements into a complete, AI-ready project structure in minutes") and includes a concise "What is SDD?" explainer box. This primes the user with the core concept before they choose a path.

### 2. What You Get (2x2 grid)

Four cards covering the key outputs of running AutoSpec:
- 10 Expert Specifications (10 role-based blueprints)
- Sprint Backlog (ready-to-execute tickets)
- Living Documentation (auto-updated architecture and API docs)
- Project Viewer (this app — the visual dashboard)

### 3. Choose Your Path (expandable cards)

Four provider cards, each expanding on click to reveal numbered steps:

| Provider | Icon | Accent Color | Badge |
|----------|------|--------------|-------|
| Claude Code | Terminal | sage/green | Recommended |
| GitHub Copilot | Github | blue | — |
| Cursor / Windsurf | MousePointer | amber | — |
| AutoSpec CLI | Package | purple | — |

Each card shows:
- Best-for description
- Numbered steps (with `<code>` blocks for commands)
- Optional note (cost estimate, Copilot template note, etc.)

State: `expandedProvider` (string | null), defaults to `'claude'` so Claude Code is open on first load.

### 4. FAQ (toggle cards)

Four frequently asked questions using `openFaq` (number | null) state:
- Do I need an API key?
- What does it cost?
- Can I use my own AI tool?
- What if generation gets interrupted?

## Design Decisions

**Why explain SDD first?** Users arriving at a "Quick Start" page often have no idea what SDD means. Without the context box, the steps feel arbitrary. The hero explainer reframes the entire flow as intentional.

**Why expandable cards per provider?** Showing all four providers' steps simultaneously creates cognitive overload. Expandable cards let users focus on their chosen tool while retaining the ability to compare options.

**Why per-provider paths instead of one universal guide?** Each tool has genuinely different setup steps (template vs curl vs npm install). A single guide would require so many conditional branches it becomes hard to follow. Separate paths are cleaner.

**Why default Claude Code open?** It's the recommended path and most likely entry point for users coming from the AutoSpec repository. Defaulting it open reduces one click for the majority of users.

## Integration Points

- **Dashboard CTA** (29.17): `DashboardPage.tsx` has a "New to AutoSpec?" card that navigates to `/quickstart`
- **Sidebar** (29.16): "Quick Start" with Rocket icon appears first in `bottomNavItems`
- **Route** (29.16): `<Route path="/quickstart" element={<QuickStartPage />} />` in `App.tsx`

## Component Sources

- `Card`, `CardContent` from `../components/primitives/Card`
- `Badge` from `../components/primitives/Badge`
- Icons from `lucide-react`: `Terminal`, `Github`, `MousePointer`, `Package`, `ChevronDown`, `ChevronRight`

## Design System Compliance

Uses warm palette exclusively:
- `text-terracotta` for main heading
- `bg-sand-200` / `border-sand` for explainer and FAQ backgrounds
- `bg-sage` / `text-cream` for numbered step indicators and expand buttons
- `text-charcoal` for body text
- `text-sand-600` for secondary/helper text

No shadcn/ui, no @radix-ui, no RTL classes.
