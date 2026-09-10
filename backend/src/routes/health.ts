import { Router } from 'express';
import type { Settings } from '../config/settings.js';
import type { LLMClient } from '../llm/LLMClient.js';

export function healthRouter(settings: Settings, llmClient: LLMClient): Router {
  const router = Router();
  router.get('/health', (_request, response) => {
    response.json({ status: 'ok', model: settings.model, llm_configured: llmClient.configured });
  });
  return router;
}
