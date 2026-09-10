import { describe, expect, it } from 'vitest';
import { MockLLMClient } from '../fixtures/mock-llm-client.js';

describe('LLMClient protocol fixture', () => {
  it('records a typed generation request and returns model JSON', async () => {
    const client = new MockLLMClient();
    const result = await client.generateAssessment({ message: 'help', conversation: { conversation_id: 'conv', created_at: '', updated_at: '', status: 'active', messages: [] } });
    expect(client.calls).toHaveLength(1);
    expect(result.model).toBe('mock-model');
    expect(result.rawText).toContain('problem_category');
  });
});
