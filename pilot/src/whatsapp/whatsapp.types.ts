export interface WhatsAppConfig {
  enabled: boolean;
  mock: boolean;
  selfChatOnly: boolean;
  notifyOnStart: boolean;
  notifyOnComplete: boolean;
  notifyOnError: boolean;
  approvalViaWhatsApp: boolean;
}

export interface WhatsAppStatus {
  connected: boolean;
  mock: boolean;
  phoneNumber?: string;
  lastMessage?: number;
}

export type IncomingCommand =
  | { type: 'approve'; approvalId?: string }
  | { type: 'deny'; approvalId?: string }
  | { type: 'always'; approvalId?: string }
  | { type: 'status' }
  | { type: 'list' }
  | { type: 'kill'; sessionName: string }
  | { type: 'logs'; sessionName: string }
  | { type: 'retry' }
  | { type: 'help' }
  | { type: 'unknown'; raw: string };
