import { logger } from '../utils/logger.js';
import * as tmux from '../utils/tmux.js';
import * as sessionManager from '../session/session-manager.js';
import { classifyRisk } from '../session/session-parser.js';
import type { PilotSession, ApprovalRequest } from '../session/session.types.js';
import type { PilotConfig } from '../utils/config.js';

const activeLocks = new Map<string, boolean>();

export type NotifyCallback = (approval: ApprovalRequest, session: PilotSession) => Promise<void>;

let notifyFn: NotifyCallback | null = null;

export function setNotifyCallback(fn: NotifyCallback): void {
  notifyFn = fn;
}

/**
 * Handle a new permission prompt detected by the session monitor
 */
export async function handlePermissionPrompt(
  session: PilotSession,
  tool: string,
  description: string,
  fullPrompt: string,
  config: PilotConfig,
): Promise<ApprovalRequest | null> {
  // Check auto-approve
  if (shouldAutoApprove(session, tool, description, config)) {
    logger.info(`Auto-approving: ${tool} for ${session.name}`);
    tmux.sendRawKey(session.tmuxSession, 'Y');

    const approval = await sessionManager.createApproval({
      sessionId: session.id,
      sessionName: session.name,
      tool,
      description,
      fullPrompt,
      riskLevel: classifyRisk(tool, description),
      timeoutMs: config.approvalTimeoutMs,
    });
    await sessionManager.resolveApproval(approval.id, 'Y', 'auto');
    return approval;
  }

  // Create pending approval
  const approval = await sessionManager.createApproval({
    sessionId: session.id,
    sessionName: session.name,
    tool,
    description,
    fullPrompt,
    riskLevel: classifyRisk(tool, description),
    timeoutMs: config.approvalTimeoutMs,
  });

  await sessionManager.updateSessionStatus(session.id, 'waiting_approval');

  // Notify via WhatsApp (or other channels)
  if (notifyFn) {
    try {
      await notifyFn(approval, session);
    } catch (err) {
      logger.error('Notification failed', { error: (err as Error).message });
    }
  }

  // Set up timeout
  setTimeout(async () => {
    await handleTimeout(approval.id, session, config);
  }, config.approvalTimeoutMs);

  return approval;
}

/**
 * Respond to a pending approval (from any source: WhatsApp, TUI, CLI)
 */
export async function respondToApproval(
  approvalId: string,
  response: 'Y' | 'N' | 'A',
  source: ApprovalRequest['resolvedBy'],
): Promise<ApprovalRequest | null> {
  // Prevent race conditions
  if (activeLocks.get(approvalId)) return null;
  activeLocks.set(approvalId, true);

  try {
    const approval = await sessionManager.getApproval(approvalId);
    if (!approval || approval.status !== 'pending') {
      return null;
    }

    // Inject keystroke
    const session = await sessionManager.findSession(approval.sessionId);
    if (session && tmux.sessionExists(session.tmuxSession)) {
      const key = response === 'N' ? 'n' : response;
      tmux.sendRawKey(session.tmuxSession, key);

      // If "Always", add to session auto-approve patterns
      if (response === 'A') {
        session.autoApprovePatterns.push(approval.tool);
        await sessionManager.saveSession(session);
      }

      await sessionManager.updateSessionStatus(session.id, 'running');
    }

    const resolved = await sessionManager.resolveApproval(approvalId, response, source);
    logger.info(`Approval ${approvalId}: ${response} by ${source}`);
    return resolved;
  } finally {
    activeLocks.delete(approvalId);
  }
}

async function handleTimeout(approvalId: string, session: PilotSession, config: PilotConfig): Promise<void> {
  const approval = await sessionManager.getApproval(approvalId);
  if (!approval || approval.status !== 'pending') return;

  const defaultAction = config.defaultTimeoutAction === 'approve' ? 'Y' : 'N';
  logger.info(`Approval timeout: ${approvalId}, default: ${defaultAction}`);

  if (tmux.sessionExists(session.tmuxSession)) {
    tmux.sendRawKey(session.tmuxSession, defaultAction === 'Y' ? 'Y' : 'n');
  }

  await sessionManager.resolveApproval(approvalId, defaultAction === 'Y' ? 'Y' : 'N', 'timeout');
  await sessionManager.updateSessionStatus(session.id, 'running');
}

function shouldAutoApprove(session: PilotSession, tool: string, description: string, config: PilotConfig): boolean {
  if (session.permissionMode === 'dontAsk') return true;

  const allPatterns = [...session.autoApprovePatterns, ...config.autoApprovePatterns];
  for (const pattern of allPatterns) {
    if (tool === pattern || tool.toLowerCase() === pattern.toLowerCase()) return true;
    try {
      if (description.match(new RegExp(pattern, 'i'))) return true;
    } catch {
      // Invalid regex — skip
    }
  }

  if (config.autoApproveLowRisk && classifyRisk(tool, description) === 'low') return true;

  return false;
}
