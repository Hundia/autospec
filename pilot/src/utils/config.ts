import { z } from 'zod';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

export const PILOT_HOME = path.join(os.homedir(), '.claude-pilot');

export const PilotConfigSchema = z.object({
  defaultPermissionMode: z.enum(['default', 'dontAsk', 'auto']).default('default'),
  approvalTimeoutMs: z.number().default(300_000),
  defaultTimeoutAction: z.enum(['deny', 'approve']).default('deny'),
  autoApprovePatterns: z.array(z.string()).default([]),
  autoApproveLowRisk: z.boolean().default(false),
  maxConcurrentSessions: z.number().default(5),

  claudePath: z.string().default('claude'),
  defaultModel: z.string().default(''),
  fallbackModel: z.string().default(''),

  tmuxSessionPrefix: z.string().default('pilot-'),
  scrollbackLimit: z.number().default(100_000),

  whatsapp: z.object({
    enabled: z.boolean().default(false),
    mock: z.boolean().default(false),
    selfChatOnly: z.boolean().default(true),
    notifyOnStart: z.boolean().default(true),
    notifyOnComplete: z.boolean().default(true),
    notifyOnError: z.boolean().default(true),
    approvalViaWhatsApp: z.boolean().default(true),
  }).default({}),

  redis: z.object({
    url: z.string().default('redis://localhost:6379'),
    keyPrefix: z.string().default('pilot:'),
    db: z.number().default(2),
  }).default({}),

  logRetentionDays: z.number().default(7),
  logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info'),

  tui: z.object({
    refreshIntervalMs: z.number().default(2_000),
    logLines: z.number().default(15),
  }).default({}),
});

export type PilotConfig = z.infer<typeof PilotConfigSchema>;

const CONFIG_PATH = path.join(PILOT_HOME, 'config.json');

export async function ensurePilotDirs(): Promise<void> {
  await fs.ensureDir(PILOT_HOME);
  await fs.ensureDir(path.join(PILOT_HOME, 'sessions'));
  await fs.ensureDir(path.join(PILOT_HOME, 'approvals'));
  await fs.ensureDir(path.join(PILOT_HOME, 'logs'));
  await fs.ensureDir(path.join(PILOT_HOME, 'whatsapp'));
}

export async function loadConfig(): Promise<PilotConfig> {
  await ensurePilotDirs();

  let raw: Record<string, unknown> = {};
  if (await fs.pathExists(CONFIG_PATH)) {
    try {
      raw = await fs.readJson(CONFIG_PATH);
    } catch {
      // Corrupted config — use defaults
    }
  }

  const config = PilotConfigSchema.parse(raw);
  return config;
}

export async function saveConfig(config: Partial<PilotConfig>): Promise<PilotConfig> {
  await ensurePilotDirs();

  let existing: Record<string, unknown> = {};
  if (await fs.pathExists(CONFIG_PATH)) {
    try {
      existing = await fs.readJson(CONFIG_PATH);
    } catch {
      // ignore
    }
  }

  const merged = { ...existing, ...config };
  const validated = PilotConfigSchema.parse(merged);
  await fs.writeJson(CONFIG_PATH, validated, { spaces: 2 });
  return validated;
}

export async function getConfigValue(key: string): Promise<unknown> {
  const config = await loadConfig();
  const parts = key.split('.');
  let current: unknown = config;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return current;
}

export async function setConfigValue(key: string, value: string): Promise<PilotConfig> {
  const config = await loadConfig() as Record<string, unknown>;
  const parts = key.split('.');

  // Parse value type
  let parsed: unknown = value;
  if (value === 'true') parsed = true;
  else if (value === 'false') parsed = false;
  else if (/^\d+$/.test(value)) parsed = parseInt(value, 10);

  if (parts.length === 1) {
    config[parts[0]] = parsed;
  } else if (parts.length === 2) {
    const nested = (config[parts[0]] ?? {}) as Record<string, unknown>;
    nested[parts[1]] = parsed;
    config[parts[0]] = nested;
  }

  return saveConfig(config as Partial<PilotConfig>);
}
