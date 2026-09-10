# Roadside Assistant

Roadside Assistant is a Phase 0 unauthenticated chatbot demo for a driver dealing with a vehicle problem. It asks for a safety check, accepts symptom-based context, returns a structured assessment, and keeps deterministic safety guidance ahead of mechanical troubleshooting.

This release does not include accounts, dispatch integration, payments, live tracking, telematics, voice, image inspection, background GPS, multilingual support, or long-term conversation history. `Request Roadside Assistance` is a visible demo action only; it never contacts a provider.

## Run

Prerequisites: Node.js 22+ and npm.

```sh
cp .env.example .env
npm install
./run.sh
```

Open `http://localhost:5173`. The backend listens on `http://localhost:3000`.

Docker is also supported:

```sh
cp .env.example .env
docker compose up
```

## Configuration

| Variable | Purpose | Default |
|---|---|---|
| `MODEL` | Server-side model name | `gpt-4o-mini` |
| `OPENAI_API_KEY` | Server-only provider credential | empty |
| `PORT` | Backend port | `3000` |
| `CORS_ORIGINS` | Comma-separated browser origins | `http://localhost:5173` |
| `DATA_DIR` | Data directory | `./data` |
| `DB_URL` | SQLite file path | `./data/rsa.db` |
| `LOG_LEVEL` | Structured log level | `INFO` |

The app starts without a provider key so the health endpoint can report configuration state. Assessment requests return a safe `LLM_NOT_CONFIGURED` error until a key is configured. Credentials never enter frontend code or request logs.

## API

- `GET /api/health` reports service status, model name, and provider configuration state.
- `POST /api/conversations` starts an incident with optional vehicle and location context.
- `POST /api/conversations/:conversationId/messages` validates a symptom message and returns an assessment.
- `POST /api/conversations/:conversationId/reset` clears the active incident.

Known errors use the documented envelope with `VALIDATION_ERROR`, `RATE_LIMITED`, `LLM_NOT_CONFIGURED`, `LLM_UNAVAILABLE`, `CONVERSATION_NOT_FOUND`, or `INTERNAL_ERROR` plus a request ID. Full contracts are in [specs/001-roadside-assistant/contracts/api.md](specs/001-roadside-assistant/contracts/api.md).

## Architecture

- `backend/`: Node.js, TypeScript, Express, Zod, SQLite, and the provider-backed `LLMClient` boundary.
- `frontend/`: React, TypeScript, Vite, local conversation state, structured assessment UI, and responsive styling.
- `data/`: local SQLite storage for the short-lived Phase 0 repositories.
- `evidence/`: acceptance and implementation evidence.

Deterministic rules handle smoke/fire, collision, dangerous traffic position, suspected fuel leaks, and severe overheating before model troubleshooting. Assessments are symptom-based and explicitly avoid confirmed diagnosis language.

## Quality gates

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

The test suite uses a mocked `LLMClient`; it does not depend on a live provider. See [specs/001-roadside-assistant/quickstart.md](specs/001-roadside-assistant/quickstart.md) for the acceptance walkthrough.
