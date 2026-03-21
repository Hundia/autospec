export interface TemplateVars {
  [key: string]: string | number | boolean | undefined;
}

const TEMPLATES: Record<string, string> = {
  session_started: `🚀 *Session Started*
Name: {name}
Prompt: {prompt}
CWD: {cwd}`,

  session_completed: `✅ *Session Complete*
Name: {name}
Duration: {duration}
Tools: {toolCount} calls
Summary: {summary}`,

  session_error: `❌ *Session Error*
Name: {name}
Error: {error}

Reply RETRY to restart, LOGS to see output`,

  approval_request: `🔐 *Permission Request*
Session: {name}
Tool: {tool}
Command: {command}
Risk: {risk}

Reply: Y approve | N deny | A always`,

  approval_timeout: `⏰ *Approval Timed Out*
Session: {name}
Tool: {tool}
Action: {action}`,

  approval_resolved: `{icon} *{action}*: {tool}
Session: {name}
By: {source}`,

  daemon_started: `🟢 *Claude Pilot Daemon Started*
PID: {pid}
Active sessions: {sessionCount}`,

  daemon_stopped: `🔴 *Claude Pilot Daemon Stopped*`,

  test_message: `🧪 *Claude Pilot Test*
WhatsApp integration is working.
Timestamp: {timestamp}`,
};

export function renderTemplate(templateName: string, vars: TemplateVars): string {
  const template = TEMPLATES[templateName];
  if (!template) {
    return `Unknown template: ${templateName}`;
  }

  return template.replace(/\{(\w+)\}/g, (_match, key) => {
    const value = vars[key];
    return value !== undefined ? String(value) : `{${key}}`;
  });
}

export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60_000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}
