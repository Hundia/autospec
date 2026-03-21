import chalk from 'chalk';
import { getApproval, resolveApproval, listPendingApprovals } from '../session/session-manager.js';
import * as tmux from '../utils/tmux.js';
import { findSession } from '../session/session-manager.js';

interface ApproveOptions {
  always?: boolean;
}

export async function runApprove(approvalId: string, opts: ApproveOptions): Promise<void> {
  const response = opts.always ? 'A' : 'Y';
  await respondToApproval(approvalId, response);
}

export async function runDeny(approvalId: string): Promise<void> {
  await respondToApproval(approvalId, 'N');
}

async function respondToApproval(approvalId: string, response: 'Y' | 'N' | 'A'): Promise<void> {
  // If no ID given, use latest pending
  if (!approvalId) {
    const pending = await listPendingApprovals();
    if (pending.length === 0) {
      console.log(chalk.dim('  No pending approvals.'));
      return;
    }
    approvalId = pending[0].id;
  }

  const approval = await getApproval(approvalId);
  if (!approval) {
    console.log(chalk.red(`  Approval not found: ${approvalId}`));
    process.exit(1);
  }

  if (approval.status !== 'pending') {
    console.log(chalk.dim(`  Approval already resolved: ${approval.status}`));
    return;
  }

  // Find session and inject keystroke
  const session = await findSession(approval.sessionId);
  if (session && tmux.sessionExists(session.tmuxSession)) {
    const key = response === 'N' ? 'n' : response;
    tmux.sendRawKey(session.tmuxSession, key);
  }

  // Update approval state
  await resolveApproval(approvalId, response, 'cli');

  const action = response === 'Y' ? 'Approved' : response === 'A' ? 'Always approved' : 'Denied';
  const color = response === 'N' ? chalk.red : chalk.green;
  console.log(color(`  ${action}: ${approval.tool} — ${approval.description}`));
}
