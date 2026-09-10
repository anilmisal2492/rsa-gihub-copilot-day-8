# Research Notes: Roadside Assistant

No open questions: all product and architecture decisions are defined in `prd.md`. The implementation uses the mandated Node/TypeScript/Express backend, React/Vite frontend, Zod validation, SQLite repositories, and an `LLMClient` provider boundary. Deterministic safety rules run before model troubleshooting for obvious hazards. Model-dependent tests use a reusable mock client.
