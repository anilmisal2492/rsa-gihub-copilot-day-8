# Roadside Assistant Chatbot — PRD

## 1. One paragraph

Roadside Assistant (RSA) helps a stranded driver quickly understand what to do when their vehicle has a roadside problem. They describe the problem in a chat and optionally provide location, vehicle details, and symptoms; the app uses a safety-focused LLM to identify the likely issue, assess urgency, provide immediate safe steps, and recommend the appropriate roadside service; they get a concise action plan with emergency warnings and an option to request roadside assistance. It is done when a user can describe a breakdown and receive a clear, safety-prioritized response within a single chat flow.

## 2. User

A driver stranded with a vehicle problem who knows what they are experiencing but may not know the mechanical terminology, diagnosis, or safest next step.

## 3. Happy path

1. User opens the RSA chatbot and selects “My vehicle has broken down.”
2. App asks for the problem in natural language.
3. User optionally provides vehicle information and location.
4. App sends the conversation and structured context to the backend.
5. Backend asks the LLM to classify the situation by problem type, urgency, and recommended action.
6. App shows likely problem category, immediate safety instructions, things not to do, emergency guidance, recommended roadside service, and a Request Assistance action.
7. User can continue chatting with follow-up information.
8. App updates the recommendation while preserving conversation context.

## 4. Out of scope

User accounts, payments, dispatch integration, live tracking, insurance claims, telematics, automatic diagnosis, voice, image/video inspection, GPS background tracking, multilingual support, admin dashboard, long-term history, vendor marketplace, autonomous vehicle actions, and medical assistance beyond directing the user to emergency services.

## 5. Architecture

- Backend: Node.js, TypeScript, Express under `backend/src/`.
- Frontend: React, TypeScript, Vite.
- Storage: SQLite for Phase 0 demo data.
- LLM: Provider adapter behind `LLMClient`.
- Persistence: `ConversationRepository` and `AssessmentRepository`.
- Validation: Zod at the Node.js API boundary.
- Frontend state: React state and hooks.

React Web App -> Node.js/Express API -> Conversation Service and Roadside Assessment Service -> LLMClient, safety rules, repositories -> SQLite.

The UI always keeps the safety state visible rather than burying it inside conversational response text.

## 6. Functional requirements

- FR-1 Start a conversation without an account.
- FR-2 Describe a vehicle problem in natural language.
- FR-3 Optionally provide vehicle make, model, year, and fuel type.
- FR-4 Optionally provide location.
- FR-5 Send relevant conversation context through `LLMClient`.
- FR-6 Return a structured assessment with category, urgency, actions, avoid actions, service, and emergency recommendation.
- FR-7 Display an explicit safety warning for dangerous situations.
- FR-8 Distinguish LOW, MEDIUM, and HIGH urgency.
- FR-9 For HIGH urgency, prominently prioritize personal safety and appropriate help.
- FR-10 Support follow-up context.
- FR-11 Never present a confirmed mechanical diagnosis.
- FR-12 Display a clear fallback when the LLM is unavailable or misconfigured.
- FR-13 Validate request size, messages, and structured fields before LLM calls.
- FR-14 Show Request Roadside Assistance as a Phase 0 demo action only.
- FR-15 Provide Start New Incident to clear active UI state.
- FR-16 Make a troubleshooting identifier available without prominent display.

## 7. API

- `GET /api/health` reports status, model, and provider configuration.
- `POST /api/conversations` starts an incident with optional context.
- `POST /api/conversations/:conversationId/messages` validates a symptom and returns an assessment.
- `POST /api/conversations/:conversationId/reset` clears the active incident.

Known errors use an envelope with `VALIDATION_ERROR`, `RATE_LIMITED`, `LLM_NOT_CONFIGURED`, `LLM_UNAVAILABLE`, `CONVERSATION_NOT_FOUND`, or `INTERNAL_ERROR`, plus a request ID.

## 8. Data and privacy

Conversation IDs, timestamps, optional context, structured assessments, and short-lived messages may be stored locally. Raw user text, exact location, names, phone numbers, emails, and unnecessary personal information are never logged. API credentials remain server-side.

## 9. Model

The provider and model come from environment configuration. Output is JSON validated with Zod. The model uses low temperature and approximately 800-1200 max tokens, with at most 30 requests per session. The assistant is an advisor, not an autonomous mechanic, and safety guidance takes precedence over troubleshooting.

## 10. Quality gates

Backend and frontend use TypeScript, Vitest, ESLint, and Prettier. CI runs lint, typecheck, tests, API contracts, frontend component tests, mocked backend tests, and build.

## 11. Run modes

```sh
./run.sh
# or
docker compose up
```

## 12. Acceptance walkthrough

Start the app, open the UI, confirm the safety reminder, begin an incident, provide Toyota Corolla 2020 context and a no-start symptom, verify HIGH urgency and safety-first structured guidance, confirm symptom-based disclaimer, send a follow-up, select Request Roadside Assistance and verify the demo boundary, then select Start New Incident and confirm reset.

## 13. Later

Real dispatch, GPS, tow discovery, ETAs, emergency-service integration, calls, insurance, accounts, history, notifications, voice, multilingual support, image/video inspection, VIN lookup, OBD telemetry, RAG, marketplace, pricing, payments, ratings, fleet mode, admin console, analytics, human handoff, and an independent safety-rule engine remain future work.

The key Phase 0 principle is “LLM for conversation, deterministic rules for safety.”
