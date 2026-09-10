import type { Conversation, LocationContext, Message, RoadsideAssessment, VehicleContext } from '../types/domain.js';

export interface ConversationRepository {
  create(vehicle?: VehicleContext, location?: LocationContext): Conversation;
  getActive(conversationId: string): Conversation | undefined;
  appendMessage(conversationId: string, message: Message): Conversation;
  reset(conversationId: string): boolean;
}

export interface AssessmentRepository {
  save(conversationId: string, messageId: string, assessment: RoadsideAssessment): void;
  getLatest(conversationId: string): RoadsideAssessment | undefined;
}
