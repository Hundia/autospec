# Plan Presentation Slide

Plan and implement a new or overhauled presentation slide using the agent team pattern.

## Usage
```
/plan-presentation <slide-description>
```

## Process

### Phase 1: Content Strategy
Analyze the slide's purpose and define:
- **Key message**: What should the audience remember?
- **Narrative position**: Where does this slide sit in the story arc?
- **Visual pattern**: Static single-screen, scrollable multi-section, or interactive?
- **Bilingual content**: Draft both EN and HE text

### Phase 2: UX/Layout Architecture
Decide on the layout approach:
- **Static slide**: Single viewport, `overflow-hidden`, mount-triggered animations (`animate`)
- **Scrollable slide**: Multi-viewport, `overflow-y-auto`, scroll-triggered animations (`whileInView`), needs `scrollable: true` in data
- **RTL considerations**: All layouts must work in both LTR (English) and RTL (Hebrew)
- **Responsive**: Must work on mobile viewports

### Phase 3: Animation Direction
Define animation strategy:
- Static slides: Use `initial` + `animate` with staggered `delay`
- Scrollable slides: Use `whileInView` + `viewport={{ once: true, amount: 0.3 }}`
- Never add new npm dependencies — use framer-motion + Tailwind + inline SVG
- Keep animations performant: prefer `opacity` and `transform` properties

### Phase 4: Implementation (Agent Team)
Spawn parallel agents where independent:

**Agent A — Layout & Infrastructure** (sonnet)
- Modify `PresentationPage.tsx` if new slide type needs special handling
- Create main slide component
- Wire up in `slideComponents` map

**Agent B — Visualization Components** (sonnet)
- Create visualization sub-components
- All in a dedicated subdirectory under `src/components/`
- Each component self-contained with its own animations

**Agent C — Data & Content** (sonnet)
- Update `slides-en.ts` with English content
- Update `slides-he.ts` with Hebrew translations
- Ensure structural parity between both files

**Agent D — Integration & QA** (sequential, after merge)
- Run `cd presentation && npm run build`
- Fix any TypeScript/build errors
- Verify EN/HE toggle works
- Verify keyboard navigation still works

### Phase 5: Quality Checklist
Before marking done, verify:
- [ ] `npm run build` exits 0
- [ ] Slide renders correctly in English
- [ ] Slide renders correctly in Hebrew (RTL)
- [ ] Arrow key navigation works (Left/Right)
- [ ] Progress dots show correct position
- [ ] If scrollable: scroll progress bar visible, Space key scrolls naturally
- [ ] If scrollable: `scrollTop` resets on slide change
- [ ] No console errors
- [ ] Mobile viewport renders acceptably
- [ ] Animations use correct trigger pattern (mount vs scroll)

### Phase 6: Commit & Deploy
After all checks pass, commit and push so changes are visible on GitHub Pages:
```bash
cd /opt/FitnessAiManager/autospec
git add presentation/ skills/claude/plan-presentation.md .claude/commands/plan-presentation.md
git commit -m "feat(presentation): <descriptive message>

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
git push origin main
```
This triggers the GitHub Pages workflow so the presenter can review the slide live.

## File Structure Convention
```
presentation/src/components/<slide-name>/
├── <SlideMain>.tsx          # Main component registered in slideComponents
├── <Visualization1>.tsx     # Sub-components for visual elements
├── <Visualization2>.tsx
└── ...
```

## Data Structure Convention
```typescript
// In slides-en.ts / slides-he.ts
{
  type: '<slide-type>',        // Maps to slideComponents key
  scrollable?: true,           // Optional: enables scroll mode in PresentationPage
  title: string,
  subtitle?: string,
  // ... slide-specific data
}
```

## Design System Reference
- Background: dark slate gradient (`from-slate-900 via-slate-800 to-slate-900`)
- Text: white with opacity variants (`text-white`, `text-white/60`, `text-white/40`)
- Accent colors: Use Tailwind color palette (blue, violet, emerald, cyan, amber, indigo, green)
- Cards: `bg-white/5 border border-{color}-500/20 rounded-xl`
- Terminal chrome: 3 dots (red/yellow/green) + dark background
- Browser chrome: 3 dots + URL bar + tab bar
