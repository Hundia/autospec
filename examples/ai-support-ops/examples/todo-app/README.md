# TodoApp — AutoSpec Example

This is a minimal example project showing how to use AutoSpec with a simple todo app.

## What's in here

```
todo-app/
├── requirements/
│   └── srs.md          # Simple SRS: auth + todo CRUD + filters (React + Node.js + SQLite)
├── .autospec/
│   └── config.yml      # Pre-configured for claude-code
└── README.md           # This file
```

## How to run this example

**Step 1.** Copy this folder to your project directory (or point your AI at it directly):

```bash
cp -r examples/todo-app /path/to/my-todo-project
cd /path/to/my-todo-project
```

**Step 2.** Tell your AI assistant to read the requirements and run AutoSpec:

```
Read requirements/srs.md then run @QUICKSTART.md
```

(where `QUICKSTART.md` is from your `autospec-starter` directory)

**Step 3.** Watch AutoSpec generate the full project structure:

- `specs/` — 10 role-based specification files
- `specs/backlog.md` — Sprint backlog with estimated tickets
- `docs/` — Living documentation skeleton
- `CLAUDE.md` — Project memory file for your AI

## The example app

**TodoApp** — a simple todo list with authentication:

- **Auth** — Email registration + login, JWT sessions, password reset
- **Todos** — Create, edit, complete, delete
- **Filters** — All | Active | Completed views
- **Profile** — Update name/email, change password

**Stack:** React 18 + Node.js + SQLite (via Prisma) — minimal, no external services required.
