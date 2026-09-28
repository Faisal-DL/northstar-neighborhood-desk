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

Follow [GUIDE.md](GUIDE.md): create your repo from this template, add your PostHog (EU cloud) project token, deploy to Vercel, swap tasks with the other group, and generate a replay-linked report with the included `posthog-task-report` skill.

## PostHog

PostHog is already wired in and stays off until you set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` (copy `.env.example` to `.env.local` locally, and add the same variable in Vercel). [`instrumentation-client.ts`](instrumentation-client.ts) starts PostHog with autocapture and session replay, and [`next.config.ts`](next.config.ts) routes its traffic through the app's `/ingest` path so ad blockers rarely block it. [`src/lib/analytics.ts`](src/lib/analytics.ts) sends each task's start and finish event with a timestamped `replay_url`. The six task events are:

| Flow | Start | Finish |
| --- | --- | --- |
| Report an issue | `report_started` | `report_completed` |
| Track a report | `tracking_started` | `tracking_completed` |
| Book a visit | `booking_started` | `booking_completed` |

The app sends no personal data by itself. Inputs are masked in replays by default. Use invented details, and review [PostHog's replay privacy controls](https://posthog.com/docs/session-replay/privacy) before recording real users.
