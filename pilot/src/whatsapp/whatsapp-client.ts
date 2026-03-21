import path from 'path';
import { PILOT_HOME, type PilotConfig } from '../utils/config.js';
import { logger } from '../utils/logger.js';
import { WhatsAppMock } from './whatsapp-mock.js';
import type { WhatsAppStatus } from './whatsapp.types.js';

export type MessageHandler = (body: string) => Promise<string | null>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any;

/**
 * WhatsApp client wrapper using wwebjs (whatsapp-web.js).
 * Falls back to mock mode when disabled or when wwebjs is not installed.
 */
export class WhatsAppClient {
  private client: AnyClient = null;
  private mock: WhatsAppMock | null = null;
  private connected = false;
  private messageHandler: MessageHandler | null = null;
  private config: PilotConfig['whatsapp'];

  constructor(config: PilotConfig['whatsapp']) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    if (!this.config.enabled) {
      logger.info('WhatsApp disabled in config');
      return;
    }

    if (this.config.mock) {
      this.mock = new WhatsAppMock();
      await this.mock.initialize();
      this.connected = true;
      return;
    }

    try {
      await this.initializeWwebjs();
    } catch (err) {
      logger.error('WhatsApp initialization failed, falling back to mock', {
        error: (err as Error).message,
      });
      this.mock = new WhatsAppMock();
      await this.mock.initialize();
      this.connected = true;
    }
  }

  private async initializeWwebjs(): Promise<void> {
    // Dynamic import — wwebjs may not be installed
    const wweb = await import('whatsapp-web.js');
    const { Client, LocalAuth } = wweb;

    const authPath = path.join(PILOT_HOME, 'whatsapp', '.wwebjs_auth');

    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: 'claude-pilot',
        dataPath: authPath,
      }),
      puppeteer: {
        headless: 'shell' as AnyClient,  // Required for kernel 5.4
        pipe: false,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-first-run',
          '--disable-extensions',
        ],
      },
    });

    this.client.on('qr', (qr: string) => {
      logger.info('WhatsApp QR code received — scan with phone');
      // Print QR to terminal
      console.log('\n  Scan this QR code with WhatsApp:\n');
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const qrt = require('qrcode-terminal');
        qrt.generate(qr, { small: true });
      } catch {
        console.log(`  QR: ${qr}`);
      }
    });

    this.client.on('ready', () => {
      this.connected = true;
      logger.info('WhatsApp client ready');
    });

    this.client.on('disconnected', () => {
      this.connected = false;
      logger.warn('WhatsApp client disconnected');
    });

    // Handle incoming messages (self-chat pattern)
    this.client.on('message_create', (msg: AnyClient) => {
      if (!this.messageHandler) return;
      if (this.config.selfChatOnly && !msg.fromMe) return;

      const body = msg.body as string;
      if (!body) return;

      this.messageHandler(body).then((reply: string | null) => {
        if (reply) {
          msg.reply(reply).catch(() => {
            logger.error('Failed to reply to WhatsApp message');
          });
        }
      }).catch((err: Error) => {
        logger.error('WhatsApp message handler error', { error: err.message });
      });
    });

    await this.client.initialize();
  }

  onMessage(handler: MessageHandler): void {
    this.messageHandler = handler;
  }

  async sendMessage(body: string): Promise<void> {
    if (this.mock) {
      await this.mock.sendMessage('self', body);
      return;
    }

    if (!this.client || !this.connected) {
      logger.warn('WhatsApp not connected, message dropped', { body: body.substring(0, 50) });
      return;
    }

    try {
      const chatId = this.client.info.wid._serialized;
      await this.client.sendMessage(chatId, body);
    } catch (err) {
      logger.error('Failed to send WhatsApp message', { error: (err as Error).message });
    }
  }

  getStatus(): WhatsAppStatus {
    return {
      connected: this.connected,
      mock: !!this.mock,
    };
  }

  async destroy(): Promise<void> {
    if (this.mock) {
      await this.mock.destroy();
      return;
    }
    if (this.client) {
      try {
        await this.client.destroy();
      } catch {
        // ignore
      }
    }
  }
}
