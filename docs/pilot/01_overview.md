---
title: Claude Pilot — Overview
created: 2026-03-21
sprint: 33
status: complete
---

# Claude Pilot

**Resilient Claude Code session manager with WhatsApp integration.**

## The Problem

When running long Claude Code sessions (30-60+ minutes) for complex tasks like `/sprint-run` or `/plan-sprint`, SSH disconnections from mobile clients like Termius kill the terminal and destroy all in-progress work. There's no way to:

- Resume a killed session
- Monitor progress remotely
- Approve permissions when away from the terminal
- Get notified when sessions complete or error

## The Solution

Claude Pilot wraps Claude Code in managed **tmux sessions** that survive SSH disconnects, with a **background daemon** that monitors progress, routes **permission approvals via WhatsApp**, and provides a **live dashboard** for reconnection.

## Key Features

| Feature | Description |
|---------|-------------|
| **Resilient Sessions** | Claude Code runs inside tmux — survives SSH disconnect |
| **Background Daemon** | Monitors all sessions, detects permission prompts, routes approvals |
| **WhatsApp Integration** | Get notifications, approve/deny permissions, control sessions from your phone |
| **Permission Approval** | Auto-approve safe operations, route risky ones to WhatsApp |
| **Live Dashboard** | Auto-refreshing terminal UI showing all sessions and pending approvals |
| **Session Logs** | Full tmux output captured to files, streamable with `pilot logs -f` |
| **Doctor Command** | System readiness check (tmux, redis, claude, chrome) |

## Quick Start

```bash
# Check system readiness
pilot doctor

# Start a session
pilot start "implement feature X" --name my-feature

# Start with a Claude Code skill
pilot start "7" --skill sprint-run --name sprint-7

# Disconnect SSH, reconnect later...
pilot list                    # See what's running
pilot attach my-feature       # Reconnect to session
pilot logs my-feature -f      # Stream logs

# Enable WhatsApp notifications
pilot whatsapp enable
pilot daemon start
```

## Architecture at a Glance

```
You (Termius / SSH) ──→ pilot start "task"
                              │
                    ┌─────────▼──────────┐
                    │  tmux session       │
                    │  (survives SSH drop)│
                    │  └── claude ...     │
                    └─────────┬──────────┘
                              │ capture-pane (2s poll)
                    ┌─────────▼──────────┐
                    │  Daemon             │
                    │  ├── Monitor        │
                    │  ├── Approval Engine│
                    │  └── WhatsApp Bot   │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │  Your WhatsApp      │
                    │  "🔐 Approve Bash:  │
                    │   npm install?"     │
                    │  Reply: Y / N / A   │
                    └────────────────────┘
```

## Technology Stack

| Component | Technology |
|-----------|-----------|
| CLI Framework | Commander.js |
| Session Isolation | tmux 3.x |
| IPC | Unix domain sockets + JSON |
| WhatsApp | whatsapp-web.js (wwebjs) |
| State | File-based JSON + Redis (optional) |
| Build | tsup + TypeScript |
| Tests | Vitest (28 tests) |

## Project Structure

```
pilot/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── commands/             # 12 CLI commands
│   ├── session/              # tmux wrapper, state, parser
│   ├── daemon/               # Background process, approval engine
│   ├── whatsapp/             # wwebjs client, bot, notifier
│   ├── ipc/                  # Unix socket protocol
│   └── utils/                # Config, logger, signals, tmux helpers
├── tests/                    # 28 unit tests
├── package.json
└── tsconfig.json
```
