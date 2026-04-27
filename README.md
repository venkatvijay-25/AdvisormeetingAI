# Aequitas AI Desktop Validation Prototype

This React prototype implements the PRD validation scope for the Aequitas AI advisor co-pilot. It is intentionally static and scripted so advisor sessions can focus on workflow fit, trust, compliance posture, and willingness to pay before backend integrations are built.

## Implemented Scope

- Global dashboard with today's meetings, AI readiness badges, pending approvals, portfolio alerts, activity feed, and advisor productivity charts.
- Pre-meeting intelligence hub for the Sterling Family, including expandable AI brief sections, editable agenda items, allocation charts, source evidence, client snapshot, and simulated presentation generation.
- Post-meeting notes input with dummy audio selection, sample note population, character counter, compliance disclaimer, audit badge, progress animation, and navigation into extracted actions.
- Action center with CRM update, task creation, and email draft cards; inline editing; modal email review; per-action approval; approve all; and confirmation screen.
- AI-enhanced client profile with tabs, AI insights, life event timeline, proactive alerts, upcoming milestones, and chart-backed portfolio context.
- Added trust/compliance validation details that were implied but not fully specified: human approval policy, audit trail references, evidence/source chips, and immutable-log language.

## Run Locally

```bash
npm.cmd install
npm.cmd run dev
```

Then open the local Vite URL in a browser.

## Serve the Built Prototype

```bash
npm.cmd run build
node.exe launch-serve.js 8085
```

Then open http://127.0.0.1:8085.

## Cloudflare Deploy

For Cloudflare Pages, use:

- Build command: `npm run build`
- Build output directory: `dist`
- Deploy command: leave blank

For Cloudflare Workers static assets, use:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

The included `wrangler.jsonc` publishes `dist` as a single-page app.
