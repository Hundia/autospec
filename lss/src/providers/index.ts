/**
 * LightSpeedSpec Provider Layer
 * Thin re-export of AutoSpec's LLM provider infrastructure.
 * LSS and CLI are siblings in the monorepo — relative imports work directly.
 */

export { resolveProvider, getAllProviders } from '../../../cli/src/providers/resolver.js';
export type {
  LLMProvider,
  GenerateOptions,
  ProviderError,
  GenerateResult,
} from '../../../cli/src/providers/interface.js';
