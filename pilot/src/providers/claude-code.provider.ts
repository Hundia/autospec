import { execSync } from 'child_process';
import type { PilotProvider, PilotProviderOptions } from './provider.types.js';

export class ClaudeCodeProvider implements PilotProvider {
  readonly name = 'claude';
  readonly displayName = 'Claude Code';

  private readonly claudePath: string;

  constructor(claudePath = 'claude') {
    this.claudePath = claudePath;
  }

  async isAvailable(): Promise<boolean> {
    try {
      execSync(`which ${this.claudePath}`, { stdio: 'ignore' });
      execSync(`${this.claudePath} auth status`, { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  buildCommand(opts: PilotProviderOptions): string[] {
    const { prompt, sessionId, name, model, fallbackModel, autoApprove, skill, resume } = opts;

    const args: string[] = [this.claudePath];

    args.push('--session-id', sessionId);
    args.push('--name', name);

    if (autoApprove) {
      args.push('--dangerously-skip-permissions');
    }

    if (model) {
      args.push('--model', model);
    }

    if (fallbackModel) {
      args.push('--fallback-model', fallbackModel);
    }

    if (resume) {
      args.push('--resume', resume);
    } else if (skill) {
      args.push('-p', `/${skill} ${prompt}`);
    } else {
      args.push('-p', prompt);
    }

    return args;
  }

  installInstructions(): string {
    return 'Install: npm install -g @anthropic-ai/claude-code  |  Then run: claude auth login';
  }
}
