import type { DaemonRequest, DaemonResponse } from '../daemon/daemon.types.js';

const DELIMITER = '\n';

export function encodeMessage(msg: DaemonRequest | DaemonResponse): string {
  return JSON.stringify(msg) + DELIMITER;
}

export function decodeMessages(buffer: string): { messages: (DaemonRequest | DaemonResponse)[]; remainder: string } {
  const messages: (DaemonRequest | DaemonResponse)[] = [];
  const parts = buffer.split(DELIMITER);

  // Last part may be incomplete
  const remainder = parts.pop() ?? '';

  for (const part of parts) {
    if (!part.trim()) continue;
    try {
      messages.push(JSON.parse(part));
    } catch {
      // Skip malformed messages
    }
  }

  return { messages, remainder };
}
