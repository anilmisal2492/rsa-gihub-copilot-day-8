import { describe, expect, it, vi } from 'vitest';
import { ApiClientError, roadsideApi } from './api';

describe('roadside API client', () => {
  it('maps documented errors and preserves request identifiers', async () => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() => Promise.resolve(new Response(JSON.stringify({ error: { code: 'RATE_LIMITED', message: 'Try again.', request_id: 'req_1' } }), { status: 429, headers: { 'Content-Type': 'application/json' } }))));
    await expect(roadsideApi.send('conv_1', 'help')).rejects.toBeInstanceOf(ApiClientError);
    await expect(roadsideApi.send('conv_1', 'help')).rejects.toMatchObject({ code: 'RATE_LIMITED', requestId: 'req_1' });
  });
});
