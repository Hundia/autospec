---
description: "Design and build a complete AutoDeck presentation from an outline"
mode: "agent"
---

# Create Presentation

Assemble a complete AutoDeck presentation from an outline using expert analysis and structured implementation.

Presentation outline: {{input}}

## Phase 1: Outline Analysis

Parse the outline into: title, audience, key messages, desired tone, and constraints.

If the outline is too vague, ask the user to clarify:
- Presentation title and subtitle
- Target audience (investors, developers, conference, internal team)
- Key messages (3-5 bullet points)
- Desired tone (inspirational, technical, educational, persuasive)

Determine narrative arc based on content type:
- **Pitch deck**: Problem, Solution, Traction, Market, Ask (5-15 slides)
- **Conference talk**: Hook, Context, Deep Dive, Demo, Takeaways (15-30 slides)
- **Onboarding**: Overview, Concepts, Walkthrough, Practice, Reference (10-20 slides)

## Phase 2: Expert Analysis (Parallel)

Run three expert analyses simultaneously:

**Narrative Expert**: Story arc with emotional trajectory, slide sequence, pacing notes, transition logic.

**Visual Design Expert**: Slide type map using the 13 types (`TitleSlide`, `ContentSlide`, `SplitSlide`, `GridSlide`, `TimelineSlide`, `PipelineSlide`, `CodeSlide`, `DiagramSlide`, `MetricsSlide`, `BalanceSlide`, `EraSlide`, `QuoteSlide`, `ClosingSlide`), background assignments from 12 options (`particles`, `grid`, `circuits`, `gradient`, `matrix`, `constellation`, `waves`, `hex`, `aurora`, `fireflies`, `rain`, `nebula`), theme recommendation (`dark`, `light`, `midnight`, `sunrise`).

**Technical Content Expert**: Visualization map using the 15 components (`TerminalWindow`, `BrowserMockup`, `FileTree`, `FlowDiagram`, `ChatWindow`, `CodeBlock`, `BalanceBeam`, `KanbanBoard`, `ArchitectureDiagram`, `ProcessLoop`, `Checklist`, `GradientText`, `AnimatedCounter`, `ProgressRing`, `ScrollProgressBar`), data requirements, code samples, custom component flags.

## Phase 3: Presentation Assembly

Merge expert recommendations into a unified slide manifest:

| # | Slide Type | Title | Background | Key Content | Components |
|---|-----------|-------|------------|-------------|------------|

Draft all content -- titles, subtitles, body text, data values, code snippets. No placeholders.

Present the manifest to the user for approval before implementation.

## Phase 4: Implementation (Parallel)

On user approval, launch implementation in parallel:

**Agent A -- Main Deck File**: Create `deck.tsx` with `Presentation` wrapper, theme, background, and all slide components in sequence with proper imports.

**Agent B -- Custom Visualizations**: Build `TerminalWindow` instances, `FlowDiagram` definitions, data arrays for metrics, and reusable visual elements.

**Agent C -- Custom Slides**: Create any slides that extend built-in types, composite layouts, animated variants, or slides with embedded demos.

## Phase 5: Quality Checklist
- [ ] `npm run build` exits 0
- [ ] All slides render without console errors
- [ ] Keyboard navigation (Left/Right) works through all slides
- [ ] Responsive layout at mobile viewport widths
- [ ] Consistent theme across all slides
- [ ] No placeholder text remaining

## Phase 6: Review

Present slide-by-slide summary with expert contributions, files created, and ask whether to commit, modify, or discard.

## File Structure
```
packages/autodeck/src/
├── deck.tsx                          # Main presentation file
├── slides/<slide-name>/
│   ├── <SlideName>.tsx               # Slide component
│   └── <CustomVisualization>.tsx     # Custom viz components
└── components/shared/               # Reusable components
```
