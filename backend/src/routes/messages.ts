import { Router } from 'express';
import { ApiError } from '../errors.js';
import { messageRequestSchema } from '../schemas/index.js';
import type { ConversationService } from '../services/conversation-service.js';

export function messagesRouter(service: ConversationService): Router {
  const router = Router();
  router.post('/conversations/:conversationId/messages', async (request, response, next) => {
    const parsed = messageRequestSchema.safeParse(request.body ?? {});
    if (!parsed.success) {
      next(new ApiError('VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Message is invalid.'));
      return;
    }
    try {
      const result = await service.send(request.params.conversationId, parsed.data.message);
      response.json({ message: result.message });
    } catch (error) {
      next(error);
    }
  });
  return router;
}
