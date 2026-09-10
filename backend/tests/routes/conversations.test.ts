import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { createSqliteDatabase } from '../../src/repositories/sqlite.js';
import { MockLLMClient } from '../fixtures/mock-llm-client.js';

describe('conversation routes', () => {
  it('starts an incident with optional structured context and safety message', async () => {
    const response = await request(createApp({ model: 'mock', openAiApiKey: undefined, port: 3000, corsOrigins: ['*'], dataDir: '', dbUrl: ':memory:', logLevel: 'INFO' }, { database: createSqliteDatabase(':memory:'), llmClient: new MockLLMClient() })).post('/api/conversations').send({ vehicle: { make: 'Toyota', model: 'Corolla', year: 2020, fuel_type: 'petrol' }, location: { description: 'highway shoulder' } });
    expect(response.status).toBe(201);
    expect(response.body.conversation_id).toMatch(/^conv_/);
    expect(response.body.message.content).toContain('safe place');
  });
});
