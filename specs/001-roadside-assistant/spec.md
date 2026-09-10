# Feature Specification: Roadside Assistant Chatbot

**Feature Branch**: `001-roadside-assistant`

## User Story 1 - Assess a roadside breakdown (P1)

A stranded driver can start without an account, describe a breakdown, optionally provide vehicle/location context, and receive symptom-based urgency, immediate actions, avoid actions, emergency guidance, recommended service, follow-up questions, and a visible assistance action. A follow-up uses prior context. Request Assistance explicitly remains a Phase 0 demo boundary. Start New Incident resets active UI.

## User Story 2 - Recover from service failures (P2)

Provider unavailable, not configured, rate limited, malformed, or invalid requests return clear safe errors, stable codes, request IDs, no fabricated assessment, and preserve entered draft text.

## User Story 3 - Use the chat in everyday conditions (P3)

The app has a clear empty state, loading state, concise copy, readable controls, visible safety state, duplicate-submit prevention, and reset behavior.

## User Story 4 - Operate and troubleshoot (P4)

Health status, request identifiers, structured non-sensitive logs, error envelopes, privacy assertions, API contracts, frontend contracts, and green CI are required.

## Functional requirements

FR-1 start without account; FR-2 natural-language problem; FR-3 optional vehicle fields; FR-4 optional location; FR-5 context through `LLMClient`; FR-6 structured assessment; FR-7 explicit safety warning; FR-8 LOW/MEDIUM/HIGH; FR-9 HIGH prioritizes safety; FR-10 follow-up context; FR-11 no confirmed diagnosis; FR-12 provider fallback; FR-13 boundary validation; FR-14 demo assistance action; FR-15 reset; FR-16 troubleshooting identifier.

## Edge cases

Empty or whitespace messages, overlong messages, invalid structured context, unknown/reset conversations, duplicate submits, provider failures, malformed JSON, session limits, hazards, connection failures, and sensitive values in requests are covered.

## Success criteria

The acceptance walkthrough passes; valid required scenarios return all structured fields; high-risk cases show safety first; provider and validation failures are safe and preserve drafts; all assistant responses expose troubleshooting metadata; logs exclude sensitive data; and a driver can complete the full flow without an account.
