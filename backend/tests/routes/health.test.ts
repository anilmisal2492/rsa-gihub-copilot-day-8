import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { createSqliteDatabase } from '../../src/repositories/sqlite.js';
import { MockLLMClient } from '../fixtures/mock-llm-client.js';

describe('GET /api/health', () => {
  it('reports model configuration without disclosing credentials', async () => {
    const response = await request(createApp({ model: 'mock-model', openAiApiKey: 'secret', port: 3000, corsOrigins: ['*'], dataDir: '', dbUrl: ':memory:', logLevel: 'INFO' }, { database: createSqliteDatabase(':memory:'), llmClient: new MockLLMClient() })).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', model: 'mock-model', llm_configured: true });
    expect(JSON.stringify(response.body)).not.toContain('secret');
  });
});
