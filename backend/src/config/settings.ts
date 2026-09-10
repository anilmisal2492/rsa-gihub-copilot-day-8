import 'dotenv/config';
import path from 'node:path';
import { z } from 'zod';

type Environment = Record<string, string | undefined>;

const environmentSchema = z.object({
  MODEL: z.string().trim().min(1).default('gpt-4o-mini'),
  OPENAI_API_KEY: z.string().trim().optional(),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  CORS_ORIGINS: z.string().default('http://localhost:5173'),
  DATA_DIR: z.string().default('./data'),
  DB_URL: z.string().default('./data/rsa.db'),
  LOG_LEVEL: z.enum(['DEBUG', 'INFO', 'WARN', 'ERROR']).default('INFO'),
});

export interface Settings {
  model: string;
  openAiApiKey?: string;
  port: number;
  corsOrigins: string[];
  dataDir: string;
  dbUrl: string;
  logLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
}

export function loadSettings(env: Environment = process.env): Settings {
  const parsed = environmentSchema.parse(env);
  return {
    model: parsed.MODEL,
    openAiApiKey: parsed.OPENAI_API_KEY || undefined,
    port: parsed.PORT,
    corsOrigins: parsed.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean),
    dataDir: path.resolve(parsed.DATA_DIR),
    dbUrl: parsed.DB_URL === ':memory:' ? ':memory:' : path.resolve(parsed.DB_URL),
    logLevel: parsed.LOG_LEVEL,
  };
}
