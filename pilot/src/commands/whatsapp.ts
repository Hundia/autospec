import chalk from 'chalk';
import { loadConfig, setConfigValue } from '../utils/config.js';

export async function runWhatsApp(action: string): Promise<void> {
  const config = await loadConfig();

  switch (action) {
    case 'status':
      console.log(chalk.bold('\n  WhatsApp Integration Status\n'));
      console.log(`  Enabled:    ${config.whatsapp.enabled ? chalk.green('yes') : chalk.dim('no')}`);
      console.log(`  Mock mode:  ${config.whatsapp.mock ? chalk.yellow('yes') : chalk.dim('no')}`);
      console.log(`  Self-chat:  ${config.whatsapp.selfChatOnly ? chalk.green('yes') : chalk.dim('no')}`);
      console.log(`  Notify:     start=${yn(config.whatsapp.notifyOnStart)} complete=${yn(config.whatsapp.notifyOnComplete)} error=${yn(config.whatsapp.notifyOnError)}`);
      console.log(`  Approvals:  ${config.whatsapp.approvalViaWhatsApp ? chalk.green('via WhatsApp') : chalk.dim('disabled')}`);
      console.log();
      if (!config.whatsapp.enabled) {
        console.log(chalk.dim('  Enable: pilot config set whatsapp.enabled true'));
        console.log(chalk.dim('  Mock:   pilot config set whatsapp.mock true'));
        console.log(chalk.dim('  Then:   pilot daemon start'));
      }
      console.log();
      break;

    case 'enable':
      await setConfigValue('whatsapp.enabled', 'true');
      console.log(chalk.green('  WhatsApp enabled. Start daemon to activate: pilot daemon start'));
      break;

    case 'mock':
      await setConfigValue('whatsapp.enabled', 'true');
      await setConfigValue('whatsapp.mock', 'true');
      console.log(chalk.green('  WhatsApp mock mode enabled. Messages logged instead of sent.'));
      break;

    case 'qr':
      if (!config.whatsapp.enabled) {
        console.log(chalk.yellow('  WhatsApp not enabled. Run: pilot whatsapp enable'));
        break;
      }
      console.log(chalk.dim('  QR code will appear when daemon starts with WhatsApp enabled.'));
      console.log(chalk.dim('  Run: pilot daemon start'));
      break;

    case 'test':
      if (!config.whatsapp.enabled) {
        console.log(chalk.yellow('  WhatsApp not enabled. Run: pilot whatsapp enable'));
        break;
      }
      console.log(chalk.dim('  Test message will be sent via daemon.'));
      console.log(chalk.dim('  Ensure daemon is running: pilot daemon start'));
      break;

    default:
      console.log(chalk.red(`  Unknown action: ${action}`));
      console.log(chalk.dim('  Usage: pilot whatsapp status|enable|mock|qr|test'));
  }
}

function yn(val: boolean): string {
  return val ? chalk.green('yes') : chalk.dim('no');
}
