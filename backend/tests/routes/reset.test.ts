import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { createSqliteDatabase } from '../../src/repositories/sqlite.js';
import { MockLLMClient } from '../fixtures/mock-llm-client.js';

describe('reset route', () => {
  it('resets an active conversation and rejects it afterward', async () => {
    const app = createApp({ model: 'mock', openAiApiKey: undefined, port: 3000, corsOrigins: ['*'], dataDir: '', dbUrl: ':memory:', logLevel: 'INFO' }, { database: createSqliteDatabase(':memory:'), llmClient: new MockLLMClient() });
    const start = await request(app).post('/api/conversations').send({});
    const reset = await request(app).post(`/api/conversations/${start.body.conversation_id}/reset`).send({});
    expect(reset.body).toEqual({ status: 'reset' });
    const message = await request(app).post(`/api/conversations/${start.body.conversation_id}/messages`).send({ message: 'retry' });
    expect(message.status).toBe(404);
    expect(message.body.error.code).toBe('CONVERSATION_NOT_FOUND');
  });
});
