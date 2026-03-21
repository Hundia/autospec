import net from 'net';
import path from 'path';
import fs from 'fs-extra';
import { PILOT_HOME } from '../utils/config.js';
import { encodeMessage, decodeMessages } from './protocol.js';
import type { DaemonRequest, DaemonResponse } from '../daemon/daemon.types.js';

export const SOCKET_PATH = path.join(PILOT_HOME, 'daemon.sock');

export type RequestHandler = (request: DaemonRequest) => Promise<DaemonResponse>;

/**
 * Create Unix domain socket server (daemon side)
 */
export function createSocketServer(handler: RequestHandler): net.Server {
  // Clean up stale socket
  if (fs.existsSync(SOCKET_PATH)) {
    fs.removeSync(SOCKET_PATH);
  }

  const server = net.createServer((conn) => {
    let buffer = '';

    conn.on('data', async (data) => {
      buffer += data.toString();
      const { messages, remainder } = decodeMessages(buffer);
      buffer = remainder;

      for (const msg of messages) {
        try {
          const response = await handler(msg as DaemonRequest);
          conn.write(encodeMessage(response));
        } catch (err) {
          conn.write(encodeMessage({
            type: 'error',
            payload: { message: (err as Error).message, code: 'HANDLER_ERROR' },
          }));
        }
      }
    });

    conn.on('error', () => {
      // Client disconnected — ignore
    });
  });

  server.listen(SOCKET_PATH);
  // Set permissions so only current user can access
  fs.chmodSync(SOCKET_PATH, 0o600);

  return server;
}

/**
 * Send a request to the daemon and get a response (CLI side)
 */
export function sendRequest(request: DaemonRequest, timeoutMs = 10_000): Promise<DaemonResponse> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(SOCKET_PATH)) {
      reject(new Error('Daemon is not running. Start it with: pilot daemon start'));
      return;
    }

    const client = net.createConnection(SOCKET_PATH);
    let buffer = '';
    let resolved = false;

    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        client.destroy();
        reject(new Error('Daemon request timed out'));
      }
    }, timeoutMs);

    client.on('connect', () => {
      client.write(encodeMessage(request));
    });

    client.on('data', (data) => {
      buffer += data.toString();
      const { messages } = decodeMessages(buffer);
      if (messages.length > 0 && !resolved) {
        resolved = true;
        clearTimeout(timer);
        client.destroy();
        resolve(messages[0] as DaemonResponse);
      }
    });

    client.on('error', (err) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        reject(new Error(`Cannot connect to daemon: ${err.message}`));
      }
    });
  });
}

/**
 * Check if daemon is reachable
 */
export async function isDaemonRunning(): Promise<boolean> {
  try {
    const response = await sendRequest({ type: 'ping' }, 3000);
    return response.type === 'pong';
  } catch {
    return false;
  }
}
