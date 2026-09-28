# Northstar Neighborhood Service Desk

A small Next.js demo for the Observability & Monitoring collab. It runs without accounts, a database, API keys, email, OAuth, or a hosted backend. Reports and appointments are stored in the visitor's browser so each partner can complete a task immediately.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use `npm run build` to check the production build.

## Three ready-to-use tasks

| Task for a partner | Starting point | Completed when |
| --- | --- | --- |
| Report a broken streetlight | **Report an issue** | A new `NS-…` reference appears |
| Check an existing streetlight report | **Track a report**; reference `NS-1042` is already filled in | The status and timeline appear |
| Book a visit about housing advice | **Book a visit** | An `AP-…` confirmation appears |

The seeded report `NS-1042` is always available. The **Reset demo** action clears new reports and bookings on that browser only. None of the flows requires a real name, email address, or payment.

The top-right **EN / DE** toggle switches the complete interface between English and German. The journey event names and saved demo data remain stable when the language changes.

## Deploy on Vercel

Fork and clone the repository. After adding PostHog, commit and push your changes, then import your fork into your own Vercel account. Use the detected **Next.js** preset and default build settings. Add the wizard's `NEXT_PUBLIC_` PostHog values in Vercel before deploying. The base app needs no environment variables; browser storage handles its demo state.

## PostHog integration point

The app intentionally has no PostHog project attached. [`src/lib/analytics.ts`](src/lib/analytics.ts) is a tiny browser-safe hook already called at the start and completion of each task. After running [PostHog's Install with AI wizard](https://posthog.com/docs/session-replay/installation) in the fork, ask your coding agent to connect `journeyEvent` to `posthog.capture(name, properties)`, include a `replay_url` property from [`posthog.get_session_replay_url()`](https://posthog.com/docs/references/posthog-js) on each journey event, and verify autocapture and session replay. The reporting skill uses the URL to link directly to the matching private replay. The six journey event names are:

Suggested agent prompt: “Connect `src/lib/analytics.ts` to the PostHog client installed by the wizard. Preserve all existing journey event names and properties, add `replay_url` from `posthog.get_session_replay_url()` to each event, and keep user-entered text out of event properties. Check that a start and finish event, autocaptured clicks, and a replay appear for one local test flow. Run the build and tell me which `NEXT_PUBLIC_` values to add in Vercel.”

| Flow | Start | Finish |
| --- | --- | --- |
| Report an issue | `report_started` | `report_completed` |
| Track a report | `tracking_started` | `tracking_completed` |
| Book a visit | `booking_started` | `booking_completed` |

Use a test browser for partner sessions. The app sends no personal data by itself, but review [PostHog's replay privacy controls](https://posthog.com/docs/session-replay/privacy) before recording any real users.

The base app has no PostHog dependency or credentials, and it can be run and evaluated before instrumentation.
