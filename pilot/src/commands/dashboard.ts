import chalk from 'chalk';
import { listSessions, listPendingApprovals } from '../session/session-manager.js';
import { isDaemonRunning } from '../ipc/socket-transport.js';
import { loadConfig } from '../utils/config.js';
import type { PilotSession, ApprovalRequest } from '../session/session.types.js';

const STATUS_ICONS: Record<string, string> = {
  launching: '🔄',
  running: '▶',
  waiting_approval: '⏳',
  completed: '✅',
  error: '❌',
  killed: '💀',
};

function clearScreen(): void {
  process.stdout.write('\x1B[2J\x1B[0f');
}

function renderHeader(daemonOk: boolean, waEnabled: boolean): string {
  const daemonStatus = daemonOk ? chalk.green('● running') : chalk.red('● stopped');
  const waStatus = waEnabled ? chalk.blue('● enabled') : chalk.dim('○ disabled');
  return `
  ${chalk.bold('Claude Pilot Dashboard')}          Daemon: ${daemonStatus}  WhatsApp: ${waStatus}
  ${chalk.dim('─'.repeat(72))}`;
}

function renderSessions(sessions: PilotSession[]): string {
  if (sessions.length === 0) {
    return `\n  ${chalk.dim('No active sessions.')}\n`;
  }

  let out = `\n  ${chalk.bold('Sessions')} (${sessions.length})\n\n`;
  out += chalk.dim(`  ${'Name'.padEnd(18)} ${'Status'.padEnd(14)} ${'Duration'.padEnd(10)} ${'Tools'.padEnd(6)} Last Activity\n`);
  out += chalk.dim(`  ${'─'.repeat(68)}\n`);

  for (const s of sessions) {
    const icon = STATUS_ICONS[s.status] ?? '?';
    const name = s.name.substring(0, 16).padEnd(18);
    const status = `${icon} ${s.status}`.padEnd(14);
    const ms = (s.completedAt ?? Date.now()) - (s.startedAt ?? s.createdAt);
    const min = Math.floor(ms / 60_000);
    const dur = min < 60 ? `${min}m` : `${Math.floor(min / 60)}h ${min % 60}m`;
    const tools = String(s.toolCallCount).padEnd(6);
    const last = s.lastOutput?.substring(0, 28) || '—';

    const color = s.status === 'error' ? chalk.red
      : s.status === 'running' ? chalk.white
      : s.status === 'waiting_approval' ? chalk.yellow
      : chalk.dim;

    out += color(`  ${name} ${status} ${dur.padEnd(10)} ${tools} ${last}\n`);
  }

  return out;
}

function renderApprovals(approvals: ApprovalRequest[]): string {
  if (approvals.length === 0) return '';

  let out = `\n  ${chalk.bold.yellow('Pending Approvals')} (${approvals.length})\n\n`;
  for (const a of approvals) {
    const timeLeft = Math.max(0, Math.floor((a.timeoutAt - Date.now()) / 1000));
    const riskColor = a.riskLevel === 'high' ? chalk.red : a.riskLevel === 'medium' ? chalk.yellow : chalk.green;
    out += `  ${riskColor('●')} ${a.sessionName} — ${chalk.bold(a.tool)}: ${a.description.substring(0, 40)}\n`;
    out += chalk.dim(`    ID: ${a.id}  Timeout: ${timeLeft}s\n`);
  }

  return out;
}

function renderFooter(): string {
  return `
  ${chalk.dim('─'.repeat(72))}
  ${chalk.dim('Commands:')} pilot approve <id> | pilot deny <id> | pilot attach <name> | Ctrl-C quit
`;
}

export async function runDashboard(): Promise<void> {
  const config = await loadConfig();

  const refresh = async () => {
    clearScreen();
    const daemonOk = await isDaemonRunning();
    const sessions = await listSessions(true);
    const approvals = await listPendingApprovals();

    let output = renderHeader(daemonOk, config.whatsapp.enabled);
    output += renderSessions(sessions);
    output += renderApprovals(approvals);
    output += renderFooter();

    process.stdout.write(output);
  };

  // Initial render
  await refresh();

  // Auto-refresh
  const interval = setInterval(refresh, config.tui.refreshIntervalMs);

  // Handle exit
  process.on('SIGINT', () => {
    clearInterval(interval);
    clearScreen();
    process.exit(0);
  });

  // Keep alive
  await new Promise(() => {});
}
