import { describe, expect, it } from 'vitest';
import { ProviderLLMClient } from '../../src/llm/provider-client.js';

describe('provider client', () => {
  it('does not require a key at startup but reports a safe request error', async () => {
    const client = new ProviderLLMClient('mock-model');
    expect(client.configured).toBe(false);
    await expect(client.generateAssessment({ message: 'help', conversation: { conversation_id: 'conv', created_at: '', updated_at: '', status: 'active', messages: [] } })).rejects.toMatchObject({ code: 'LLM_NOT_CONFIGURED' });
  });
});
