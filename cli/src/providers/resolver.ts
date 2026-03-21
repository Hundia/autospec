/**
 * Provider Resolver
 * Auto-detection priority chain: Claude Code CLI → Anthropic API.
 * (GeminiCliProvider will be added in Sprint 31.)
 */

import { LLMProvider } from './interface.js';
import { ClaudeCodeProvider } from './claude-code.provider.js';
import { AnthropicApiProvider } from './anthropic-api.provider.js';

const PROVIDERS: LLMProvider[] = [
  new ClaudeCodeProvider(),
  new AnthropicApiProvider(),
  // GeminiCliProvider will be added in Sprint 31
];

/**
 * Resolve which LLM provider to use.
 *
 * @param override - Optional provider name from --provider flag
 * @returns The first available provider in priority order
 * @throws Error with actionable install instructions if no provider found
 */
export async function resolveProvider(override?: string): Promise<LLMProvider> {
  if (override) {
    const provider = PROVIDERS.find(p => p.name === override);
    if (!provider) {
      throw new Error(
        `Unknown provider: ${override}. Available: ${PROVIDERS.map(p => p.name).join(', ')}`,
      );
    }
    if (!(await provider.isAvailable())) {
      throw new Error(`Provider ${override} is not available. Run: autospec doctor`);
    }
    return provider;
  }

  for (const provider of PROVIDERS) {
    if (await provider.isAvailable()) return provider;
  }

  throw new Error(
    'No LLM provider found.\n\n' +
      'Install one of:\n' +
      '  Claude Code:    npm i -g @anthropic-ai/claude-code && claude auth login\n' +
      '  Anthropic API:  export ANTHROPIC_API_KEY=sk-ant-...\n\n' +
      'Check status: autospec doctor\n',
  );
}

/**
 * Return all registered providers (used by `autospec doctor`).
 */
export function getAllProviders(): LLMProvider[] {
  return [...PROVIDERS];
}
