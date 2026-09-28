# Northstar Neighborhood Service Desk

A small Next.js demo for the Observability & Monitoring collab. It runs without accounts, a database, API keys, email, OAuth, or a hosted backend. Reports and appointments are stored in the visitor's browser so anyone can complete a task immediately.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use `npm run build` to check the production build.

## Three ready-to-use tasks

| Task for the other group | Starting point | Completed when |
| --- | --- | --- |
| Report a broken streetlight | **Report an issue** | A new `NS-…` reference appears |
| Check an existing streetlight report | **Track a report**; reference `NS-1042` is already filled in | The status and timeline appear |
| Book a visit about housing advice | **Book a visit** | An `AP-…` confirmation appears |

The seeded report `NS-1042` is always available. The **Reset demo** action clears new reports and bookings on that browser only. None of the flows requires a real name, email address, or payment.

The top-right **EN / DE** toggle switches the complete interface between English and German. The journey event names and saved demo data remain stable when the language changes.

## Exercise

Follow [GUIDE.md](GUIDE.md): create your repo from this template, add PostHog (EU cloud), deploy to Vercel, swap tasks with the other group, and generate a replay-linked report with the included `posthog-task-report` skill.

## PostHog integration point

The base app has no PostHog dependency or credentials and runs before instrumentation. [`src/lib/analytics.ts`](src/lib/analytics.ts) is a browser-safe hook already called at the start and completion of each task. The guide shows how to connect it to `posthog.capture` with a timestamped `replay_url` from [`posthog.get_session_replay_url()`](https://posthog.com/docs/references/posthog-js). The six journey event names are:

| Flow | Start | Finish |
| --- | --- | --- |
| Report an issue | `report_started` | `report_completed` |
| Track a report | `tracking_started` | `tracking_completed` |
| Book a visit | `booking_started` | `booking_completed` |

The app sends no personal data by itself. Use invented details, and review [PostHog's replay privacy controls](https://posthog.com/docs/session-replay/privacy) before recording real users.
