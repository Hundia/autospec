# Viewer Readiness Benchmark

Date: 2026-03-14
Scope: `examples/ai-support-ops/project/viewer/` and supporting generated artifacts
Purpose: Measure whether the generated project is strong enough for a high-quality one-shot viewer generation.

## Scoring Model

Each category is scored 0-5.

- 0 = missing
- 1 = weak outline only
- 2 = present but too thin
- 3 = usable first pass
- 4 = strong and detailed
- 5 = production-grade input for one-shot generation

Maximum score: 40

## Categories

### 1. Information Architecture for the Viewer
Question: Is there a clear spec for the viewer itself, not just the product being viewed?

Score: 2/5

Evidence:
- `project/viewer/README.md`
- `project/docs/ui-design-system/screens.md`

Assessment:
- There is a content bundle and some viewer-specific validation screens after hardening.
- There is still no dedicated viewer app spec that defines nav, page priorities, storytelling, executive overview structure, or interaction hierarchy.

### 2. Structured Data Richness
Question: Do JSON assets contain enough depth to drive charts, diagrams, and stateful screens without heavy invention?

Score: 3/5

Evidence:
- `project/viewer/src/data/backlog.json`
- `project/viewer/src/data/workflows.json`
- `project/viewer/src/data/flows.json`
- `project/viewer/src/data/architecture.json`

Assessment:
- Strong baseline structure exists.
- Missing richer metadata such as annotations, severity, legends, role overlays, realistic event samples, and drill-down payloads.

### 3. Content Density and Storytelling
Question: Does the content support a compelling, persuasive viewer narrative?

Score: 3/5

Evidence:
- `project/viewer/src/data/requirements.md`
- `project/viewer/src/data/specs/01_product_manager.md`
- `project/viewer/src/data/docs/architecture/overview.md`
- sprint summary mirrors in `project/viewer/src/data/sprints/`

Assessment:
- Enough material exists for a competent narrative.
- Still limited in realistic examples, executive framing, and before/after evidence.

### 4. Visual Design Direction
Question: Could a separate model infer a non-generic visual language from the generated materials?

Score: 3/5

Evidence:
- `project/viewer/src/data/docs/ui-design-system/tokens.md`
- `project/viewer/src/data/docs/ui-design-system/screens.md`
- `project/viewer/src/data/specs/10_ui_designer.md`

Assessment:
- Good token start: color, typography, and product mood are present.
- Screen-level and component-state detail is still too light for consistent one-shot excellence.

### 5. Cross-Artifact Consistency
Question: Do specs, docs, backlog, and viewer data agree well enough to avoid downstream confusion?

Score: 4/5

Evidence:
- `project/specs/backlog.md`
- `project/.github/copilot-instructions.md`
- `project/viewer/src/data/backlog.json`
- `project/viewer/src/data/workflows.json`

Assessment:
- GPT-5.x routing is very consistent.
- Product scope and sprint structure align well.
- Some older mirrored viewer markdown may lag hardened docs unless refreshed again.

### 6. Sample Operational Data
Question: Are there realistic tickets, approvals, audit events, analytics series, and QA examples to visualize?

Score: 1/5

Evidence:
- `project/viewer/src/data/backlog.json`
- lack of realistic sample datasets for audit/event/analytics records

Assessment:
- This is the biggest weakness.
- The viewer will have to invent too much of the actual operational story.

### 7. Diagram Readiness
Question: Are architecture and workflow graphs rich enough to produce polished diagrams in one pass?

Score: 3/5

Evidence:
- `project/viewer/src/data/architecture.json`
- `project/viewer/src/data/workflows.json`
- `project/viewer/src/data/flows.json`

Assessment:
- Good node-edge basis exists.
- Missing groupings, notes, labels for alternate paths, failure edges, and visual emphasis metadata.

### 8. One-Shot Generation Confidence
Question: If another strong model is told to generate the viewer in one pass, how likely is a high-quality result?

Score: 2/5

Assessment:
- Likely outcome: decent first pass.
- Unlikely outcome: polished stakeholder-grade viewer without more input.

## Total Score

- 21 / 40
- 52.5%

## Rating Band

- 0-15: weak
- 16-24: moderate
- 25-32: strong
- 33-40: one-shot ready

Current rating: **moderate**

## Interpretation

The generated project is rich enough to support a promising viewer iteration, but not yet one-shot ready by a strict benchmark. The main blockers are missing viewer-specific IA, thin sample operational data, and insufficiently detailed visual composition guidance.

## Highest-Impact Improvements

1. Add a dedicated viewer specification with page map, navigation, sections, and storytelling goals.
2. Generate realistic sample operational datasets:
   - tickets
   - approvals
   - audit events
   - analytics timeseries
   - QA scorecards
3. Add richer graph metadata for annotations, status color, alternate paths, and drill-down details.
4. Refresh mirrored viewer markdown after every hardening pass so data and docs stay aligned.

## Verdict

Viewer generation quality in one shot is **not yet proven**.
The current artifact bundle is good for a strong prototype pass, not a confident final-pass viewer.
