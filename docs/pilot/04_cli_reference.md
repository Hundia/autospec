---
title: CLI Reference
created: 2026-03-21
sprint: 33
status: complete
---

# CLI Reference

All commands available via the `pilot` CLI.

## Session Commands

### `pilot start <prompt>`

Start a new Claude Code session in a managed tmux session.

```bash
pilot start "implement user authentication"
pilot start "fix the login bug" --name bugfix-login
pilot start "7" --skill sprint-run --name sprint-7
pilot start "refactor" --auto-approve --name safe-refactor
pilot start "" --resume abc123 --name continued-work
```

| Flag | Description | Default |
|------|-------------|---------|
| `-n, --name <name>` | Session display name | Auto-generated |
| `-d, --cwd <dir>` | Working directory | Current directory |
| `--auto-approve` | Skip all permission prompts | `false` |
| `--approve-reads` | Auto-approve Read/Glob/Grep | `false` |
| `--timeout <min>` | Approval timeout in minutes | `5` |
| `--skill <name>` | Run a Claude Code skill | — |
| `--resume <id>` | Resume a previous Claude session | — |
| `--model <model>` | Claude model override | — |
| `--attach` | Attach to tmux after starting | `false` |

### `pilot list`

List all active sessions.

```bash
pilot list              # Active sessions only
pilot list --all        # Include completed/killed
pilot list --json       # JSON output (for scripting)
```

Output:
```
  Claude Pilot Sessions

  Name                 Status         Duration     Tools    Last Activity
  ──────────────────────────────────────────────────────────────────────────
  sprint-42            ▶ running      23m          47       Edit: app.ts
  bugfix-12            ⏳ wait        5m           12       Approval pending
  refactor             ✅ done        41m          89       Complete
```

### `pilot attach <name|id>`

Attach to a running tmux session (interactive).

```bash
pilot attach sprint-42
```

Detach from inside tmux: **Ctrl-B then D**

### `pilot logs <name|id>`

Stream session output.

```bash
pilot logs sprint-42           # Last 50 lines
pilot logs sprint-42 -f        # Follow mode (live)
pilot logs sprint-42 -n 100    # Last 100 lines
```

### `pilot kill <name|id>`

Kill a session and its tmux process.

```bash
pilot kill sprint-42            # Graceful (Ctrl-C then kill)
pilot kill sprint-42 --force    # Immediate SIGKILL
```

## Approval Commands

### `pilot approve [id]`

Approve a pending permission request.

```bash
pilot approve                   # Approve latest pending
pilot approve apr-abc123        # Approve specific
pilot approve --always          # Approve + auto-approve this tool for session
```

### `pilot deny [id]`

Deny a pending permission request.

```bash
pilot deny                      # Deny latest pending
pilot deny apr-abc123           # Deny specific
```

## Daemon Commands

### `pilot daemon <action>`

Manage the background daemon.

```bash
pilot daemon start              # Start in foreground (Ctrl-C to stop)
pilot daemon stop               # Stop running daemon
pilot daemon status             # Check if daemon is running
pilot daemon logs               # Stream daemon log
```

The daemon monitors sessions, routes approvals to WhatsApp, and serves the socket API.

## Dashboard

### `pilot dashboard`

Launch an auto-refreshing terminal dashboard.

```bash
pilot dashboard
```

Shows:
- Active sessions with status, duration, tool count
- Pending approvals with timeout countdown
- Daemon and WhatsApp connection status

Press **Ctrl-C** to exit.

## WhatsApp Commands

### `pilot whatsapp <action>`

Manage WhatsApp integration.

```bash
pilot whatsapp status           # Show connection status
pilot whatsapp enable           # Enable WhatsApp
pilot whatsapp mock             # Enable mock mode (logs, no real messages)
pilot whatsapp qr               # Show QR code instructions
pilot whatsapp test             # Send test message
```

## System Commands

### `pilot doctor`

Check system readiness.

```bash
pilot doctor
```

Checks: Node.js, tmux, Claude Code CLI, Redis, Chrome/Chromium, Pilot Home, Config.

### `pilot config [key] [value]`

View or update configuration.

```bash
pilot config                            # Show all config
pilot config whatsapp.enabled           # Get specific value
pilot config set whatsapp.enabled true  # Set value
pilot config set approvalTimeoutMs 600000
pilot config set autoApproveLowRisk true
```
