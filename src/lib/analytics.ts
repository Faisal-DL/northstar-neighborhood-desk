/**
 * Student integration point. The app calls this for journey boundaries.
 * After installing PostHog, forward the event to posthog.capture(name, properties).
 * Keep this file safe to call in the browser before PostHog is ready.
 */
export function journeyEvent(name: string, properties: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("northstar:journey", { detail: { name, properties } }));
}
