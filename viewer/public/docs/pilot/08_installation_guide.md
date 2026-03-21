---
title: Installation Guide
created: 2026-03-21
sprint: 34
status: complete
---

# Installation Guide

Get Claude Pilot running on your server in 5 minutes.

## System Requirements

| Requirement | Minimum | Notes |
|-------------|---------|-------|
| **Node.js** | 18.0+ | `node --version` to check |
| **tmux** | 3.0+ | Session isolation — `apt-get install tmux` |
| **Chrome/Chromium** | Any | Only for WhatsApp — optional |
| **Redis** | 7.0+ | Optional — file fallback works without it |
| **OS** | Linux (Ubuntu 20.04+) | macOS also works |

## Step 1: Install Pilot

### From Source (Recommended)

```bash
# Clone or navigate to the project
cd /opt/FitnessAiManager/autospec/pilot

# Install dependencies
npm install

# Build TypeScript
npm run build

# Link globally (makes `pilot` available everywhere)
npm link

# Verify
pilot --version
```

### From npm (When Published)

```bash
npm install -g claude-pilot
```

## Step 2: Install tmux

tmux is required — it's what keeps your sessions alive when SSH disconnects.

```bash
# Ubuntu/Debian
apt-get install tmux

# macOS
brew install tmux

# Verify
tmux -V
```

## Step 3: Install an AI Provider

Pilot supports multiple AI backends. You need at least one.

### Option A: Claude Code (Recommended)

The most feature-rich provider — supports session resume, model selection, and permission management.

```bash
# Install
npm install -g @anthropic-ai/claude-code

# Authenticate
claude auth login

# Verify
claude --version
claude auth status
```

### Option B: Gemini CLI

Google's AI assistant. Simpler feature set — no session resume or auto-approve.

```bash
# Install
npm install -g @anthropic-ai/gemini-cli

# Authenticate (follows Google auth flow)
gemini auth login

# Verify
which gemini
```

### Option C: GitHub Copilot (Experimental)

Requires GitHub CLI with Copilot extension.

```bash
# Install GitHub CLI
apt-get install gh

# Authenticate
gh auth login

# Install Copilot extension
gh extension install github/gh-copilot

# Verify
gh copilot --version
```

> **Note:** GitHub Copilot support is experimental. The ACP protocol is not yet stable. Use Claude Code or Gemini CLI for production workloads.

## Step 4: Verify Installation

Run the doctor command to check everything:

```bash
pilot doctor
```

Expected output:

```
  Claude Pilot — System Check

  ✓ Node.js              v18.x.x
  ✓ tmux                 tmux 3.x
  ✓ Redis                connected
  ✓ Pilot Home           /root/.claude-pilot

  LLM Providers
  ✓ Claude Code          2.x.x (primary)
  ✗ Gemini CLI           not installed
  ✗ GitHub Copilot       not installed

  All checks passed. Ready to fly.
```

The doctor checks:
- Node.js version (>= 18)
- tmux installed
- Redis connectivity (optional)
- Chrome/Chromium for WhatsApp (optional)
- Each AI provider availability
- Config file validity

## Step 5: First Session

```bash
# Start a simple session
pilot start "Hello, tell me about yourself" --name first-test --attach

# You're now attached to a tmux session running Claude Code
# Detach with: Ctrl-B then D

# Check session status
pilot list

# Kill when done
pilot kill first-test
```

## Step 6: Configure (Optional)

```bash
# View all settings
pilot config

# Auto-approve low-risk operations (Read, Glob, Grep)
pilot config set autoApproveLowRisk true

# Set approval timeout to 10 minutes
pilot config set approvalTimeoutMs 600000

# Choose default provider
pilot config set provider.default claude-code
```

## Step 7: WhatsApp Setup (Optional)

For remote notifications and approval via your phone:

```bash
# Enable WhatsApp
pilot config set whatsapp.enabled true

# Start daemon (QR code appears for first-time scan)
pilot daemon start

# Scan QR with phone: WhatsApp → Settings → Linked Devices → Link
# See docs/pilot/07_whatsapp_setup_guide.md for full walkthrough
```

## Configuration File

All settings stored in `~/.claude-pilot/config.json`:

```json
{
  "defaultPermissionMode": "default",
  "approvalTimeoutMs": 300000,
  "defaultTimeoutAction": "deny",
  "autoApprovePatterns": [],
  "autoApproveLowRisk": false,
  "maxConcurrentSessions": 5,
  "provider": {
    "default": "",
    "claudePath": "claude",
    "geminiPath": "gemini"
  },
  "tmuxSessionPrefix": "pilot-",
  "scrollbackLimit": 100000,
  "whatsapp": {
    "enabled": false,
    "mock": false,
    "selfChatOnly": true,
    "notifyOnStart": true,
    "notifyOnComplete": true,
    "notifyOnError": true,
    "approvalViaWhatsApp": true
  },
  "redis": {
    "url": "redis://localhost:6379",
    "keyPrefix": "pilot:",
    "db": 2
  },
  "logRetentionDays": 7,
  "logLevel": "info"
}
```

## Upgrading

```bash
# From source
cd /opt/FitnessAiManager/autospec/pilot
git pull
npm install
npm run build

# Global npm
npm update -g claude-pilot
```

## Uninstalling

```bash
# Remove global link
npm unlink -g claude-pilot

# Clean runtime data (sessions, logs, config)
rm -rf ~/.claude-pilot

# Remove source (if desired)
rm -rf /opt/FitnessAiManager/autospec/pilot
```
