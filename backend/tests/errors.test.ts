import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { createSqliteDatabase } from '../src/repositories/sqlite.js';
import { MockLLMClient } from './fixtures/mock-llm-client.js';

describe('error envelope', () => {
  it('returns a stable validation envelope with a request id', async () => {
    const response = await request(createApp({ model: 'mock', openAiApiKey: undefined, port: 3000, corsOrigins: ['*'], dataDir: '', dbUrl: ':memory:', logLevel: 'INFO' }, { database: createSqliteDatabase(':memory:'), llmClient: new MockLLMClient() })).post('/api/conversations/demo/messages').send({ message: '' });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.request_id).toMatch(/^req_/);
  });
});
