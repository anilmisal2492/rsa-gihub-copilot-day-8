import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { createSqliteDatabase } from '../src/repositories/sqlite.js';
import { MockLLMClient } from './fixtures/mock-llm-client.js';

describe('operability and privacy', () => {
  it('keeps sensitive values out of structured request logs and includes request ids', async () => {
    const events: Array<Record<string, unknown>> = [];
    const app = createApp({ model: 'mock', openAiApiKey: undefined, port: 3000, corsOrigins: ['*'], dataDir: '', dbUrl: ':memory:', logLevel: 'INFO' }, { database: createSqliteDatabase(':memory:'), llmClient: new MockLLMClient(), logger: (event) => events.push(event) });
    const response = await request(app).post('/api/conversations').send({ location: { description: '12 Private Road' } });
    expect(response.headers['content-type']).toContain('application/json');
    expect(JSON.stringify(events)).not.toMatch(/12 Private Road|Alice|alice@example.com|555-0100/);
    expect(events[0]).toMatchObject({ method: 'POST', status: 201 });
    expect(events[0]?.request_id).toMatch(/^req_/);
  });
});
