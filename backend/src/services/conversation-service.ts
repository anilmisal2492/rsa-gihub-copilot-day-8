import { ApiError } from '../errors.js';
import type { LLMClient } from '../llm/LLMClient.js';
import type { AssessmentRepository, ConversationRepository } from '../repositories/repository-types.js';
import type { LocationContext, Message, VehicleContext } from '../types/domain.js';
import { RoadsideAssessmentService } from './roadside-assessment-service.js';

const initialMessage = "I'm here to help. First, are you currently in a safe place?";

export class ConversationService {
  private readonly assessmentService: RoadsideAssessmentService;

  constructor(private readonly conversations: ConversationRepository, private readonly assessments: AssessmentRepository, llmClient: LLMClient) {
    this.assessmentService = new RoadsideAssessmentService(llmClient);
  }

  start(vehicle?: VehicleContext, location?: LocationContext) {
    const conversation = this.conversations.create(vehicle, location);
    const message: Message = { role: 'assistant', content: initialMessage, request_id: undefined, created_at: new Date().toISOString() };
    const updated = this.conversations.appendMessage(conversation.conversation_id, message);
    return { conversation: updated, message };
  }

  async send(conversationId: string, content: string) {
    const conversation = this.conversations.getActive(conversationId);
    if (!conversation) throw new ApiError('CONVERSATION_NOT_FOUND', 'Conversation was not found.');
    if (conversation.messages.filter((message) => message.role === 'user').length >= 30) {
      throw new ApiError('RATE_LIMITED', 'This incident has reached its request limit. Start a new incident to continue.');
    }
    const userMessage: Message = { role: 'user', content, created_at: new Date().toISOString() };
    this.conversations.appendMessage(conversationId, userMessage);
    const current = this.conversations.getActive(conversationId)!;
    const result = await this.assessmentService.assess(content, current);
    const assistantMessage: Message = { role: 'assistant', content: result.content, assessment: result.assessment, request_id: result.request_id, created_at: new Date().toISOString() };
    this.assessments.save(conversationId, result.request_id, result.assessment);
    const updated = this.conversations.appendMessage(conversationId, assistantMessage);
    return { conversation: updated, message: assistantMessage };
  }

  reset(conversationId: string): void {
    if (!this.conversations.reset(conversationId)) throw new ApiError('CONVERSATION_NOT_FOUND', 'Conversation was not found.');
  }
}
