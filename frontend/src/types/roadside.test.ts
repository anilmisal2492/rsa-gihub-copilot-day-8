import { describe, expect, it } from 'vitest';
import type { RoadsideAssessment } from './roadside';

describe('roadside types', () => {
  it('models the documented assessment boundary', () => {
    const assessment: RoadsideAssessment = { problem_category: 'battery', urgency: 'LOW', summary: 'Symptoms only.', immediate_actions: [], avoid_actions: [], recommended_service: 'MECHANIC', emergency_help: false, follow_up_questions: [] };
    expect(assessment.urgency).toBe('LOW');
  });
});
