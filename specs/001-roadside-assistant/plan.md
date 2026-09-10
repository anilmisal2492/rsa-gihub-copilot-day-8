# Implementation Plan: Roadside Assistant Chatbot

**Branch**: `001-roadside-assistant` | **Spec**: [spec.md](./spec.md)

## Summary

Deliver the Phase 0 Roadside Assistant flow with a React/Vite frontend and Node/Express API. Use Zod validation, SQLite repositories, deterministic safety rules, and an `LLMClient` provider boundary. No out-of-scope dispatch or long-term product features are included.

## Technical context

- Node.js and TypeScript backend; React, TypeScript, and Vite frontend.
- Express, Zod, better-sqlite3, provider SDK, Vitest, React Testing Library, ESLint, and Prettier.
- Tests mock the model and include API contracts, component coverage, safety scenarios, failure recovery, and privacy-safe logging.
- Run via `./run.sh` or Docker.

## Constitution check

All six principles pass: protocol boundaries are explicit, credentials and personal data remain server-side, quality gates are mandatory, dependencies match the PRD, scope follows `prd.md`, and deterministic safety precedes model troubleshooting.

## Structure

```text
backend/src/{config,errors,llm,middleware,prompts,repositories,routes,schemas,services,types}
backend/tests/{config,fixtures,llm,middleware,repositories,routes,services}
frontend/src/{components,hooks,pages,services,styles,types}
frontend/tests
specs/001-roadside-assistant
```

No complexity exceptions are required.
