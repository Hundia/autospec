# AutoSpec Framework Improvement Proposal

Date: 2026-03-14
Based on: `examples/ai-support-ops/REVIEW.md`, `examples/ai-support-ops/VIEWER_BENCHMARK.md`, and `examples/ai-support-ops/project/sprints/sprint_0/validation_drill.md`

## Goal

Improve AutoSpec so Quickstart better validates:
- GPT-5.4 planning plus GPT-5.3 / GPT-5.2 execution
- one-shot viewer generation quality
- literal sprint executability, not just planning-document quality

## Executive Summary

The validation run shows that AutoSpec is already good at generating coherent planning artifacts, but it over-promises completeness relative to current output depth. The next framework evolution should make the generated artifacts more operational, especially around planner handoffs, runnable Sprint 0 scaffolding, and viewer-specific data/storytelling packs.

## Key Findings

### 1. Quickstart Is Strongest As A Planning Generator

Evidence:
- coherent specs/backlog/docs/prompts
- consistent GPT-5.x routing
- useful viewer seed data

Implication:
- The framework should either narrow its promise or deepen its generated outputs.

### 2. GPT-5.x Routing Needs Stronger Operational Encoding

Current state:
- routing appears in policy, backlog metadata, and prompt text

Gap:
- no required planner brief
- no enforced planner-to-executor handoff
- no escalation protocol when execution fails

Proposal:
- Add a standard `planner_brief.md` artifact per sprint or per high-risk ticket.
- Require `gpt-5.4` tickets to emit decisions, contracts, acceptance checks, and escalation triggers.
- Require `gpt-5.3` tickets to reference the planner brief explicitly.

### 3. Sprint 0 Must Become Literally Executable

Current state:
- Sprint 0 prompt references commands like lint, test, build, curl, and Docker startup
- generated project contains no runnable app scaffold

Gap:
- prompts imply immediate execution, but the project is docs-only

Proposal:
- Introduce a Quickstart mode that also generates a minimal runnable skeleton:
  - root `package.json`
  - workspace layout
  - placeholder app packages
  - Docker Compose
  - health endpoint shell
  - test/build scripts
- Alternative: explicitly split Quickstart into:
  1. planning generation
  2. walking-skeleton generation

### 4. Viewer Output Needs Its Own First-Class Spec

Current state:
- viewer data exists, but no strict viewer information architecture or storytelling brief

Gap:
- one-shot viewer generation remains guess-heavy

Proposal:
- Add generated `docs/viewer/` or `viewer-spec.md` containing:
  - viewer page map
  - navigation hierarchy
  - executive overview story
  - chart inventory
  - artifact browser behavior
  - interaction model

### 5. Viewer Data Needs More Realistic Operational Samples

Current state:
- good structural JSON, weak realistic content density

Proposal:
- Generate sample datasets for:
  - ticket records
  - approval records
  - audit events
  - QA reviews
  - SLA and backlog timeseries
  - escalation and policy-block examples

### 6. Generated Prompts Need More Ticket-Specific Specificity

Current state:
- sprint prompts are usable but repetitive

Proposal:
- enrich prompts with per-ticket:
  - acceptance criteria
  - contract changes
  - exact files likely touched
  - risks and likely regressions
  - model-specific responsibilities

## Recommended Framework Changes

### Priority 1 - Make the Promise Honest or the Output Deeper

Choose one:
- reduce Quickstart claims to “planning and documentation generation,” or
- deepen generated files substantially to match current promise

### Priority 2 - Add Planner Handoff Artifacts

Generate:
- `prompts/planner-brief.template.md`
- sprint-level planner handoff guidance
- high-risk ticket handoff sections in dev prompts

### Priority 3 - Generate A Minimal Runnable Skeleton

Add an option or second phase that emits:
- workspace structure
- app manifests
- root scripts
- basic Docker services
- health route and shell app

### Priority 4 - Add Viewer-Specific Output Pack

Generate:
- `viewer-spec.md`
- richer viewer JSON
- sample ops data
- screen composition notes for the viewer itself

### Priority 5 - Add Validation Rubrics To The Framework

Generate internal evaluation docs such as:
- `review/quickstart-validation.md`
- `review/viewer-readiness.md`
- `review/sprint-executability.md`

These would help users assess generated quality consistently.

## Suggested Success Criteria For The Next Version

Quickstart should be considered improved when it can:

1. Generate a project where Sprint 0 can actually run.
2. Produce backlog and prompts with explicit planner handoffs.
3. Produce docs with enough depth to avoid obvious contract ambiguity.
4. Produce a viewer package that scores at least 30/40 on the strict benchmark.
5. Preserve GPT-5.x routing consistently across all generated artifacts.

## Final Recommendation

Do not treat the current validation as a failure. Treat it as evidence that AutoSpec has already crossed the threshold from idea to useful planning framework. The next step is to convert it from a strong planning generator into a stronger execution and presentation generator.
