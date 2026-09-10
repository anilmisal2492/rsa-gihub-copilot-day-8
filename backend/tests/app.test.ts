import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { createSqliteDatabase } from '../src/repositories/sqlite.js';
import { MockLLMClient } from './fixtures/mock-llm-client.js';

describe('app composition', () => {
  it('registers the documented API surface', async () => {
    const app = createApp({ model: 'mock', openAiApiKey: undefined, port: 3000, corsOrigins: ['*'], dataDir: '', dbUrl: ':memory:', logLevel: 'INFO' }, { database: createSqliteDatabase(':memory:'), llmClient: new MockLLMClient() });
    const health = await request(app).get('/api/health');
    const start = await request(app).post('/api/conversations').send({});
    expect(health.status).toBe(200);
    expect(start.status).toBe(201);
  });
});
