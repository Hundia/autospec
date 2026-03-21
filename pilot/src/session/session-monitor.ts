import { logger } from '../utils/logger.js';
import * as tmux from '../utils/tmux.js';
import * as sessionManager from './session-manager.js';
import { parseOutput, classifyRisk } from './session-parser.js';
import type { PilotSession, ApprovalRequest } from './session.types.js';
import type { PilotConfig } from '../utils/config.js';

export type ApprovalCallback = (approval: ApprovalRequest, session: PilotSession) => Promise<void>;
export type SessionEventCallback = (event: string, session: PilotSession) => Promise<void>;

export interface MonitorOptions {
  config: PilotConfig;
  onApprovalNeeded: ApprovalCallback;
  onSessionEvent: SessionEventCallback;
}

let monitoring = false;
let monitorInterval: ReturnType<typeof setInterval> | null = null;
const processedPrompts = new Set<string>();

export function startMonitoring(opts: MonitorOptions): void {
  if (monitoring) return;
  monitoring = true;

  logger.info('Session monitor started');

  monitorInterval = setInterval(async () => {
    try {
      await pollSessions(opts);
    } catch (err) {
      logger.error('Monitor poll error', { error: (err as Error).message });
    }
  }, opts.config.tui.refreshIntervalMs);
}

export function stopMonitoring(): void {
  monitoring = false;
  if (monitorInterval) {
    clearInterval(monitorInterval);
    monitorInterval = null;
  }
  processedPrompts.clear();
  logger.info('Session monitor stopped');
}

async function pollSessions(opts: MonitorOptions): Promise<void> {
  const sessions = await sessionManager.listSessions();

  for (const session of sessions) {
    if (session.status !== 'running' && session.status !== 'waiting_approval') continue;
    if (!tmux.sessionExists(session.tmuxSession)) {
      // tmux session gone — mark as completed or error
      await sessionManager.updateSessionStatus(session.id, 'completed');
      await opts.onSessionEvent('completed', session);
      continue;
    }

    const output = tmux.capturePaneOutput(session.tmuxSession, 50);
    const parsed = parseOutput(output);

    switch (parsed.type) {
      case 'permission_prompt': {
        if (!parsed.permission) break;

        // Deduplicate: don't fire for the same prompt twice
        const promptKey = `${session.id}:${parsed.permission.fullPrompt}`;
        if (processedPrompts.has(promptKey)) break;
        processedPrompts.add(promptKey);

        // Check auto-approve patterns
        const shouldAutoApprove = checkAutoApprove(session, parsed.permission.tool, parsed.permission.description, opts.config);

        if (shouldAutoApprove) {
          logger.info(`Auto-approving: ${parsed.permission.tool} for ${session.name}`);
          tmux.sendRawKey(session.tmuxSession, 'Y');
          const approval = await sessionManager.createApproval({
            sessionId: session.id,
            sessionName: session.name,
            tool: parsed.permission.tool,
            description: parsed.permission.description,
            fullPrompt: parsed.permission.fullPrompt,
            riskLevel: classifyRisk(parsed.permission.tool, parsed.permission.description),
            timeoutMs: opts.config.approvalTimeoutMs,
          });
          await sessionManager.resolveApproval(approval.id, 'Y', 'auto');
        } else {
          // Create approval request and notify
          const approval = await sessionManager.createApproval({
            sessionId: session.id,
            sessionName: session.name,
            tool: parsed.permission.tool,
            description: parsed.permission.description,
            fullPrompt: parsed.permission.fullPrompt,
            riskLevel: classifyRisk(parsed.permission.tool, parsed.permission.description),
            timeoutMs: opts.config.approvalTimeoutMs,
          });

          await sessionManager.updateSessionStatus(session.id, 'waiting_approval');
          await opts.onApprovalNeeded(approval, session);

          // Set up timeout
          setTimeout(async () => {
            const current = await sessionManager.getApproval(approval.id);
            if (current && current.status === 'pending') {
              const defaultAction = opts.config.defaultTimeoutAction === 'approve' ? 'Y' : 'N';
              logger.info(`Approval timeout: ${approval.id}, default action: ${defaultAction}`);
              tmux.sendRawKey(session.tmuxSession, defaultAction === 'Y' ? 'Y' : 'n');
              await sessionManager.resolveApproval(approval.id, defaultAction === 'Y' ? 'Y' : 'N', 'timeout');
              await sessionManager.updateSessionStatus(session.id, 'running');
            }
          }, opts.config.approvalTimeoutMs);
        }
        break;
      }

      case 'completed': {
        await sessionManager.updateSessionStatus(session.id, 'completed', {
          lastOutput: parsed.lastLine ?? '',
        });
        await opts.onSessionEvent('completed', session);
        // Clean up prompt tracking
        for (const key of processedPrompts) {
          if (key.startsWith(session.id)) processedPrompts.delete(key);
        }
        break;
      }

      case 'error': {
        await sessionManager.updateSessionStatus(session.id, 'error', {
          lastOutput: parsed.error ?? '',
          errorCount: session.errorCount + 1,
        });
        await opts.onSessionEvent('error', session);
        break;
      }

      case 'running': {
        // Update last activity
        if (parsed.lastLine && parsed.lastLine !== session.lastOutput) {
          await sessionManager.updateSessionStatus(session.id, 'running', {
            lastOutput: parsed.lastLine.substring(0, 200),
          });
        }
        break;
      }
    }
  }
}

function checkAutoApprove(session: PilotSession, tool: string, description: string, config: PilotConfig): boolean {
  if (session.permissionMode === 'dontAsk') return true;

  // Check session-specific patterns
  for (const pattern of session.autoApprovePatterns) {
    if (tool === pattern || tool.toLowerCase() === pattern.toLowerCase()) return true;
    if (description.match(new RegExp(pattern, 'i'))) return true;
  }

  // Check global config patterns
  for (const pattern of config.autoApprovePatterns) {
    if (tool === pattern || tool.toLowerCase() === pattern.toLowerCase()) return true;
    if (description.match(new RegExp(pattern, 'i'))) return true;
  }

  // Check low risk auto-approve
  if (config.autoApproveLowRisk && classifyRisk(tool, description) === 'low') return true;

  return false;
}
