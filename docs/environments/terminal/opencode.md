# OpenCode for AutoSpec Skills

**Version:** 1.0
**Last Updated:** 2026-03-16

---

## Overview

This repo now exposes the core AutoSpec Claude workflows as OpenCode-native skills and project commands.

OpenCode and Claude Code are not identical, but they can share the same workflow definitions when you map them correctly:

- Claude Code discovers slash commands from `.claude/commands/`
- OpenCode discovers skills from `.opencode/skills/*/SKILL.md`
- OpenCode discovers slash-style project commands from `.opencode/commands/*.md`
- OpenCode can also read Claude-compatible skills from `.claude/skills/`, but this repo uses `.opencode/skills/` so the setup is explicit and project-local

In this repo, the detailed workflow logic still lives in `skills/claude/`. The OpenCode wrappers point at those source files so there is one main workflow definition per command.

---

## What Was Added

### OpenCode Skills

These skills are available from `.opencode/skills/`:

- `execute-ticket`
- `qa-review`
- `sprint-status`
- `update-backlog`
- `create-spec`
- `create-sprint-docs`
- `sprint-close`
- `sprint-run`
- `plan-sprint`
- `plan-presentation`
- `help`

Each `SKILL.md` contains:

- OpenCode-required frontmatter (`name`, `description`)
- a short description of when to use the skill
- a pointer back to the source workflow in `skills/claude/`

### OpenCode Commands

These commands are available from `.opencode/commands/`:

- `/execute-ticket`
- `/qa-review`
- `/sprint-status`
- `/update-backlog`
- `/create-spec`
- `/create-sprint-docs`
- `/sprint-close`
- `/sprint-run`
- `/plan-sprint`
- `/plan-presentation`
- `/autospec-help`

The command files do not duplicate the whole workflow. They tell OpenCode to load the matching skill and include the authoritative source workflow file.

---

## Install and Verify OpenCode

### Check installation

```bash
which opencode
opencode --version
```

### Start in this repo

```bash
cd /opt/FitnessAiManager/autospec
opencode
```

OpenCode walks up from the current directory to the git root, so starting anywhere inside this repo should discover the `.opencode/` directory.

---

## How to Use the Commands

Inside the OpenCode TUI, type any of these:

```text
/autospec-help
/sprint-status 26
/execute-ticket 19.13
/update-backlog status 26.2 progress
/plan-sprint Add exportable audit logs for the admin dashboard
```

### Recommended starting commands

If you just want to learn the setup:

1. Run `/autospec-help`
2. Run `/sprint-status all`
3. Run `/execute-ticket 26.2` only when you are ready for actual implementation work

---

## How Skills Work in OpenCode

OpenCode skills are not commands by themselves. They are reusable instruction packs the agent can load.

In practice, you will usually interact through the commands above. The command tells the agent which skill/workflow to use.

For example:

- `/execute-ticket 4.3` uses the `execute-ticket` skill
- `/qa-review sprint 4` uses the `qa-review` skill
- `/plan-sprint ...` uses the `plan-sprint` skill

This gives you two layers:

- command = convenient entrypoint
- skill = reusable workflow definition

---

## Source of Truth

The repo currently uses this structure:

- `skills/claude/*.md` = authoritative workflow content
- `.opencode/skills/*/SKILL.md` = OpenCode skill wrappers
- `.opencode/commands/*.md` = OpenCode command entrypoints
- `.claude/commands/*.md` = Claude Code command entrypoints

If you want to change workflow behavior, update `skills/claude/*.md` first, then update the wrappers only if names or descriptions change.

---

## Differences vs Claude Code

The workflow intent is the same, but there are a few behavioral differences:

- Claude Code uses `.claude/commands/` directly
- OpenCode uses `.opencode/commands/` and `.opencode/skills/`
- OpenCode also supports Claude-compatible skill discovery, but that is separate from Claude slash commands
- Built-in command names can differ, so this repo uses `/autospec-help` instead of overriding OpenCode's own `/help`

Do not assume OpenCode will automatically understand every Claude-only convention unless there is an OpenCode wrapper for it.

---

## Troubleshooting

### Command does not appear

Check that you launched OpenCode somewhere inside this git repo:

```bash
pwd
git rev-parse --show-toplevel
```

Then verify the command file exists:

```bash
ls .opencode/commands
```

### Skill does not load

Verify the skill file path and name:

```bash
ls .opencode/skills/execute-ticket
```

Every skill must have:

- a directory whose name matches the skill name
- a file named `SKILL.md`
- YAML frontmatter with `name` and `description`

### Claude files are ignored

That is expected for commands. OpenCode does not use `.claude/commands/` as OpenCode commands. This repo solves that by adding `.opencode/commands/` wrappers.

---

## Adding More Skills Later

To port another Claude workflow into OpenCode:

1. Create `.opencode/skills/<skill-name>/SKILL.md`
2. Add valid frontmatter:

```markdown
---
name: my-skill
description: What this workflow does
compatibility: opencode
---
```

3. Point it to the real workflow source file
4. Create `.opencode/commands/<command-name>.md` if you want slash-style invocation
5. Document it here if it is part of the standard AutoSpec workflow

---

## Suggested Workflow for This Repo

For day-to-day use in OpenCode:

1. `/autospec-help` to see the command set
2. `/sprint-status` to find the current state
3. `/execute-ticket X.Y` to do implementation work
4. `/qa-review X.Y` to verify completed work
5. `/sprint-close X` after review and docs are complete

This mirrors the AutoSpec methodology while staying compatible with OpenCode's native discovery model.
