---
title: WhatsApp Setup Guide
created: 2026-03-21
sprint: 34
status: complete
---

# WhatsApp Setup Guide

A hands-on tutorial for connecting your WhatsApp account to Claude Pilot. After completing this guide, Pilot will send you session notifications, ask for approvals, and respond to your commands — all through your personal WhatsApp chat.

---

## Prerequisites

Before you begin, confirm the following are in place:

| Requirement | Why |
|-------------|-----|
| **Chrome or Chromium** installed | wwebjs drives a headless Chrome instance to run WhatsApp Web |
| **Node.js 18+** | Pilot and its dependencies require Node 18 or later |
| **A phone with WhatsApp** | You must scan a QR code to link the session on first start |
| **tmux** (recommended) | Keeps the daemon running after you disconnect from the terminal |

To verify Chrome is available, run:

```bash
pilot doctor
```

The `doctor` command checks Chrome, Node version, and all required directories.

---

## How wwebjs Works

Claude Pilot uses [whatsapp-web.js](https://wwebjs.dev/) (wwebjs), an open-source library that drives WhatsApp Web using a headless Chromium browser via Puppeteer.

**What actually happens under the hood:**

1. Pilot spawns a headless Chrome process using Puppeteer.
2. Chrome opens `web.whatsapp.com` — the same page you use in a browser.
3. On first run, WhatsApp Web shows a QR code. You scan it with your phone to link the device.
4. After linking, wwebjs listens for incoming messages and can send messages on your behalf.

**Session storage:** After a successful QR scan, the session credentials are saved locally at:

```
~/.claude-pilot/whatsapp/.wwebjs_auth/
```

On subsequent daemon starts, Pilot reads the stored session and reconnects automatically — no QR scan needed.

**Puppeteer configuration (from source):**

Pilot configures Puppeteer with settings specifically tuned for Linux server environments and kernel 5.4:

```typescript
puppeteer: {
  headless: 'shell',   // Required for kernel 5.4 compatibility
  pipe: false,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--no-first-run',
    '--disable-extensions',
  ],
}
```

The `headless: 'shell'` value and `--no-sandbox` flags are pre-configured — you do not need to set these manually.

---

## Step-by-Step Setup

### Step 1: Enable WhatsApp in Pilot config

```bash
pilot config set whatsapp.enabled true
```

Expected output:

```
✔ Config updated: whatsapp.enabled = true
```

### Step 2: Start the daemon

```bash
pilot daemon start
```

Or, to keep it running in a persistent tmux session:

```bash
tmux new-session -d -s pilot 'pilot daemon start'
tmux attach -t pilot
```

### Step 3: Scan the QR code

After a few seconds, a QR code appears directly in the terminal:

```
[pilot] WhatsApp QR code received — scan with phone

  Scan this QR code with WhatsApp:

  ▄▄▄▄▄▄▄ ▄  ▄ ▄▄▄▄▄▄▄
  █ ▄▄▄ █ ▀█▄█ █ ▄▄▄ █
  █ ███ █ █▀▀▀ █ ███ █
  █▄▄▄▄▄█ ▄▀█▄ █▄▄▄▄▄█
  ...
```

On your phone:
1. Open WhatsApp
2. Tap **Settings** (or the three-dot menu on Android)
3. Tap **Linked Devices**
4. Tap **Link a Device**
5. Point your camera at the QR code in the terminal

### Step 4: Wait for "WhatsApp client ready"

After a successful scan, the terminal shows:

```
[pilot] WhatsApp client ready
[pilot] Daemon running — press Ctrl+C to stop
```

This confirms the session is active. The QR code will not appear again unless the session expires.

### Step 5: Test the connection

In a separate terminal:

```bash
pilot whatsapp test
```

Expected output:

```
✔ WhatsApp connected
✔ Test message sent to self-chat
```

Check your phone — you should see a test message appear in your **own chat** (the chat labeled "You" or "Saved Messages" in WhatsApp).

---

## Mock Mode

If you are developing or testing without access to a phone, enable mock mode:

```bash
pilot config set whatsapp.mock true
```

In mock mode:
- No Chrome process is spawned.
- `sendMessage` calls are logged to the console instead of actually sending.
- Approval prompts appear in the terminal rather than WhatsApp.
- The daemon starts immediately without requiring a QR scan.

To disable mock mode and switch back to real WhatsApp:

```bash
pilot config set whatsapp.mock false
```

---

## Self-Chat Pattern

Claude Pilot communicates with you through your **own WhatsApp chat** — the conversation you have with yourself (visible as "You" or "Saved Messages" depending on your WhatsApp version).

**Why self-chat?**

Pilot uses the `message_create` event from wwebjs and filters for messages where `fromMe: true`. This means:
- Pilot only reacts to messages you send to yourself.
- Your approval commands (e.g., "yes", "approve", "deny") are sent as self-messages.
- No other contacts or groups are involved.

**The flow:**

```
You type in your own WhatsApp chat
  → WhatsApp Web fires message_create event (fromMe: true)
  → Pilot's message handler receives the body
  → Pilot interprets it as a command or approval
  → Pilot replies to the same chat
```

The `selfChatOnly: true` setting (enabled by default) enforces this pattern. Messages from other contacts are ignored.

---

## Persistent Session

The first QR scan is a one-time setup. After that, the session persists across daemon restarts.

**Session directory:**

```
~/.claude-pilot/whatsapp/.wwebjs_auth/
```

**Session lifecycle:**

| Situation | What happens |
|-----------|-------------|
| Daemon restarts | Reads saved session, auto-connects (no QR) |
| Phone logs out the linked device | Session becomes invalid on next start |
| Session file deleted manually | QR scan required on next start |
| Phone number changes | Session invalid, delete and re-scan |

**To force a fresh QR scan** (e.g., if your phone logged out the device):

```bash
rm -rf ~/.claude-pilot/whatsapp/.wwebjs_auth/
pilot daemon restart
```

The QR code will appear again on the next daemon start.

---

## Notification Configuration

Control which events Pilot sends to your WhatsApp, and whether approvals can be answered via WhatsApp:

```bash
# Notify when a session starts
pilot config set whatsapp.notifyOnStart true

# Notify when a session completes successfully
pilot config set whatsapp.notifyOnComplete true

# Notify when a session encounters an error
pilot config set whatsapp.notifyOnError true

# Allow approvals to be answered via WhatsApp
pilot config set whatsapp.approvalViaWhatsApp true
```

**What `approvalViaWhatsApp` enables:**

When `true`, Pilot sends approval requests to your WhatsApp self-chat and waits for a reply. You can respond with:
- `yes` / `approve` / `y` — approve the action
- `no` / `deny` / `n` — deny the action

When `false`, approvals must be answered via the terminal or Pilot's web interface.

**View your current configuration:**

```bash
pilot config get whatsapp
```

Example output:

```
whatsapp.enabled              = true
whatsapp.mock                 = false
whatsapp.selfChatOnly         = true
whatsapp.notifyOnStart        = true
whatsapp.notifyOnComplete     = true
whatsapp.notifyOnError        = true
whatsapp.approvalViaWhatsApp  = true
```

---

## Troubleshooting

### QR code not appearing

**Symptom:** Daemon starts but no QR code appears in the terminal.

**Cause:** Chrome or Chromium is not installed or not found in PATH.

**Fix:**
```bash
# Check what pilot doctor reports
pilot doctor

# Install Chromium if missing (Ubuntu/Debian)
sudo apt-get install -y chromium-browser

# Or install Chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb
```

---

### Session expired — QR code appears again unexpectedly

**Symptom:** On daemon restart, the QR code appears even though you already scanned it once.

**Cause:** WhatsApp logged out the linked device (this happens if the phone has not had internet access for several weeks, or if you manually unlinked the device from WhatsApp settings).

**Fix:**
```bash
# Clear the stale session
rm -rf ~/.claude-pilot/whatsapp/.wwebjs_auth/

# Restart and scan again
pilot daemon restart
```

---

### "headless: 'shell'" compatibility error

**Symptom:** Older Puppeteer versions reject the `headless: 'shell'` string value.

**Cause:** This only happens if you are running a downgraded version of Pilot's dependencies.

**Fix:** This is already handled in the source code. Ensure you are on the latest Pilot version:

```bash
cd /opt/FitnessAiManager/autospec/cli && npm install
```

---

### Chrome sandbox errors

**Symptom:** Logs contain `Running as root without --no-sandbox is not supported` or similar.

**Cause:** Chrome refuses to run as root unless sandbox flags are disabled.

**Fix:** The `--no-sandbox` and `--disable-setuid-sandbox` flags are already configured in Pilot's Puppeteer setup. If you see this error, it means a custom or overridden configuration is stripping those flags. Check that you have not overridden the `puppeteer` config block.

---

### Messages not received / commands ignored

**Symptom:** You send messages to your self-chat but Pilot does not respond.

**Cause:** Most commonly, `selfChatOnly` is set to `false` and message routing has changed, or the daemon is not running.

**Fix:**
```bash
# Check daemon status
pilot daemon status

# Verify selfChatOnly is true (required for self-chat pattern)
pilot config get whatsapp.selfChatOnly

# If false, re-enable it
pilot config set whatsapp.selfChatOnly true

# Restart the daemon
pilot daemon restart
```

Also confirm that `approvalViaWhatsApp` is `true` if you expect to answer approvals through WhatsApp.
