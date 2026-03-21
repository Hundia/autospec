import { logger } from '../utils/logger.js';

/**
 * Mock WhatsApp client for development/testing.
 * Logs messages instead of sending them.
 */
export class WhatsAppMock {
  private messageLog: Array<{ to: string; body: string; timestamp: number }> = [];

  async initialize(): Promise<void> {
    logger.info('WhatsApp mock initialized');
  }

  async sendMessage(to: string, body: string): Promise<void> {
    const entry = { to, body, timestamp: Date.now() };
    this.messageLog.push(entry);
    logger.info(`[WhatsApp Mock] → ${to}: ${body.substring(0, 100)}...`);
  }

  getMessageLog(): Array<{ to: string; body: string; timestamp: number }> {
    return [...this.messageLog];
  }

  isConnected(): boolean {
    return true;
  }

  async destroy(): Promise<void> {
    this.messageLog = [];
    logger.info('WhatsApp mock destroyed');
  }
}
