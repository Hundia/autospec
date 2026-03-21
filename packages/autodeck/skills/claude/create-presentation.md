# Create Presentation

Assemble a team of expert AI agents to collaboratively design and build a complete AutoDeck presentation from an outline. Experts analyze the content in parallel, then the presentation is assembled, implemented, and verified.

## Usage

```
/create-presentation <outline description>
```

**Examples:**
- `/create-presentation Pitch deck for AutoSpec: AI-powered spec-driven development`
- `/create-presentation Conference talk: How we replaced 200 JIRA tickets with 10 spec files`
- `/create-presentation Team onboarding walkthrough for the AutoDeck component library`

## Instructions

When this command is invoked, execute the 6-phase workflow below. The argument `$ARGUMENTS` is the outline description.

---

### Phase 1: Outline Analysis

1. **Validate the outline.** If `$ARGUMENTS` is empty or too vague, ask the user to clarify:
   ```
   I need a clearer outline. Please describe:
   - Presentation title and subtitle
   - Target audience (investors, developers, conference, internal team)
   - Key messages (3-5 bullet points)
   - Desired tone (inspirational, technical, educational, persuasive)

   Example: "Pitch deck for AutoSpec targeting developer tool investors, emphasis on traction and TAM"
   ```

2. **Parse the outline** into structured fields: title, audience, key messages, desired tone, and any constraints (time limit, slide count, branding).

3. **Determine narrative arc** based on content type:
   - **Pitch deck** — Problem → Solution → Traction → Market → Ask (5-15 slides)
   - **Conference talk** — Hook → Context → Deep Dive → Demo → Takeaways (15-30 slides)
   - **Onboarding/educational** — Overview → Concepts → Walkthrough → Practice → Reference (10-20 slides)
   - **Thematic/custom** — derive from user's outline

4. **Announce the plan** to the user:
   ```
   ## Presentation Planning: [Title]

   | Field         | Value |
   |---------------|-------|
   | Audience      | [audience] |
   | Tone          | [tone] |
   | Narrative Arc | [arc type] |
   | Target Slides | [range] |
   | Theme         | [dark/light/midnight/sunrise] |

   Starting expert analysis...
   ```

---

### Phase 2: Slide Selection (Expert Team — PARALLEL)

Launch 3 experts simultaneously as **parallel Task agents**. Each produces a structured recommendation.

#### Narrative Expert

Produces:
- **Story Arc** — beginning / middle / end beats with emotional trajectory
- **Slide Sequence** — ordered list of slide purposes (e.g., "hook", "problem statement", "demo moment")
- **Pacing Notes** — where to slow down, speed up, or pause for impact
- **Transition Logic** — how each slide connects to the next

#### Visual Design Expert

Reads: available slide types, background options, theme definitions.

Produces:
- **Slide Type Map** — recommended type for each slide position from the 13 available: `TitleSlide`, `ContentSlide`, `SplitSlide`, `GridSlide`, `TimelineSlide`, `PipelineSlide`, `CodeSlide`, `DiagramSlide`, `MetricsSlide`, `BalanceSlide`, `EraSlide`, `QuoteSlide`, `ClosingSlide`
- **Background Assignments** — per-slide or section-based background selections
- **Theme Recommendation** — `dark`, `light`, `midnight`, or `sunrise` with rationale
- **Color Accent Strategy** — highlight colors for emphasis moments

#### Technical Content Expert

Produces:
- **Visualization Map** — which slides need `TerminalWindow`, `FlowDiagram`, `CodeBlock`, `MetricsPanel`, or other interactive components
- **Data Requirements** — any metrics, charts, or data tables needed
- **Code Samples** — languages, snippets, and syntax highlighting needs
- **Custom Component Flags** — slides that require components beyond built-in types

---

### Phase 3: Presentation Assembly

**Runs SEQUENTIALLY after Phase 2.** Synthesize all expert recommendations into a unified presentation spec.

1. **Merge recommendations** — resolve conflicts between experts (narrative arc wins for ordering, visual expert wins for styling, technical expert wins for component selection).

2. **Produce slide manifest:**

   | # | Slide Type | Title | Background | Key Content | Components |
   |---|-----------|-------|------------|-------------|------------|
   | 1 | TitleSlide | ... | gradient-blue | ... | — |
   | 2 | ContentSlide | ... | dark | ... | TerminalWindow |

3. **Draft all content** — titles, subtitles, body text, bullet points, data values, code snippets. Every slide fully specified, nothing left as placeholder.

4. **Present manifest to user** for approval before implementation:
   ```
   ## Presentation Manifest: [Title]
   [Full slide table]

   **Proceed to implementation?**
   ```

---

### Phase 4: Implementation (Agent Team — PARALLEL)

On user approval, launch 3 implementation agents in parallel:

#### Agent A — Main Deck File

Creates the primary `deck.tsx` file:
- `Presentation` wrapper with theme and global background
- All slide components in sequence with per-slide props
- Proper imports for every slide type and component used

#### Agent B — Custom Visualizations

Creates any custom visualization components needed:
- `TerminalWindow` instances with realistic command output
- `FlowDiagram` definitions with nodes and edges
- Data arrays for `MetricsSlide` or chart components
- Any reusable visual elements shared across slides

#### Agent C — Custom Slides

Creates any slides that extend or combine built-in types:
- Composite layouts not covered by the 13 standard types
- Animated or interactive slide variants
- Slides with embedded demos or live components

---

### Phase 5: Quality Checklist

Run verification sequentially:

1. **Build check** — `npm run build` exits 0
2. **Render check** — all slides render without console errors
3. **Navigation check** — keyboard left/right arrow navigation works through all slides
4. **Responsive check** — layout does not break at mobile viewport widths
5. **Style check** — consistent theme, no orphaned backgrounds, no mismatched fonts

If any check fails, fix and re-verify before proceeding.

---

### Phase 6: Present & Review

1. **Show slide-by-slide summary** to the user:
   ```
   ## Presentation Complete: [Title]

   ### Planning Team
   | Role | Contribution |
   |------|-------------|
   | Narrative Expert | [1-line summary] |
   | Visual Design Expert | [1-line summary] |
   | Technical Content Expert | [1-line summary] |

   ### Slide Summary
   | # | Type | Title | Notes |
   |---|------|-------|-------|
   | 1 | TitleSlide | [title] | [any notes] |
   ...

   ### Files Created
   - `src/deck.tsx` — main presentation ([N] slides)
   - `src/components/[...]` — custom components
   - [other files]

   **Ready to commit, or request modifications?**
   ```

2. **Wait for user confirmation:**
   - "Commit" — commit all files with message `feat(autodeck): create [title] presentation`
   - "Modify" — ask what to change, apply edits, re-run quality checklist, re-present
   - "Discard" — remove generated files

---

## Edge Cases

### Outline too vague
Ask user to clarify with the structured prompt (see Phase 1 step 1).

### Too many slides (>30)
Split into sections with clear act breaks. Suggest a "main deck + appendix" structure.

### No suitable built-in slide type
Agent C creates a custom slide component. Document it for reuse.

### Content requires live data or API calls
Flag as interactive requirement. Create static fallback with a note for the presenter.

### User wants to iterate on a subset of slides
Accept modification requests targeting specific slide numbers. Only regenerate affected slides and re-run quality checklist.

## Important Rules

- ALWAYS run experts in PARALLEL (Phase 2) — they are independent
- ALWAYS run implementation agents in PARALLEL (Phase 4) — they are independent
- NEVER proceed to implementation without user approval of the manifest (Phase 3)
- NEVER commit without user confirmation (Phase 6)
- ALWAYS draft complete content — no placeholder text like "TODO" or "Lorem ipsum"
- Every slide MUST use one of the 13 built-in types unless a custom type is justified
- Theme must be consistent across all slides unless intentional contrast is part of the narrative
- Use FinOps model selection: haiku (simple slides), sonnet (complex layouts), opus (custom components)
