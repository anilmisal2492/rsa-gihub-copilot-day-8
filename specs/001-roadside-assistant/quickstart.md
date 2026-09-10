# Roadside Assistant Quickstart

## Prerequisites

Node.js and npm are required. Provider credentials are optional for local startup and must remain server-side in `.env` for live assessments.

## Start

```sh
./run.sh
```

or:

```sh
docker compose up
```

Open the frontend URL printed by the run command.

## Acceptance flow

1. Confirm the landing screen shows Roadside Assistant and a safety reminder.
2. Select My vehicle has broken down.
3. Enter optional Toyota Corolla, year 2020, fuel type petrol, and location context.
4. Submit `The car stopped while I was driving and won't start.`
5. Confirm HIGH urgency, immediate safety instructions, actions to avoid, recommended service, and emergency guidance where applicable.
6. Confirm the response is based on reported symptoms and is not a confirmed diagnosis.
7. Submit `The dashboard lights still come on, but the engine doesn't crank.` and confirm prior context is used.
8. Select Request Roadside Assistance and confirm dispatch integration is not enabled.
9. Select Start New Incident and confirm the active conversation clears.

## Quality gates

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

Automated tests cover safety hazards, malformed model output, provider failure, invalid requests, preserved drafts, API contracts, and privacy-safe logs.
