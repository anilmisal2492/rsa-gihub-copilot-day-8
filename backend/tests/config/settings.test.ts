import { describe, expect, it } from 'vitest';
import { loadSettings } from '../../src/config/settings.js';

describe('settings', () => {
  it('loads server-only configuration and parses origins', () => {
    const settings = loadSettings({ MODEL: 'test-model', OPENAI_API_KEY: 'secret', PORT: '3100', CORS_ORIGINS: 'http://a,http://b', DATA_DIR: './data', DB_URL: './data/test.db', LOG_LEVEL: 'DEBUG' });
    expect(settings.model).toBe('test-model');
    expect(settings.corsOrigins).toEqual(['http://a', 'http://b']);
    expect(settings.openAiApiKey).toBe('secret');
  });
});
