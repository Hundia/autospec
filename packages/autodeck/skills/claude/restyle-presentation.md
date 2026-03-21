# Restyle Presentation

Change the theme, background, colors, or visual style of the presentation.

## Usage
```
/restyle-presentation <style change description>
```

## Process

### Phase 1: Style Analysis
- Read the current theme configuration in the `Presentation` component props
- Read any per-slide style overrides and background settings
- Understand the scope of the requested change: global theme, background effect, color palette, fonts, or specific slides only

### Phase 2: Design
- Select from built-in themes: `dark`, `light`, `midnight`, `sunrise`
- Or define a custom theme via `createTheme()` with custom color tokens
- Choose background effects from the 12 available presets (e.g., particles, gradient, aurora, mesh, waves, grid, dots, starfield, noise, spotlight, radial, none)
- Plan any per-slide overrides for slides that need to deviate from the global style
- Verify that text contrast ratios remain readable against new backgrounds

### Phase 3: Implementation
- Update the `Presentation` component's `theme` prop for global theme changes
- Update the `background` prop — either globally or with per-slide overrides
- Modify slide-specific color classes if the new theme requires adjustments (e.g., switching accent colors from blue to amber)
- If using `createTheme()`, define all required color tokens: `bg`, `text`, `accent`, `muted`, `border`
- Ensure all changes work in both LTR and RTL modes

### Phase 4: QA
- Run `npm run build` — must exit 0
- Visual consistency: all slides render with the new style, no unstyled elements
- Readability: text remains legible against new backgrounds and colors
- Check both EN and HE language modes
- Verify background effects animate smoothly without performance issues
- No console errors

### Phase 5: Commit & Push
Stage all changed files, commit with a descriptive message, and push to `origin/main`:
```bash
git commit -m "style(presentation): <what was restyled>

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
