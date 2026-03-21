import { logger } from '../utils/logger.js';
import { WhatsAppClient } from './whatsapp-client.js';
import { renderTemplate, formatDuration } from './whatsapp-templates.js';
import { parseCommand, HELP_MESSAGE } from './whatsapp-bot.js';
import { respondToApproval } from '../daemon/approval-engine.js';
import * as sessionManager from '../session/session-manager.js';
import * as tmux from '../utils/tmux.js';
import type { PilotSession, ApprovalRequest } from '../session/session.types.js';
import type { PilotConfig } from '../utils/config.js';

/**
 * WhatsApp notifier — sends notifications and handles incoming commands
 */
export class WhatsAppNotifier {
  private client: WhatsAppClient;
  private config: PilotConfig;

  constructor(config: PilotConfig) {
    this.config = config;
    this.client = new WhatsAppClient(config.whatsapp);
  }

  async initialize(): Promise<void> {
    await this.client.initialize();

    // Wire up incoming message handler
    this.client.onMessage(async (body) => {
      return this.handleIncomingMessage(body);
    });

    logger.info('WhatsApp notifier initialized');
  }

  async notifySessionStarted(session: PilotSession): Promise<void> {
    if (!this.config.whatsapp.notifyOnStart) return;
    const msg = renderTemplate('session_started', {
      name: session.name,
      prompt: session.prompt.substring(0, 100),
      cwd: session.cwd,
    });
    await this.client.sendMessage(msg);
  }

  async notifySessionCompleted(session: PilotSession): Promise<void> {
    if (!this.config.whatsapp.notifyOnComplete) return;
    const duration = session.completedAt
      ? formatDuration(session.completedAt - (session.startedAt ?? session.createdAt))
      : 'unknown';
    const msg = renderTemplate('session_completed', {
      name: session.name,
      duration,
      toolCount: session.toolCallCount,
      summary: session.summary ?? session.lastOutput?.substring(0, 100) ?? 'No summary',
    });
    await this.client.sendMessage(msg);
  }

  async notifySessionError(session: PilotSession): Promise<void> {
    if (!this.config.whatsapp.notifyOnError) return;
    const msg = renderTemplate('session_error', {
      name: session.name,
      error: session.lastOutput?.substring(0, 200) ?? 'Unknown error',
    });
    await this.client.sendMessage(msg);
  }

  async notifyApprovalNeeded(approval: ApprovalRequest, _session: PilotSession): Promise<void> {
    if (!this.config.whatsapp.approvalViaWhatsApp) return;
    const msg = renderTemplate('approval_request', {
      name: approval.sessionName,
      tool: approval.tool,
      command: approval.description.substring(0, 200),
      risk: approval.riskLevel,
    });
    await this.client.sendMessage(msg);
  }

  async notifyApprovalTimeout(approval: ApprovalRequest): Promise<void> {
    const msg = renderTemplate('approval_timeout', {
      name: approval.sessionName,
      tool: approval.tool,
      action: this.config.defaultTimeoutAction === 'approve' ? 'Auto-approved' : 'Auto-denied',
    });
    await this.client.sendMessage(msg);
  }

  private async handleIncomingMessage(body: string): Promise<string | null> {
    const command = parseCommand(body);

    switch (command.type) {
      case 'approve':
      case 'deny':
      case 'always': {
        const response = command.type === 'deny' ? 'N' : command.type === 'always' ? 'A' : 'Y';
        const pending = await sessionManager.listPendingApprovals();
        const cmdApprovalId = 'approvalId' in command ? command.approvalId : undefined;
        const target = cmdApprovalId
          ? pending.find(a => a.id === cmdApprovalId)
          : pending[0];

        if (!target) return 'No pending approvals.';

        const resolved = await respondToApproval(target.id, response, 'whatsapp');
        if (!resolved) return 'Approval already resolved.';

        const action = response === 'Y' ? 'Approved' : response === 'A' ? 'Always approved' : 'Denied';
        return `${action}: ${resolved.tool} — ${resolved.description}`;
      }

      case 'status': {
        const sessions = await sessionManager.listSessions();
        const pending = await sessionManager.listPendingApprovals();
        const active = sessions.filter(s => s.status === 'running' || s.status === 'waiting_approval');
        return `*Status*\nActive sessions: ${active.length}\nPending approvals: ${pending.length}`;
      }

      case 'list': {
        const sessions = await sessionManager.listSessions();
        if (sessions.length === 0) return 'No active sessions.';
        return sessions.map(s => {
          const icon = s.status === 'running' ? '▶' : s.status === 'waiting_approval' ? '⏳' : '✅';
          return `${icon} ${s.name} (${s.status})`;
        }).join('\n');
      }

      case 'kill': {
        const session = await sessionManager.findSession(command.sessionName);
        if (!session) return `Session not found: ${command.sessionName}`;
        if (tmux.sessionExists(session.tmuxSession)) {
          tmux.destroySession(session.tmuxSession, true);
        }
        await sessionManager.updateSessionStatus(session.id, 'killed');
        return `Killed: ${session.name}`;
      }

      case 'logs': {
        const session = await sessionManager.findSession(command.sessionName);
        if (!session) return `Session not found: ${command.sessionName}`;
        if (!tmux.sessionExists(session.tmuxSession)) return 'Session tmux not found.';
        const output = tmux.capturePaneOutput(session.tmuxSession, 10);
        return `*Logs: ${session.name}*\n\`\`\`\n${output.substring(0, 500)}\n\`\`\``;
      }

      case 'help':
        return HELP_MESSAGE;

      case 'unknown':
        return null; // Don't reply to unrecognized messages
    }
    return null;
  }

  getStatus() {
    return this.client.getStatus();
  }

  async destroy(): Promise<void> {
    await this.client.destroy();
  }
}
