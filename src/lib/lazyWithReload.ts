import { lazy } from "react";

/**
 * Drop-in replacement for React.lazy that recovers from "stale deploy" chunk
 * errors. When a new build is deployed, the previously-hashed JS/CSS chunks are
 * removed from the server; a browser still running the old page then 404s when
 * it lazy-loads a route ("Failed to fetch dynamically imported module").
 *
 * This wrapper reloads the page once to pick up the fresh asset manifest.
 * A sessionStorage guard prevents reload loops — if the import still fails after
 * one reload (i.e. a genuine error, not a stale chunk), the error is rethrown so
 * the ErrorBoundary can show it.
 */
const RELOAD_KEY = "vidacure:chunk-reloaded";

type LazyFactory = Parameters<typeof lazy>[0];

export function lazyWithReload(factory: LazyFactory): ReturnType<typeof lazy> {
  return lazy(async () => {
    try {
      const module = await factory();
      // Loaded fine — clear the flag so a future stale deploy can reload again.
      window.sessionStorage.removeItem(RELOAD_KEY);
      return module;
    } catch (error) {
      const alreadyReloaded = window.sessionStorage.getItem(RELOAD_KEY) === "1";
      if (!alreadyReloaded) {
        window.sessionStorage.setItem(RELOAD_KEY, "1");
        window.location.reload();
        // Reload is in flight — never resolve so React doesn't flash the error.
        return new Promise<never>(() => {});
      }
      // Already reloaded once and still failing — surface the real error.
      throw error;
    }
  });
}
