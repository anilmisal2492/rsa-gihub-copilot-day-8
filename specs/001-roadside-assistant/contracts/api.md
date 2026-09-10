# Roadside Assistant API Contract

JSON API routes live under `/api`.

- `GET /api/health` returns `{ status: "ok", model, llm_configured }`.
- `POST /api/conversations` accepts optional vehicle/location context and returns an opaque conversation ID plus the initial safety message.
- `POST /api/conversations/:conversationId/messages` accepts `{ message }` and returns an assistant message with request ID and validated assessment.
- `POST /api/conversations/:conversationId/reset` returns `{ status: "reset" }`.

Assessment fields are `problem_category`, `urgency`, `summary`, `immediate_actions`, `avoid_actions`, `recommended_service`, `emergency_help`, and `follow_up_questions`. Errors use `{ error: { code, message, request_id } }` with documented stable codes. Validation errors never call the LLM.
