/**
 * Environment Variable Discovery
 * Aider-style .env cascade for API key fallback
 */

import { config as dotenvConfig } from 'dotenv';
import path from 'path';
import fs from 'fs-extra';

/**
 * Load environment variables from .env files in priority order:
 * 1. Process env (already set)
 * 2. .env in current working directory
 * 3. .env in git root directory
 * 4. ~/.autospec/.env in home directory
 */
export async function loadEnvCascade(): Promise<void> {
  const paths = [
    path.join(process.cwd(), '.env'),
    await findGitRootEnv(),
    path.join(process.env.HOME || '~', '.autospec', '.env'),
  ].filter(Boolean) as string[];

  // Load in reverse order so higher priority overwrites
  for (const envPath of paths.reverse()) {
    if (await fs.pathExists(envPath)) {
      dotenvConfig({ path: envPath, override: false });
    }
  }
}

async function findGitRootEnv(): Promise<string | null> {
  let dir = process.cwd();
  while (dir !== path.dirname(dir)) {
    if (await fs.pathExists(path.join(dir, '.git'))) {
      const envPath = path.join(dir, '.env');
      return envPath;
    }
    dir = path.dirname(dir);
  }
  return null;
}
