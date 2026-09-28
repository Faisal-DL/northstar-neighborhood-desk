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

Fork the repository, import your fork into your own Vercel account, and deploy with the detected **Next.js** preset and default build settings. No environment variables or third-party integrations are needed for the base app. The app is statically prerendered; browser storage handles its demo state.

## PostHog integration point

The app intentionally has no PostHog project attached. [`src/lib/analytics.ts`](src/lib/analytics.ts) is a tiny browser-safe hook already called at the start and completion of each task. After running [PostHog's Install with AI wizard](https://posthog.com/docs/session-replay/installation) in the fork, connect `journeyEvent` to `posthog.capture(name, properties)` and verify that autocapture and session replay are enabled. The six journey event names are:

| Flow | Start | Finish |
| --- | --- | --- |
| Report an issue | `report_started` | `report_completed` |
| Track a report | `tracking_started` | `tracking_completed` |
| Book a visit | `booking_started` | `booking_completed` |

Use a test browser for partner sessions. The app sends no personal data by itself, but review [PostHog's replay privacy controls](https://posthog.com/docs/session-replay/privacy) before recording any real users.

The base app has no PostHog dependency or credentials, and it can be run and evaluated before instrumentation.
