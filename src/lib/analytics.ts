/**
 * Student integration point. The app calls this for journey boundaries.
 * After installing PostHog, forward the event to posthog.capture(name, properties).
 * Include replay_url: posthog.get_session_replay_url({ withTimestamp: true, timestampLookBack: 5 })
 * in the captured properties,
 * so the read-only task report can link directly to this session's replay.
 * Keep this file safe to call in the browser before PostHog is ready.
 * PostHog env vars belong in .env.local (see .env.example), never in .env.
 */
export function journeyEvent(name: string, properties: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("northstar:journey", { detail: { name, properties } }));
}
