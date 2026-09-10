<!--
Sync Impact Report
- Version change: template -> 1.0.0
- Modified principles: replaced the five template placeholders with six RSA principles
- Added sections: none
- Removed sections: unused template sections for additional constraints and development workflow
- Deferred items: none
-->

# Roadside Assistant Chatbot Constitution

## Core Principles

### I. Boundaries
Roadside Assistant uses a React + TypeScript + Vite web app over HTTPS/JSON, a Node.js + TypeScript + Express API, Conversation and Roadside Assessment Services, deterministic safety and validation rules, and SQLite storage; the model, optional retrieval, and storage sit behind small protocols named `LLMClient`, `Retriever`, `ConversationRepository`, and `AssessmentRepository`, with one implementation each, and all code is written against those protocols.

### II. Secrets and Personal Data
Keys and LLM credentials MUST be read from `.env` by a settings module and MUST never reach the client or logs; raw user free text, exact location, names, phone numbers, email addresses, and other unnecessary personal information MUST never be logged.

### III. Quality Gates Are the Definition of Done
Every task MUST add or update tests, every model-dependent test MUST mock the LLM, `ruff` and the applicable ESLint and TypeScript checks MUST be clean, and CI MUST run the complete quality suite and remain green; a failing gate blocks the next task.

### IV. Deliberate Dependencies
The stack is Node.js, TypeScript, Express, Zod, SQLite or `better-sqlite3`, an LLM provider SDK, React, Vite, Vitest, React Testing Library, ESLint, and Prettier as specified in `prd.md` section 10; any dependency addition MUST be recorded in `plan.md` with its reason.

### V. Scope Is `prd.md`
`prd.md` sections 6 and 12 define the release, section 4 is out of scope, and section 13 is later; the project MUST NOT add features that are not in `prd.md`.

### VI. Deterministic Safety First
Deterministic safety rules MUST take precedence over model-driven troubleshooting for obvious hazards such as fire, collision, dangerous traffic position, suspected fuel leaks, and severe overheating, and every response MUST frame model output as guidance based on reported symptoms rather than a confirmed diagnosis.

## Governance

`prd.md` wins over this constitution when they conflict. This constitution and `prd.md` may be changed only by editing the respective file, and constitution changes MUST update the version and amendment date and verify compliance with all six principles.

**Version**: 1.0.0 | **Ratified**: 2026-09-10 | **Last Amended**: 2026-09-10
