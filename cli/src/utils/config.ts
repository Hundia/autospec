/**
 * SDD Configuration Management
 * Handles reading/writing .sddrc.json config files
 */

import fs from 'fs-extra';
import path from 'path';

export interface SDDConfig {
  projectName: string;
  version: string;
  created: string;
  aiProvider: 'claude' | 'copilot' | 'gemini' | 'all';
  techStack: {
    frontend?: string;
    backend?: string;
    database?: string;
    language?: string;
  };
  specsDir: string;
  promptsDir: string;
  activeSprint: number;
  features: {
    multiAgent: boolean;
    autoStatus: boolean;
  };
}

const CONFIG_FILENAME = '.sddrc.json';

const DEFAULT_CONFIG: SDDConfig = {
  projectName: 'My Project',
  version: '1.0.0',
  created: new Date().toISOString().split('T')[0],
  aiProvider: 'claude',
  techStack: {
    frontend: 'React',
    backend: 'Node.js',
    database: 'PostgreSQL',
    language: 'TypeScript',
  },
  specsDir: 'specs',
  promptsDir: 'prompts',
  activeSprint: 0,
  features: {
    multiAgent: true,
    autoStatus: true,
  },
};

/**
 * Get the path to the config file in a directory
 */
export function getConfigPath(dir: string = process.cwd()): string {
  return path.join(dir, CONFIG_FILENAME);
}

/**
 * Check if a config file exists in the directory
 */
export async function configExists(dir: string = process.cwd()): Promise<boolean> {
  return fs.pathExists(getConfigPath(dir));
}

/**
 * Read config from a directory
 */
export async function readConfig(dir: string = process.cwd()): Promise<SDDConfig | null> {
  const configPath = getConfigPath(dir);

  if (await fs.pathExists(configPath)) {
    try {
      const content = await fs.readFile(configPath, 'utf-8');
      return JSON.parse(content) as SDDConfig;
    } catch (error) {
      console.error(`Error reading config: ${error}`);
      return null;
    }
  }

  return null;
}

/**
 * Write config to a directory
 */
export async function writeConfig(config: SDDConfig, dir: string = process.cwd()): Promise<void> {
  const configPath = getConfigPath(dir);
  await fs.writeFile(configPath, JSON.stringify(config, null, 2));
}

/**
 * Create a new config with defaults merged with provided values
 */
export function createConfig(overrides: Partial<SDDConfig> = {}): SDDConfig {
  return {
    ...DEFAULT_CONFIG,
    ...overrides,
    created: overrides.created || new Date().toISOString().split('T')[0],
    techStack: {
      ...DEFAULT_CONFIG.techStack,
      ...overrides.techStack,
    },
    features: {
      ...DEFAULT_CONFIG.features,
      ...overrides.features,
    },
  };
}

/**
 * Update an existing config
 */
export async function updateConfig(
  updates: Partial<SDDConfig>,
  dir: string = process.cwd()
): Promise<SDDConfig | null> {
  const existing = await readConfig(dir);

  if (!existing) {
    return null;
  }

  const updated: SDDConfig = {
    ...existing,
    ...updates,
    techStack: {
      ...existing.techStack,
      ...updates.techStack,
    },
    features: {
      ...existing.features,
      ...updates.features,
    },
  };

  await writeConfig(updated, dir);
  return updated;
}
