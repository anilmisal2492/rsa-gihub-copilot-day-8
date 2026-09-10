import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { createSqliteDatabase } from '../../src/repositories/sqlite.js';
import { MockLLMClient } from '../fixtures/mock-llm-client.js';
import { ApiError } from '../../src/errors.js';

function setup() {
  const llm = new MockLLMClient();
  const app = createApp({ model: 'mock', openAiApiKey: undefined, port: 3000, corsOrigins: ['*'], dataDir: '', dbUrl: ':memory:', logLevel: 'INFO' }, { database: createSqliteDatabase(':memory:'), llmClient: llm });
  return { app, llm };
}

describe('message route', () => {
  it('returns a validated assessment and request metadata', async () => {
    const { app } = setup();
    const start = await request(app).post('/api/conversations').send({});
    const response = await request(app).post(`/api/conversations/${start.body.conversation_id}/messages`).send({ message: 'The car will not start.' });
    expect(response.status).toBe(200);
    expect(response.body.message.assessment.urgency).toBe('HIGH');
    expect(response.body.message.request_id).toMatch(/^req_/);
  });

  it('handles deterministic fire safety without calling the model', async () => {
    const { app, llm } = setup();
    const start = await request(app).post('/api/conversations').send({});
    const response = await request(app).post(`/api/conversations/${start.body.conversation_id}/messages`).send({ message: 'There is smoke and fire near the engine.' });
    expect(response.body.message.assessment.emergency_help).toBe(true);
    expect(llm.calls).toHaveLength(0);
  });

  it('maps unavailable and malformed provider results to safe errors', async () => {
    const { app, llm } = setup();
    const start = await request(app).post('/api/conversations').send({});
    llm.nextError = new ApiError('LLM_UNAVAILABLE', 'Assessment service is unavailable. Please try again.');
    const unavailable = await request(app).post(`/api/conversations/${start.body.conversation_id}/messages`).send({ message: 'The battery is dead.' });
    expect(unavailable.status).toBe(503);
    llm.nextError = undefined;
    llm.nextResponse = '{ malformed';
    const malformed = await request(app).post(`/api/conversations/${start.body.conversation_id}/messages`).send({ message: 'The starter clicks.' });
    expect(malformed.status).toBe(503);
    expect(malformed.body.error.code).toBe('LLM_UNAVAILABLE');
  });
});
