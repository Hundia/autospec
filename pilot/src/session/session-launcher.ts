import path from 'path';
import { nanoid } from 'nanoid';
import { PILOT_HOME, type PilotConfig } from '../utils/config.js';
import { logger } from '../utils/logger.js';
import * as tmux from '../utils/tmux.js';
import * as sessionManager from './session-manager.js';
import type { PilotSession } from './session.types.js';
import { resolveProvider } from '../providers/resolver.js';

export interface LaunchOptions {
  prompt: string;
  name?: string;
  cwd?: string;
  autoApprove?: boolean;
  approveReads?: boolean;
  skill?: string;
  resume?: string;
  model?: string;
  provider?: string;
  config: PilotConfig;
}

export async function launchSession(opts: LaunchOptions): Promise<PilotSession> {
  const {
    prompt,
    cwd = process.cwd(),
    autoApprove = false,
    approveReads = false,
    skill,
    resume,
    model,
    provider: providerOverride,
    config,
  } = opts;

  const name = opts.name ?? `session-${nanoid(6)}`;
  const tmuxSessionName = `${config.tmuxSessionPrefix}${name}`;

  const sessionId = nanoid(16);

  // Resolve the provider and build the command
  const provider = await resolveProvider(providerOverride, config);
  const commandArgs = provider.buildCommand({
    prompt,
    sessionId,
    name,
    model: model ?? (config.defaultModel || undefined),
    fallbackModel: config.fallbackModel || undefined,
    autoApprove,
    skill,
    resume,
  });
  const command = commandArgs.join(' ');

  // Determine auto-approve patterns
  const autoApprovePatterns = [...config.autoApprovePatterns];
  if (approveReads) {
    autoApprovePatterns.push('Read', 'Glob', 'Grep');
  }

  // Create tmux session
  tmux.createSession({
    name: tmuxSessionName,
    cwd,
    scrollbackLimit: config.scrollbackLimit,
  });

  // Start logging
  const logPath = path.join(PILOT_HOME, 'logs', `${name}.log`);
  tmux.startLogging(tmuxSessionName, logPath);

  // Create session state
  const session = await sessionManager.createSession({
    name,
    prompt: skill ? `/${skill} ${prompt}` : prompt,
    cwd,
    tmuxSession: tmuxSessionName,
    permissionMode: autoApprove ? 'dontAsk' : config.defaultPermissionMode,
    autoApprovePatterns,
  });

  // Update with claude session ID
  session.claudeSessionId = sessionId;
  await sessionManager.saveSession(session);

  // Send the command to tmux
  tmux.sendKeys(tmuxSessionName, command);

  // Update status to running
  await sessionManager.updateSessionStatus(session.id, 'running');

  logger.info(`Launched session: ${name}`, { command, tmuxSession: tmuxSessionName });

  return session;
}
