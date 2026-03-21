import { execSync } from 'child_process';
import type { PilotProvider, PilotProviderOptions } from './provider.types.js';

export class CopilotProvider implements PilotProvider {
  readonly name = 'copilot';
  readonly displayName = 'GitHub Copilot (experimental)';

  async isAvailable(): Promise<boolean> {
    try {
      execSync('which gh', { stdio: 'ignore' });
      execSync('gh copilot --version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  buildCommand(opts: PilotProviderOptions): string[] {
    const { prompt, skill } = opts;

    const effectivePrompt = skill ? `/${skill} ${prompt}` : prompt;

    return ['gh', 'copilot', 'suggest', '-t', 'shell', effectivePrompt];
  }

  installInstructions(): string {
    return 'Install: gh extension install github/gh-copilot';
  }
}
