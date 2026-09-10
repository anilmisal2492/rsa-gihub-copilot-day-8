import { describe, expect, it } from 'vitest';
import { RoadsideAssessmentService } from '../../src/services/roadside-assessment-service.js';
import { MockLLMClient } from '../fixtures/mock-llm-client.js';

describe('roadside assessment safety rules', () => {
  it.each([
    ['smoke and fire', 'possible_fire_or_smoke'],
    ['a collision happened', 'collision'],
    ['stuck in a live traffic lane', 'unsafe_traffic_position'],
    ['there is a fuel leak', 'possible_fuel_leak'],
    ['the engine is overheating', 'severe_overheating'],
  ])('elevates %s before model troubleshooting', async (message, category) => {
    const llm = new MockLLMClient();
    const result = await new RoadsideAssessmentService(llm).assess(message, { conversation_id: 'conv', created_at: '', updated_at: '', status: 'active', messages: [] });
    expect(result.assessment.problem_category).toBe(category);
    expect(llm.calls).toHaveLength(0);
  });
});
