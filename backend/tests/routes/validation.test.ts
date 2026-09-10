import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { createSqliteDatabase } from '../../src/repositories/sqlite.js';
import { MockLLMClient } from '../fixtures/mock-llm-client.js';

describe('request validation', () => {
  it('rejects whitespace messages before invoking the model', async () => {
    const llm = new MockLLMClient();
    const app = createApp({ model: 'mock', openAiApiKey: undefined, port: 3000, corsOrigins: ['*'], dataDir: '', dbUrl: ':memory:', logLevel: 'INFO' }, { database: createSqliteDatabase(':memory:'), llmClient: llm });
    const start = await request(app).post('/api/conversations').send({});
    const response = await request(app).post(`/api/conversations/${start.body.conversation_id}/messages`).send({ message: '   ' });
    expect(response.status).toBe(400);
    expect(llm.calls).toHaveLength(0);
  });
});
