---
description: "Change the theme, background, colors, or visual style of a presentation"
mode: "agent"
---

# Restyle Presentation

Change the theme, background, colors, or visual style of an AutoDeck presentation.

Style change description: {{input}}

## Phase 1: Style Analysis
- Read the current theme configuration in the `Presentation` component props
- Read any per-slide style overrides and background settings
- Determine the scope: global theme, background effect, color palette, or specific slides only

## Phase 2: Design
- **Themes**: Select from `dark` (default), `light`, `midnight`, `sunrise`, or define a custom theme via `createTheme()` with tokens: `bg`, `text`, `accent`, `muted`, `border`
- **Backgrounds**: Choose from 12 animated presets: `particles`, `grid`, `circuits`, `gradient`, `matrix`, `constellation`, `waves`, `hex`, `aurora`, `fireflies`, `rain`, `nebula`
- Plan per-slide overrides for slides that need to deviate from the global style
- Verify text contrast remains readable against new backgrounds

## Phase 3: Implementation
- Update `Presentation` component's `theme` prop for global changes
- Update `background` prop globally or with per-slide overrides
- Modify slide-specific color classes if the new theme requires accent adjustments
- If using `createTheme()`, define all required color tokens
- Ensure changes work responsively across viewport sizes

## Phase 4: Quality Checklist
- [ ] `npm run build` exits 0
- [ ] All slides render with the new style consistently
- [ ] Text remains legible against new backgrounds and colors
- [ ] Background effects animate smoothly without performance issues
- [ ] No console errors

## Available Options

### Themes
| Theme | Description |
|-------|------------|
| `dark` | Dark slate gradient, white text (default) |
| `light` | Light background, dark text |
| `midnight` | Deep navy/indigo palette |
| `sunrise` | Warm amber/orange tones |
| `createTheme()` | Custom tokens: bg, text, accent, muted, border |

### Backgrounds
`particles` `grid` `circuits` `gradient` `matrix` `constellation` `waves` `hex` `aurora` `fireflies` `rain` `nebula`

### Design System
- **Cards**: Glass morphism (`bg-white/5 backdrop-blur-md border border-white/10 rounded-xl`)
- **Text**: `GradientText` for headings; `text-white` with opacity variants for body
- **Accents**: Tailwind palette -- blue, violet, emerald, cyan, amber, indigo
