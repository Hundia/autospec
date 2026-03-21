import type { IncomingCommand } from './whatsapp.types.js';

/**
 * Parse incoming WhatsApp messages into commands.
 * Supports English and Hebrew responses.
 */
export function parseCommand(text: string): IncomingCommand {
  const trimmed = text.trim().toLowerCase();

  // Approval responses (single char or word)
  if (/^(y|yes|כן|approve)$/i.test(trimmed)) {
    return { type: 'approve' };
  }
  if (/^(n|no|לא|deny|reject)$/i.test(trimmed)) {
    return { type: 'deny' };
  }
  if (/^(a|always|תמיד)$/i.test(trimmed)) {
    return { type: 'always' };
  }

  // Targeted approval: "approve apr-abc123"
  const approveMatch = trimmed.match(/^approve\s+(apr-\w+)$/i);
  if (approveMatch) {
    return { type: 'approve', approvalId: approveMatch[1] };
  }

  const denyMatch = trimmed.match(/^deny\s+(apr-\w+)$/i);
  if (denyMatch) {
    return { type: 'deny', approvalId: denyMatch[1] };
  }

  // Status
  if (/^(status|סטטוס)$/i.test(trimmed)) {
    return { type: 'status' };
  }

  // List
  if (/^(list|sessions|רשימה)$/i.test(trimmed)) {
    return { type: 'list' };
  }

  // Kill: "kill sprint-42"
  const killMatch = trimmed.match(/^kill\s+(.+)$/i);
  if (killMatch) {
    return { type: 'kill', sessionName: killMatch[1] };
  }

  // Logs: "logs sprint-42"
  const logsMatch = trimmed.match(/^logs\s+(.+)$/i);
  if (logsMatch) {
    return { type: 'logs', sessionName: logsMatch[1] };
  }

  // Retry
  if (/^(retry|שוב)$/i.test(trimmed)) {
    return { type: 'retry' };
  }

  // Help
  if (/^(help|\?|עזרה)$/i.test(trimmed)) {
    return { type: 'help' };
  }

  return { type: 'unknown', raw: text };
}

export const HELP_MESSAGE = `🤖 *Claude Pilot Commands*

*Approvals:*
Y — approve latest
N — deny latest
A — always approve this tool
approve <id> — approve specific

*Sessions:*
status — daemon & session status
list — active sessions
kill <name> — kill session
logs <name> — last 10 lines

*Other:*
retry — retry last error
help — this message`;
