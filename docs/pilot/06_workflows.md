---
title: Workflows & How-To
created: 2026-03-21
sprint: 33
status: complete
---

# Workflows & How-To

Common workflows for using Claude Pilot day-to-day.

## Workflow 1: Long Sprint Run

Run a full AutoSpec sprint that takes 30-60 minutes, disconnect, and come back later.

```bash
# 1. Start the daemon (monitors sessions + WhatsApp)
pilot daemon start &

# 2. Launch the sprint
pilot start "7" --skill sprint-run --name sprint-7 --approve-reads

# 3. Disconnect SSH (close Termius, go to lunch, etc.)
#    Session keeps running in tmux!

# 4. Get notifications on WhatsApp:
#    🚀 Session Started: sprint-7
#    🔐 Permission Request: Bash — npm run build → Reply "Y"
#    ✅ Session Complete: sprint-7 (41m, 89 tools)

# 5. Reconnect SSH later
pilot list                    # See status
pilot logs sprint-7           # Read the summary
pilot attach sprint-7         # Or attach to see full output
```

## Workflow 2: Multiple Parallel Sessions

Run several independent tasks at once.

```bash
# Start multiple sessions
pilot start "fix login bug" --name bugfix-login
pilot start "add dark mode" --name feature-darkmode
pilot start "update docs" --name docs-update --auto-approve

# Monitor all at once
pilot dashboard

# Or list them
pilot list
```

## Workflow 3: Trusted Session (No Approvals)

For tasks you fully trust, skip all permission prompts.

```bash
# Full auto-approve (equivalent to --dangerously-skip-permissions)
pilot start "refactor the auth module" --auto-approve --name auth-refactor

# Or just auto-approve reads
pilot start "analyze codebase" --approve-reads --name analysis
```

## Workflow 4: Resume a Previous Session

If Claude Code crashed or you want to continue where it left off.

```bash
# Find the Claude session ID
pilot list --all --json | jq '.[0].claudeSessionId'

# Resume it
pilot start "" --resume <session-id> --name continued-work
```

## Workflow 5: WhatsApp-Only Workflow

Control everything from your phone while away from the computer.

```bash
# Set up once (at the terminal):
pilot config set whatsapp.enabled true
pilot config set autoApproveLowRisk true   # Auto-approve safe ops
pilot daemon start                          # Leave daemon running
```

Then from your phone (WhatsApp):

```
You: status
Bot: Active sessions: 2, Pending approvals: 0

You: list
Bot: ▶ sprint-7 (running)
     ⏳ bugfix-12 (waiting_approval)

# Approval comes in:
Bot: 🔐 Permission Request
     Session: bugfix-12
     Tool: Bash
     Command: npm install lodash

You: Y

Bot: ✅ Approved: Bash — npm install lodash

# Later:
Bot: ✅ Session Complete
     Name: sprint-7
     Duration: 41m

You: logs bugfix-12
Bot: *Logs: bugfix-12*
     > Reading src/auth/login.ts
     > Editing line 42...
     > Running tests...

You: kill bugfix-12
Bot: Killed: bugfix-12
```

## Workflow 6: System Setup (First Time)

```bash
# 1. Install prerequisites
apt-get install tmux           # Session manager
npm install -g claude-pilot    # Or: cd autospec/pilot && npm link

# 2. Check everything works
pilot doctor

# 3. Configure (optional)
pilot config set autoApproveLowRisk true
pilot config set approvalTimeoutMs 600000    # 10 min timeout

# 4. Set up WhatsApp (optional)
pilot whatsapp enable
pilot daemon start             # Scan QR code on first run

# 5. Start your first session
pilot start "hello world" --name test --attach
```

## Workflow 7: Network Resilience (Bonus)

For even more resilient connections, combine Pilot with SSH keep-alive or autossh.

### SSH Keep-Alive (Client-Side)

Add to `~/.ssh/config`:
```
Host your-server
  ServerAliveInterval 30
  ServerAliveCountMax 3
```

### autossh (Auto-Reconnect)

```bash
# Install
apt-get install autossh

# Connect with auto-reconnect
autossh -M 20000 -t user@server "cd /opt/FitnessAiManager/autospec && pilot dashboard"
```

### mosh (For Mobile Networks)

```bash
# Server: install mosh
apt-get install mosh

# Client: connect via mosh (UDP, handles network changes)
mosh user@server -- pilot dashboard
```

## Troubleshooting

### Session stuck on "waiting_approval" but no WhatsApp message

1. Check daemon is running: `pilot daemon status`
2. Check WhatsApp connected: `pilot whatsapp status`
3. Approve manually: `pilot approve`

### tmux session exists but pilot doesn't show it

Session state may be out of sync. The session JSON in `~/.claude-pilot/sessions/` tracks Pilot-managed sessions. tmux sessions created outside Pilot won't appear.

### Daemon won't start (port in use)

```bash
pilot daemon stop       # Clean up PID file
rm ~/.claude-pilot/daemon.sock  # Remove stale socket
pilot daemon start      # Try again
```

### WhatsApp QR code not appearing

```bash
pilot doctor            # Check Chrome/Chromium is available
# Chrome is required for whatsapp-web.js
```
