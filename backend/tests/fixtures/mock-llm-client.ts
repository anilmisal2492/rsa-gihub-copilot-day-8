import type { AssessmentGenerationInput, LLMClient, LLMGenerationResult } from '../../src/llm/LLMClient.js';

export const validAssessmentJson = JSON.stringify({
  problem_category: 'engine_start_failure',
  urgency: 'HIGH',
  summary: 'The symptoms may indicate a starting-system problem; this is not a confirmed diagnosis.',
  immediate_actions: ['Turn on hazard lights if safe.', 'Move away from traffic if possible.'],
  avoid_actions: ['Do not stand in a live traffic lane.'],
  recommended_service: 'ROADSIDE_ASSISTANCE',
  emergency_help: true,
  follow_up_questions: ['Do the dashboard lights still come on?'],
});

export class MockLLMClient implements LLMClient {
  readonly configured = true;
  readonly model = 'mock-model';
  calls: AssessmentGenerationInput[] = [];
  nextResponse = validAssessmentJson;
  nextError?: Error;

  async generateAssessment(input: AssessmentGenerationInput): Promise<LLMGenerationResult> {
    this.calls.push(input);
    if (this.nextError) throw this.nextError;
    return { rawText: this.nextResponse, model: this.model };
  }
}
