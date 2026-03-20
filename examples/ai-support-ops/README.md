# AI Support Ops - AutoSpec Validation Example

This example clones the AutoSpec framework into a self-contained workspace and then uses the cloned framework to generate a new project for `AI Support Ops`, an AI-assisted customer support operations platform.

## Why This Example Exists

This is a framework validation example, not just another sample app.

It is designed to prove that AutoSpec can:
- turn a rich SRS into deep specs, docs, prompts, and sprint artifacts
- generate GitHub Copilot guidance tailored to `vscode-copilot`
- plan with `gpt-5.4` and route lower-risk execution work to `gpt-5.3` and `gpt-5.2`
- produce viewer-friendly artifacts such as flows, state transitions, backlogs, and sprint documents

## Structure

```text
ai-support-ops/
├── PLAN.md
├── requirements/
│   └── srs.md
├── project/
├── QUICKSTART.md
├── docs/
├── skills/
└── ...
```

## Validation Focus

- Copilot instructions in `project/.github/copilot-instructions.md`
- GPT-5.x routing in `project/specs/backlog.md`
- planning vs execution guidance in `project/prompts/`
- documentation density and viewer readiness in `project/docs/`

## How This Example Is Used

1. Write the SRS in `requirements/srs.md`
2. Patch the cloned framework for Copilot + GPT-5.x routing
3. Execute the cloned `QUICKSTART.md`
4. Inspect the generated output in `project/`

This keeps the framework copy intact while isolating generated artifacts for review.
