import { execSync } from 'child_process';
import type { PilotProvider, PilotProviderOptions } from './provider.types.js';

export class GeminiCliProvider implements PilotProvider {
  readonly name = 'gemini';
  readonly displayName = 'Gemini CLI';

  private readonly geminiPath: string;

  constructor(geminiPath = 'gemini') {
    this.geminiPath = geminiPath;
  }

  async isAvailable(): Promise<boolean> {
    try {
      execSync(`which ${this.geminiPath}`, { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  buildCommand(opts: PilotProviderOptions): string[] {
    const { prompt, skill } = opts;

    // Gemini CLI is simpler: no --session-id, --resume, --dangerously-skip-permissions
    // Skills are embedded as prefix text in the prompt
    const effectivePrompt = skill ? `/${skill} ${prompt}` : prompt;

    return [this.geminiPath, effectivePrompt];
  }

  installInstructions(): string {
    return 'Install: npm install -g @google/gemini-cli';
  }
}
