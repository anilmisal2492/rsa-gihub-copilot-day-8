import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { createSqliteDatabase } from '../src/repositories/sqlite.js';
import { MockLLMClient } from './fixtures/mock-llm-client.js';

describe('API contract regression', () => {
  it('returns documented identifiers, urgency, service, and reset status', async () => {
    const app = createApp({ model: 'mock', openAiApiKey: undefined, port: 3000, corsOrigins: ['*'], dataDir: '', dbUrl: ':memory:', logLevel: 'INFO' }, { database: createSqliteDatabase(':memory:'), llmClient: new MockLLMClient() });
    const start = await request(app).post('/api/conversations').send({});
    const response = await request(app).post(`/api/conversations/${start.body.conversation_id}/messages`).send({ message: 'The vehicle will not start.' });
    const reset = await request(app).post(`/api/conversations/${start.body.conversation_id}/reset`).send({});
    expect(start.body.conversation_id).toMatch(/^conv_/);
    expect(response.body.message.assessment).toMatchObject({ urgency: 'HIGH', recommended_service: 'ROADSIDE_ASSISTANCE' });
    expect(response.body.message.request_id).toMatch(/^req_/);
    expect(reset.body).toEqual({ status: 'reset' });
  });
});
