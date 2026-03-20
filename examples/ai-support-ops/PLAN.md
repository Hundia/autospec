# AI Support Ops Validation Plan

## Objective

Validate that AutoSpec can generate a strong example project for GitHub Copilot with explicit GPT-5.x model routing, rich docs/specs, and viewer-friendly artifacts.

## App Under Test

- Name: `AI Support Ops`
- Type: AI-assisted customer support operations platform
- Primary validation target: docs, specs, backlog, prompts, Copilot instructions, sprint artifacts, and viewer inputs

## Success Criteria

- `project/specs/backlog.md` routes work across `gpt-5.2`, `gpt-5.3`, and `gpt-5.4`
- `project/.github/copilot-instructions.md` is project-specific and operational
- sprint prompts separate planning from execution model usage
- docs are specific enough to be useful in the generated viewer artifacts
- generated output stays Copilot/GPT-5.x-oriented instead of defaulting to `haiku` / `sonnet` / `opus`

## Execution Phases

1. Create the example shell and requirements source of truth
2. Clone AutoSpec into this example root
3. Patch the cloned framework for Copilot + GPT-5.x routing
4. Execute the cloned `QUICKSTART.md` against `requirements/srs.md`
5. Review generated outputs in `project/`

## Review Checklist

- `project/specs/backlog.md`
- `project/.github/copilot-instructions.md`
- `project/prompts/finops.md`
- `project/prompts/multi-agent.md`
- `project/prompts/sprint_0/sprint_plan_0.md`
- `project/prompts/sprint_0/dev_sprint_0.md`
- `project/docs/workflows/multi-agent.md`
- `project/docs/environments/development.md`

## Notes

- The cloned framework remains inside `examples/ai-support-ops/`.
- Generated project artifacts are written into `examples/ai-support-ops/project/` to keep the framework copy inspectable.
