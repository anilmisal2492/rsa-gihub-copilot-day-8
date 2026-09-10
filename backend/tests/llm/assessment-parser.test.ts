import { describe, expect, it } from 'vitest';
import { parseAssessment } from '../../src/llm/assessment-parser.js';

const valid = JSON.stringify({ problem_category: 'battery', urgency: 'LOW', summary: 'Symptoms only.', immediate_actions: ['Wait safely.'], avoid_actions: ['Do not work in traffic.'], recommended_service: 'MECHANIC', emergency_help: false, follow_up_questions: [] });

describe('assessment parser', () => {
  it('parses valid model JSON', () => expect(parseAssessment(valid).urgency).toBe('LOW'));
  it('rejects malformed JSON', () => expect(() => parseAssessment('{')).toThrow('invalid response'));
  it('rejects invalid assessment fields', () => expect(() => parseAssessment(JSON.stringify({ ...JSON.parse(valid), urgency: 'CRITICAL' }))).toThrow('unusable response'));
});
