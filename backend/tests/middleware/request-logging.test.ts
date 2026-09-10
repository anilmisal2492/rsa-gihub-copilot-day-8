import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { createSqliteDatabase } from '../../src/repositories/sqlite.js';
import { MockLLMClient } from '../fixtures/mock-llm-client.js';

describe('request logging', () => {
  it('logs only request metadata and never request bodies', async () => {
    const events: Array<Record<string, unknown>> = [];
    const app = createApp({ model: 'mock', openAiApiKey: undefined, port: 3000, corsOrigins: ['*'], dataDir: '', dbUrl: ':memory:', logLevel: 'INFO' }, { database: createSqliteDatabase(':memory:'), llmClient: new MockLLMClient(), logger: (event) => events.push(event) });
    await request(app).post('/api/conversations').send({ location: { description: 'exact location 123 Main Street' } });
    expect(events).toHaveLength(1);
    expect(JSON.stringify(events)).not.toContain('123 Main Street');
    expect(events[0]).toHaveProperty('request_id');
  });
});
