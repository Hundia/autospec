---
title: "Viewer Design System"
sprint: "1.2, 1.3"
created: "2026-03-09"
---

# Viewer Design System

## Origin
Adapted from FitnessAiManager (Sivania) design system. Source:
- `/opt/FitnessAiManager/apps/web/tailwind.config.js`
- `/opt/FitnessAiManager/apps/web/src/design-system/components/primitives/`

Adaptations:
- Removed: RTL classes, Hebrew fonts (Heebo, Rubik, Assistant), direction-rtl
- Added: Inter (body), JetBrains Mono (code)
- Extended Badge: added `done`, `in-progress`, `todo`, `blocked`, `qa`, `haiku`, `sonnet`, `opus` variants

## Color Tokens
| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| parchment | `#f5f3ed` | `bg-parchment` | Page background |
| cream | `#faf9f5` | `bg-cream` | Card/surface background |
| sage | `#698472` | `bg-sage` | Primary actions, active nav |
| sage-600 | `#536a5b` | `bg-sage-600` | Hover state |
| terracotta | `#8e6a59` | `bg-terracotta` | Accents, headings, errors |
| sand | `#d8d0ba` | `bg-sand` | Borders |
| sand-200 | `#e8e4d8` | `bg-sand-200` | Subtle fills |
| charcoal | `#1a1a1a` | `text-charcoal` | Body text |

## Typography
- **Body:** Inter (Google Fonts, weights: 300/400/500/600/700)
- **Code:** JetBrains Mono (Google Fonts, weights: 400/500)

## Primitives
| Component | Source | Modifications |
|-----------|--------|--------------|
| Button | FitnessAiManager | Removed font-hebrew → font-sans |
| Card | FitnessAiManager | Direct port, removed RTL padding |
| Badge | FitnessAiManager | Extended: 8 new SDD-specific variants |
| Input | FitnessAiManager | Removed RTL padding swap |

## Forbidden
- `shadcn/ui` — conflicts with warm palette
- RTL CSS (`dir-rtl`, `text-right` as default)
- Dark slate (`#0f172a`, `slate-950`, `zinc-900`)
