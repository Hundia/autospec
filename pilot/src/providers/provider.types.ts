export interface PilotProvider {
  readonly name: string;
  readonly displayName: string;
  isAvailable(): Promise<boolean>;
  buildCommand(opts: PilotProviderOptions): string[];
  installInstructions(): string;
}

export interface PilotProviderOptions {
  prompt: string;
  sessionId: string;
  name: string;
  model?: string;
  fallbackModel?: string;
  autoApprove?: boolean;
  skill?: string;
  resume?: string;
}
