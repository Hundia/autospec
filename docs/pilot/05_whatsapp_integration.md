---
title: WhatsApp Integration
created: 2026-03-21
sprint: 33
status: complete
---

# WhatsApp Integration

Claude Pilot uses WhatsApp for real-time notifications and remote session control via the **self-chat pattern**.

## How Self-Chat Works

Instead of messaging another person, the bot sends messages to your own WhatsApp chat (the "Notes to Self" or your own number). This means:

- No WhatsApp Business API approval needed
- No pre-approved message templates required
- Both bot messages and your replies appear in one conversation
- Works immediately after QR scan

## Setup

### 1. Enable WhatsApp

```bash
# Enable in config
pilot config set whatsapp.enabled true

# For testing without a real phone:
pilot config set whatsapp.mock true
```

### 2. Start the Daemon

```bash
pilot daemon start
```

On first start with WhatsApp enabled, a **QR code** appears in the terminal. Scan it with your phone's WhatsApp:

1. Open WhatsApp on your phone
2. Go to Settings → Linked Devices
3. Tap "Link a Device"
4. Scan the QR code in the terminal

After scanning, the session is persisted in `~/.claude-pilot/whatsapp/.wwebjs_auth/`. You won't need to scan again unless you log out.

### 3. Test It

```bash
pilot whatsapp test
```

You should receive a test message on your WhatsApp.

## Notification Types

| Event | When | Message |
|-------|------|---------|
| **Session Started** | `pilot start` | 🚀 Session name, prompt, working directory |
| **Permission Request** | Claude needs approval | 🔐 Tool, command, risk level, reply instructions |
| **Session Complete** | Claude finishes | ✅ Duration, tool count, summary |
| **Session Error** | Error detected | ❌ Error message, retry option |
| **Approval Timeout** | No response in 5 min | ⏰ What was denied/approved by default |

### Example Messages

**Session Started:**
```
🚀 *Session Started*
Name: sprint-42
Prompt: /sprint-run 7
CWD: /opt/FitnessAiManager/autospec
```

**Permission Request:**
```
🔐 *Permission Request*
Session: sprint-42
Tool: Bash
Command: npm install lodash
Risk: medium

Reply: Y approve | N deny | A always
```

**Session Complete:**
```
✅ *Session Complete*
Name: sprint-42
Duration: 41m
Tools: 89 calls
Summary: Implemented tickets 7.1-7.5...
```

## WhatsApp Commands

Reply to the bot with these commands:

| Command | Action |
|---------|--------|
| `Y` / `yes` / `כן` | Approve latest pending permission |
| `N` / `no` / `לא` | Deny latest pending permission |
| `A` / `always` / `תמיד` | Approve + auto-approve this tool for the session |
| `approve apr-xxx` | Approve specific request by ID |
| `deny apr-xxx` | Deny specific request by ID |
| `status` / `סטטוס` | Show daemon + sessions status |
| `list` / `רשימה` | List active sessions |
| `kill <name>` | Kill a session |
| `logs <name>` | Get last 10 lines of session output |
| `retry` / `שוב` | Retry last errored session |
| `help` / `עזרה` | Show all commands |

> Commands support both English and Hebrew.

## Mock Mode

For development or when you don't want real WhatsApp messages:

```bash
pilot config set whatsapp.mock true
```

In mock mode:
- No QR scan needed
- No real messages sent
- All messages logged to `~/.claude-pilot/logs/daemon.log`
- The daemon still processes approvals (via CLI and dashboard)

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `whatsapp.enabled` | `false` | Enable WhatsApp integration |
| `whatsapp.mock` | `false` | Use mock client (no real messages) |
| `whatsapp.selfChatOnly` | `true` | Only process self-chat messages |
| `whatsapp.notifyOnStart` | `true` | Notify when session starts |
| `whatsapp.notifyOnComplete` | `true` | Notify when session completes |
| `whatsapp.notifyOnError` | `true` | Notify when session errors |
| `whatsapp.approvalViaWhatsApp` | `true` | Send approval requests via WhatsApp |

## Technical Details

- Uses **whatsapp-web.js** (wwebjs) — same library proven in FitnessAiManager production
- Puppeteer config: `headless: 'shell'`, `pipe: false` (required for kernel 5.4)
- Session persistence via **LocalAuth** strategy (stored in `~/.claude-pilot/whatsapp/.wwebjs_auth/`)
- Chrome binary auto-discovered from system or Puppeteer cache
- Anti-loop: only processes self-chat messages (`fromMe: true`)
