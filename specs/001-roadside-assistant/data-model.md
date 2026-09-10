# Roadside Assistant Data Model

## Conversation

One active roadside incident with an opaque `conversation_id`, timestamps, optional vehicle and location context, status (`active` or `reset`), and ordered messages.

## Vehicle Context

Optional `make`, `model`, `year`, and `fuel_type` fields, validated before any model call.

## Location Context

Optional `description`, collected only when needed and never written to logs.

## Message

A user or assistant contribution with role, content, optional structured assessment, optional request ID, and timestamp.

## Roadside Assessment

Guidance based on reported symptoms, never a confirmed diagnosis. It contains `problem_category`, `urgency` (`LOW`, `MEDIUM`, `HIGH`), `summary`, `immediate_actions`, `avoid_actions`, `recommended_service`, `emergency_help`, and `follow_up_questions`. Recommended service is one of `NONE`, `ROADSIDE_ASSISTANCE`, `TOW_TRUCK`, `MECHANIC`, or `EMERGENCY_SERVICES`.

## Error Response

All API errors use `{ error: { code, message, request_id } }` with documented stable error codes.

## State transitions

No active incident -> start -> active incident -> validate/send -> deterministic safety rules and model -> assistant response. Provider failure yields a safe error while preserving draft text. Reset returns to no active incident.
