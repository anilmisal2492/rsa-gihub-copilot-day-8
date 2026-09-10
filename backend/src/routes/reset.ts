import { Router } from 'express';
import type { ConversationService } from '../services/conversation-service.js';

export function resetRouter(service: ConversationService): Router {
  const router = Router();
  router.post('/conversations/:conversationId/reset', (request, response) => {
    service.reset(request.params.conversationId);
    response.json({ status: 'reset' });
  });
  return router;
}
