/**
 * Single Spec Generator
 * Calls the LLM provider with a compiled Handlebars prompt and collects the stream.
 * Retry logic (rate_limit / network / timeout) lives in the orchestrator (generate-specs.ts).
 */

import { LLMProvider, GenerateOptions } from '../providers/interface.js';

export interface SingleSpecResult {
  content: string;
  durationMs: number;
}

/**
 * Generate one spec file by streaming from the LLM provider.
 *
 * @param prompt - The compiled user-facing prompt (Handlebars already rendered)
 * @param systemPrompt - The compiled system prompt for this role
 * @param provider - Resolved LLMProvider instance
 * @param options - GenerateOptions (model, maxTokens, etc.)
 */
export async function generateSingleSpec(
  prompt: string,
  systemPrompt: string,
  provider: LLMProvider,
  options: GenerateOptions,
): Promise<SingleSpecResult> {
  const start = Date.now();
  let content = '';

  for await (const chunk of provider.generate(prompt, { ...options, systemPrompt })) {
    content += chunk;
  }

  return {
    content,
    durationMs: Date.now() - start,
  };
}
