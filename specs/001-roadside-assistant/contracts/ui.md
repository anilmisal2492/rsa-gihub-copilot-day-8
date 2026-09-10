# Roadside Assistant UI Contract

The initial state identifies Roadside Assistant, shows a safety reminder, and offers My vehicle has broken down without requiring account creation.

The active state shows ordered messages, a persistent safety state, the structured assessment, urgency, immediate actions, avoid actions, emergency recommendation, recommended service, follow-up questions, Request Roadside Assistance, and Start New Incident. Guidance is symptom-based and never presented as a confirmed diagnosis.

LOW, MEDIUM, and HIGH are visibly distinct. Loading prevents duplicate submissions while retaining safety state. Provider, validation, and malformed-output failures show safe fallback copy and preserve entered text for retry. Request IDs remain available in metadata without prominent presentation.
