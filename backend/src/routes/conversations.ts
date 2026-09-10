import { Router } from 'express';
import { ApiError } from '../errors.js';
import { startConversationSchema } from '../schemas/index.js';
import type { ConversationService } from '../services/conversation-service.js';

export function conversationsRouter(service: ConversationService): Router {
  const router = Router();
  router.post('/conversations', (request, response) => {
    const parsed = startConversationSchema.safeParse(request.body ?? {});
    if (!parsed.success) throw new ApiError('VALIDATION_ERROR', 'Vehicle or location data is invalid.');
    const result = service.start(parsed.data.vehicle, parsed.data.location);
    response.status(201).json({ conversation_id: result.conversation.conversation_id, message: result.message });
  });
  return router;
}
