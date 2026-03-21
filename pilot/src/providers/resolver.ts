import { ClaudeCodeProvider } from './claude-code.provider.js';
import { GeminiCliProvider } from './gemini-cli.provider.js';
import { CopilotProvider } from './copilot.provider.js';
import type { PilotProvider } from './provider.types.js';
import type { PilotConfig } from '../utils/config.js';

export function getAllProviders(config?: PilotConfig): PilotProvider[] {
  return [
    new ClaudeCodeProvider(config?.provider?.claudePath),
    new GeminiCliProvider(config?.provider?.geminiPath),
    new CopilotProvider(),
  ];
}

/**
 * Resolve the provider to use.
 *
 * Priority order:
 *   1. Explicit `override` (by name, e.g. "claude", "gemini", "copilot")
 *   2. `config.provider.default` if non-empty
 *   3. Auto-detect: first available in priority order (Claude > Gemini > Copilot)
 *
 * Throws if the requested provider is not found or not available.
 */
export async function resolveProvider(
  override?: string,
  config?: PilotConfig,
): Promise<PilotProvider> {
  const providers = getAllProviders(config);

  const requestedName = override ?? config?.provider?.default ?? '';

  if (requestedName) {
    const found = providers.find(p => p.name === requestedName);
    if (!found) {
      throw new Error(
        `Unknown provider "${requestedName}". Available: ${providers.map(p => p.name).join(', ')}`,
      );
    }
    const available = await found.isAvailable();
    if (!available) {
      throw new Error(
        `Provider "${requestedName}" (${found.displayName}) is not available.\n${found.installInstructions()}`,
      );
    }
    return found;
  }

  // Auto-detect in priority order
  for (const provider of providers) {
    if (await provider.isAvailable()) {
      return provider;
    }
  }

  const instructions = providers.map(p => `  ${p.displayName}: ${p.installInstructions()}`).join('\n');
  throw new Error(`No LLM provider found. Install one of:\n${instructions}`);
}
