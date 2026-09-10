import { describe, expect, it } from 'vitest';
import { SqliteAssessmentRepository } from '../../src/repositories/assessment-repository.js';
import { SqliteConversationRepository } from '../../src/repositories/conversation-repository.js';
import { createSqliteDatabase } from '../../src/repositories/sqlite.js';

describe('repository protocols', () => {
  it('provides conversation and assessment persistence behind their boundaries', () => {
    const database = createSqliteDatabase(':memory:');
    const conversations = new SqliteConversationRepository(database);
    const assessments = new SqliteAssessmentRepository(database);
    const conversation = conversations.create();
    const assessment = { problem_category: 'battery', urgency: 'LOW' as const, summary: 'Symptoms only.', immediate_actions: [], avoid_actions: [], recommended_service: 'MECHANIC' as const, emergency_help: false, follow_up_questions: [] };
    assessments.save(conversation.conversation_id, 'message_1', assessment);
    expect(conversations.getActive(conversation.conversation_id)?.status).toBe('active');
    expect(assessments.getLatest(conversation.conversation_id)).toEqual(assessment);
  });
});
