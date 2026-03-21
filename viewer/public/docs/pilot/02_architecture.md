---
title: Architecture
created: 2026-03-21
sprint: 33
status: complete
---

# Pilot Architecture

## System Architecture

Claude Pilot is a dual-process system: a **CLI** for user interaction and a **daemon** for background monitoring.

```
┌─────────────────────────────────────────────────────────┐
│  CLI Layer (foreground, user-facing)                     │
│  pilot start | list | attach | logs | kill | dashboard   │
└──────┬──────────────────────────────────────────────────┘
       │ Unix socket (~/.claude-pilot/daemon.sock)
       ▼
┌─────────────────────────────────────────────────────────┐
│  Daemon (background, long-lived)                         │
│  ├── Session Monitor (polls tmux every 2s)               │
│  ├── Approval Engine (permission routing + timeout)      │
│  ├── WhatsApp Client (wwebjs self-chat)                  │
│  └── Socket Server (handles CLI requests)                │
└──────┬──────────────────────────────────────────────────┘
       │ tmux send-keys / capture-pane
       ▼
┌─────────────────────────────────────────────────────────┐
│  tmux sessions (independent of SSH, persist on disconnect)│
│  pilot-sprint-42 → claude --session-id <uuid> <prompt>   │
│  pilot-bugfix-12 → claude --resume <id>                  │
└─────────────────────────────────────────────────────────┘
```

## Module Boundaries

### Session Module (`src/session/`)

Owns the lifecycle of Claude Code processes inside tmux sessions. No awareness of WhatsApp or notifications.

| File | Responsibility |
|------|---------------|
| `session.types.ts` | TypeScript interfaces for PilotSession, ApprovalRequest |
| `session-manager.ts` | CRUD for session JSON files, state transitions, approval management |
| `session-launcher.ts` | Spawn Claude Code in tmux with correct flags and logging |
| `session-parser.ts` | Regex patterns for Claude Code permission prompts, risk classification |
| `session-monitor.ts` | Polling loop that reads tmux output and detects events |

### Daemon Module (`src/daemon/`)

Long-lived background process that orchestrates everything.

| File | Responsibility |
|------|---------------|
| `daemon-server.ts` | Main daemon: PID file, socket server, monitoring, WhatsApp init |
| `daemon-client.ts` | CLI-side helper to send requests to daemon |
| `daemon.types.ts` | Request/response protocol types |
| `approval-engine.ts` | Permission routing: auto-approve or send to WhatsApp, timeout handling |

### WhatsApp Module (`src/whatsapp/`)

Self-contained wwebjs integration. Sends notifications, receives commands.

| File | Responsibility |
|------|---------------|
| `whatsapp-client.ts` | wwebjs wrapper with LocalAuth, self-chat pattern, mock fallback |
| `whatsapp-notifier.ts` | Sends notifications and handles incoming commands |
| `whatsapp-bot.ts` | Parses incoming WhatsApp messages into commands (Y/N/A/status/etc.) |
| `whatsapp-templates.ts` | Message templates with variable substitution |
| `whatsapp-mock.ts` | Mock client for development (logs instead of sending) |

### IPC Module (`src/ipc/`)

Transport layer between CLI and daemon.

| File | Responsibility |
|------|---------------|
| `protocol.ts` | JSON serialization with newline delimiters |
| `socket-transport.ts` | Unix domain socket server + client |

## Data Flow: Session Lifecycle

```
pilot start "task" --name sprint-42
  │
  ├── 1. Generate session ID (nanoid)
  ├── 2. Create tmux session: tmux new-session -d -s pilot-sprint-42
  ├── 3. Start logging: tmux pipe-pane → ~/.claude-pilot/logs/sprint-42.log
  ├── 4. Save session state: ~/.claude-pilot/sessions/<id>.json
  ├── 5. Send command: tmux send-keys "claude --session-id <id> ..." Enter
  └── 6. Print: "Session started. Attach: pilot attach sprint-42"

Daemon monitors (every 2 seconds):
  │
  ├── tmux capture-pane → parse last 50 lines
  ├── Detect permission prompts → route to approval engine
  ├── Detect completion → update status, notify WhatsApp
  ├── Detect errors → update status, notify WhatsApp
  └── Update session lastOutput + lastActivityAt

SSH disconnect:
  └── tmux session persists, daemon continues monitoring

Reconnect:
  └── pilot attach sprint-42 → tmux attach-session -t pilot-sprint-42
```

## State Management

All state lives in `~/.claude-pilot/` as JSON files:

```
~/.claude-pilot/
├── config.json              # User configuration (Zod-validated)
├── daemon.pid               # Daemon PID for lifecycle management
├── daemon.sock              # Unix domain socket
├── sessions/
│   └── <id>.json            # Session state (PilotSession interface)
├── approvals/
│   └── <id>.json            # Approval requests (ApprovalRequest interface)
├── logs/
│   ├── <name>.log           # Raw tmux output per session
│   ├── pilot.log            # CLI log
│   └── daemon.log           # Daemon log
└── whatsapp/
    └── .wwebjs_auth/        # Persistent WhatsApp session (no re-QR)
```

### Session State Interface

```typescript
interface PilotSession {
  id: string;                 // nanoid(12)
  name: string;               // Human-friendly name
  prompt: string;             // Original prompt or skill
  cwd: string;                // Working directory
  tmuxSession: string;        // tmux session name: "pilot-<name>"
  status: 'launching' | 'running' | 'waiting_approval' | 'completed' | 'error' | 'killed';
  permissionMode: 'default' | 'dontAsk' | 'auto';
  autoApprovePatterns: string[];
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  lastActivityAt: number;
  toolCallCount: number;
  approvalCount: number;
  errorCount: number;
  lastOutput: string;
}
```

## Why tmux?

| Method | Survives SSH Drop | Named Sessions | Output Capture | Keystroke Injection | Interactive |
|--------|:-:|:-:|:-:|:-:|:-:|
| **tmux** | ✓ | ✓ | ✓ | ✓ | ✓ |
| screen | ✓ | ✓ | partial | partial | ✓ |
| nohup | ✓ | ✗ | file only | ✗ | ✗ |
| systemd | ✓ | ✗ | journald | ✗ | ✗ |

tmux is the only option that supports all five requirements, which is why it's the foundation of Claude Pilot.
