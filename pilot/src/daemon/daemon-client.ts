import { sendRequest, isDaemonRunning } from '../ipc/socket-transport.js';
import type { DaemonRequest, DaemonResponse } from './daemon.types.js';

export async function daemonRequest(request: DaemonRequest): Promise<DaemonResponse> {
  return sendRequest(request);
}

export { isDaemonRunning };
