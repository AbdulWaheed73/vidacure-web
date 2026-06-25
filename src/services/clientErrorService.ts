import { config } from '../constants';
import type { ClientErrorPayload } from '@/types/admin-types';

// Short-window dedupe so a repeating error can't flood the ingest endpoint.
const recent = new Map<string, number>();
const DEDUPE_MS = 10_000;

/**
 * Best-effort client crash reporter. Never throws, never blocks, and uses a bare
 * fetch (not the shared axios instance) so the auth interceptor's redirect/toast
 * side effects can't fire from here.
 */
export function reportClientError(payload: ClientErrorPayload): void {
  try {
    const key = `${payload.category}|${payload.message}`;
    const now = Date.now();
    const last = recent.get(key);
    if (last && now - last < DEDUPE_MS) return;
    recent.set(key, now);

    void fetch(`${config.getServerUrl()}/api/client-errors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-client': 'web' },
      credentials: 'include',
      keepalive: true,
      body: JSON.stringify(payload),
    }).catch(() => {
      /* swallow — reporting failures must be silent */
    });
  } catch {
    /* never throw from the reporter */
  }
}
