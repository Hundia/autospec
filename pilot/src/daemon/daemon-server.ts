import path from 'path';
import fs from 'fs-extra';
import { PILOT_HOME, loadConfig, type PilotConfig } from '../utils/config.js';
import { logger, setLogFile, setLogLevel } from '../utils/logger.js';
import { setupSignalHandlers, registerCleanup } from '../utils/signals.js';
import { createSocketServer, SOCKET_PATH } from '../ipc/socket-transport.js';
import { startMonitoring, stopMonitoring } from '../session/session-monitor.js';
import * as sessionManager from '../session/session-manager.js';
import { launchSession } from '../session/session-launcher.js';
import * as tmux from '../utils/tmux.js';
import { WhatsAppNotifier } from '../whatsapp/whatsapp-notifier.js';
import type { DaemonRequest, DaemonResponse, DaemonStatus } from './daemon.types.js';

const PID_FILE = path.join(PILOT_HOME, 'daemon.pid');
const startTime = Date.now();
let waNotifier: WhatsAppNotifier | null = null;

export async function startDaemon(foreground = false): Promise<void> {
  const config = await loadConfig();
  setLogFile('daemon.log');
  setLogLevel(config.logLevel);

  // Check for existing daemon
  if (await fs.pathExists(PID_FILE)) {
    const existingPid = parseInt(await fs.readFile(PID_FILE, 'utf-8'));
    try {
      process.kill(existingPid, 0);
      console.error(`Daemon already running (PID ${existingPid}). Stop it first: pilot daemon stop`);
      process.exit(1);
    } catch {
      // Stale PID file
      await fs.remove(PID_FILE);
    }
  }

  // Write PID file
  await fs.writeFile(PID_FILE, String(process.pid));

  // Initialize WhatsApp if enabled
  if (config.whatsapp.enabled) {
    waNotifier = new WhatsAppNotifier(config);
    try {
      await waNotifier.initialize();
      logger.info('WhatsApp notifier initialized');
    } catch (err) {
      logger.error('WhatsApp init failed', { error: (err as Error).message });
      waNotifier = null;
    }
  }

  // Clean up on exit
  registerCleanup(async () => {
    stopMonitoring();
    if (waNotifier) await waNotifier.destroy();
    await fs.remove(PID_FILE);
    await fs.remove(SOCKET_PATH);
    logger.info('Daemon shut down');
  });

  setupSignalHandlers();

  // Start socket server
  createSocketServer(handleRequest.bind(null, config));

  logger.info(`Daemon started (PID ${process.pid})`);

  // Start session monitor
  startMonitoring({
    config,
    onApprovalNeeded: async (approval, session) => {
      logger.info(`Approval needed for ${session.name}: ${approval.tool} — ${approval.description}`);
      if (waNotifier) {
        await waNotifier.notifyApprovalNeeded(approval, session);
      }
    },
    onSessionEvent: async (event, session) => {
      logger.info(`Session event: ${event} for ${session.name}`);
      if (waNotifier) {
        if (event === 'completed') await waNotifier.notifySessionCompleted(session);
        if (event === 'error') await waNotifier.notifySessionError(session);
      }
    },
  });

  if (foreground) {
    console.log(`Daemon running (PID ${process.pid}). Press Ctrl-C to stop.`);
  } else {
    console.log(`Daemon started (PID ${process.pid}).`);
  }
}

async function handleRequest(config: PilotConfig, request: DaemonRequest): Promise<DaemonResponse> {
  switch (request.type) {
    case 'ping':
      return { type: 'pong' };

    case 'status': {
      const sessions = await sessionManager.listSessions();
      const pendingApprovals = await sessionManager.listPendingApprovals();
      const status: DaemonStatus = {
        pid: process.pid,
        uptime: Date.now() - startTime,
        activeSessions: sessions.filter(s => s.status === 'running' || s.status === 'waiting_approval').length,
        pendingApprovals: pendingApprovals.length,
        whatsappConnected: waNotifier?.getStatus().connected ?? false,
      };
      return { type: 'status', payload: status };
    }

    case 'session.create': {
      const { name, prompt, cwd, autoApprove, approveReads, skill, resume, model } = request.payload;
      try {
        const session = await launchSession({
          prompt,
          name,
          cwd,
          autoApprove,
          approveReads,
          skill,
          resume,
          model,
          config,
        });
        return { type: 'session.created', payload: session };
      } catch (err) {
        return { type: 'error', payload: { message: (err as Error).message, code: 'LAUNCH_FAILED' } };
      }
    }

    case 'session.kill': {
      const { nameOrId, force } = request.payload;
      const session = await sessionManager.findSession(nameOrId);
      if (!session) {
        return { type: 'error', payload: { message: `Session not found: ${nameOrId}`, code: 'NOT_FOUND' } };
      }
      if (tmux.sessionExists(session.tmuxSession)) {
        tmux.destroySession(session.tmuxSession, force);
      }
      await sessionManager.updateSessionStatus(session.id, 'killed');
      return { type: 'session.killed', payload: { sessionId: session.id } };
    }

    case 'session.list': {
      const sessions = await sessionManager.listSessions(request.payload?.all);
      return { type: 'session.list', payload: sessions };
    }

    case 'approval.respond': {
      const { approvalId, response } = request.payload;
      const approval = await sessionManager.getApproval(approvalId);
      if (!approval) {
        return { type: 'error', payload: { message: `Approval not found: ${approvalId}`, code: 'NOT_FOUND' } };
      }

      // Inject keystroke into tmux
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

      const resolved = await sessionManager.resolveApproval(approvalId, response, 'cli');
      if (!resolved) {
        return { type: 'error', payload: { message: 'Approval already resolved', code: 'ALREADY_RESOLVED' } };
      }
      return { type: 'approval.responded', payload: resolved };
    }

    default:
      return { type: 'error', payload: { message: `Unknown request type`, code: 'UNKNOWN' } };
  }
}
