# AutoSpec Quality Gates

> **What this section covers:** This section defines quality validation rules for all generated files and the viewer app. Read this for final verification before marking generation complete.
>
> **When to read:** After completing all file generation, before marking the generation task as done. Use this as a checklist to verify every output meets the required standard.

---

══════════════════════════════════════════════════════════════
SECTION 8 — QUALITY GATES
══════════════════════════════════════════════════════════════

Every generated file must:

  ✓ Be SPECIFIC to this project — no "[insert here]" placeholders.
  ✓ Cross-reference other files by name (e.g., "See specs/02_backend_lead.md").
  ✓ Use consistent naming across all files.
  ✓ Contain concrete examples (real endpoint paths, real table names).

Specs: 300–800 lines each.
Docs: 100–300 lines each.
Viewer: must build with zero TypeScript errors (strict mode).

VIEWER-SPECIFIC QUALITY GATES (all must pass):

  ✓ shadcn/ui is used for ALL UI primitives (Button, Card, Badge, Tabs,
    Table, Select, Dialog, Sheet, Tooltip, etc.) — NO custom implementations
  ✓ Recharts is used for ALL charts with consistent CHART_COLORS theme
  ✓ Dashboard page has at LEAST 3 different Recharts charts visible
  ✓ Dashboard page has animated stat counter Cards
  ✓ Dashboard page has a clickable mini architecture diagram
  ✓ Design System page EXISTS with 7 tabs (colours, typography, components,
    screens, spacing, icons, accessibility)
  ✓ Design System page renders live colour swatches (not just hex text)
  ✓ Design System page renders live interactive component examples
  ✓ Design System page shows screen inventory with wireframe previews
  ✓ Design System is the SECOND item in sidebar (after Dashboard)
  ✓ Specs page shows a visual Card grid (not a text list)
  ✓ Docs page shows folder Cards with file count Badges
  ✓ Backlog page has BOTH kanban board view AND table view
  ✓ Backlog page has at least 2 charts (status distribution, burndown)
  ✓ Workflows page renders <ReactFlow> graphs with animated edges
  ✓ Architecture page renders <ReactFlow> graphs from architecture.json
    (NOT markdown text, NOT ASCII boxes, NOT bullet lists — React Flow only)
  ✓ Flows page renders <ReactFlow> graphs from flows.json
    (NOT markdown text, NOT numbered steps, NOT bullet lists — React Flow only)
  ✓ Every page has at least one interactive/visual element beyond text
  ✓ Dark theme is the default with proper contrast ratios
  ✓ Sidebar navigation links to all 10 pages and works correctly
  ✓ The app looks like a premium SaaS dashboard, NOT a markdown reader

══════════════════════════════════════════════════════════════
BEGIN GENERATION
══════════════════════════════════════════════════════════════

Read all documents in {{INPUT_FOLDER}}.
Generate every file listed above.
Start now.

---
*Source: QUICKSTART.md — Part 7 of 7*
