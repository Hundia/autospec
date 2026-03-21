---
title: Permission Approval Flow
created: 2026-03-21
sprint: 33
status: complete
---

# Permission Approval Flow

The core innovation of Claude Pilot: routing Claude Code's permission prompts through WhatsApp so you can approve actions from your phone.

## How It Works

```
Claude Code in tmux hits a permission check:
   "Allow Bash: npm install lodash (Y/n)"
         │
         ▼
Session Monitor (polls tmux capture-pane every 2s)
   → Regex match detects permission prompt
   → Extracts: tool="Bash", description="npm install lodash"
         │
         ▼
Approval Engine
   ├── Check auto-approve rules:
   │   ├── Session --auto-approve flag? → Auto-approve
   │   ├── Tool matches autoApprovePatterns? → Auto-approve
   │   ├── Risk = "low" AND autoApproveLowRisk? → Auto-approve
   │   └── None match → Route to WhatsApp
   │
   ▼ (if not auto-approved)
Create ApprovalRequest
   → Status: pending
   → Timeout: 5 minutes (configurable)
   → Session status → "waiting_approval"
         │
         ▼
WhatsApp Notifier sends to self-chat:
   ┌──────────────────────────────────┐
   │ 🔐 *Permission Request*          │
   │ Session: sprint-42               │
   │ Tool: Bash                       │
   │ Command: npm install lodash      │
   │ Risk: medium                     │
   │                                  │
   │ Reply: Y approve | N deny | A always │
   └──────────────────────────────────┘
         │
         ▼
User replies on WhatsApp: "Y"
         │
         ▼
WhatsApp Bot parses: { type: 'approve' }
         │
         ▼
Approval Engine:
   ├── Inject keystroke: tmux send-keys -t pilot-sprint-42 "Y"
   ├── Update approval: status → "approved", resolvedBy → "whatsapp"
   ├── Update session: status → "running"
   └── Send confirmation: "✅ Approved: Bash — npm install lodash"
         │
         ▼
Claude Code continues execution
```

## Risk Classification

Every permission prompt is classified by risk level:

| Risk | Criteria | Examples |
|------|----------|---------|
| **High** | Destructive, irreversible operations | `rm -rf`, `git push --force`, `git reset --hard`, `DROP TABLE` |
| **Medium** | Writes, installs, network access | `npm install`, `Edit file`, `Write file`, `curl`, `docker` |
| **Low** | Read-only, safe operations | `Read`, `Glob`, `Grep`, `ls`, `git status`, `git log` |

## Auto-Approve Rules

The approval engine checks these rules in order before routing to WhatsApp:

1. **Session flag**: `pilot start --auto-approve` → approve everything (like `--dangerously-skip-permissions`)
2. **Session patterns**: If tool matches `session.autoApprovePatterns` (set via WhatsApp "A" response)
3. **Config patterns**: If tool matches `config.autoApprovePatterns` (set via `pilot config`)
4. **Low risk auto-approve**: If `config.autoApproveLowRisk = true` and risk is "low"
5. **None match** → Send to WhatsApp for manual approval

### Configuring Auto-Approve

```bash
# Auto-approve all read operations globally
pilot config set autoApprovePatterns '["Read", "Glob", "Grep"]'

# Auto-approve low-risk operations
pilot config set autoApproveLowRisk true

# Start a session with read auto-approve
pilot start "task" --approve-reads

# Start with full auto-approve (skip all prompts)
pilot start "task" --auto-approve
```

## Timeout Handling

If no response is received within the timeout (default: 5 minutes):

- **Default action**: Deny (security-first)
- Configurable: `pilot config set defaultTimeoutAction approve`
- WhatsApp notification: "⏰ Approval Timed Out — Auto-denied"

```bash
# Change timeout to 10 minutes
pilot config set approvalTimeoutMs 600000

# Change default timeout action to approve
pilot config set defaultTimeoutAction approve
```

## Multiple Approval Sources

Approvals can come from three sources:

| Source | How | Priority |
|--------|-----|----------|
| **WhatsApp** | Reply Y/N/A to notification | First responder wins |
| **CLI** | `pilot approve <id>` or `pilot deny <id>` | First responder wins |
| **Dashboard** | From `pilot dashboard` display | First responder wins |

Race conditions are handled with a lock mechanism — only the first response is processed.

## Permission Detection Patterns

The session parser uses regex to detect Claude Code permission prompts:

```typescript
// Standard tool permission
/Allow\s+(Bash|Edit|Write|Read|Glob|Grep|WebFetch|WebSearch|Agent)
  (?:\(([^)]*)\))?:\s*(.+?)(?:\s*\([Yy]\/[Nn]\))?\s*$/m
```

This matches prompts like:
- `Allow Bash: npm install lodash (Y/n)`
- `Allow Edit: src/index.ts (Y/n)`
- `Allow Write: new-file.ts (Y/n)`
- `Allow Read: /etc/passwd (Y/n)`

## WhatsApp Commands for Approvals

| Command | Action |
|---------|--------|
| `Y` / `yes` / `כן` | Approve latest pending |
| `N` / `no` / `לא` | Deny latest pending |
| `A` / `always` / `תמיד` | Approve + auto-approve this tool for session |
| `approve apr-xxx` | Approve specific request by ID |
| `deny apr-xxx` | Deny specific request by ID |
