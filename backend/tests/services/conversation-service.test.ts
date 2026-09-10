import { describe, expect, it } from 'vitest';
import { ConversationService } from '../../src/services/conversation-service.js';
import { SqliteAssessmentRepository } from '../../src/repositories/assessment-repository.js';
import { SqliteConversationRepository } from '../../src/repositories/conversation-repository.js';
import { createSqliteDatabase } from '../../src/repositories/sqlite.js';
import { MockLLMClient } from '../fixtures/mock-llm-client.js';

describe('conversation service', () => {
  it('passes prior messages to the model on follow-up', async () => {
    const database = createSqliteDatabase(':memory:');
    const llm = new MockLLMClient();
    const service = new ConversationService(new SqliteConversationRepository(database), new SqliteAssessmentRepository(database), llm);
    const started = service.start();
    await service.send(started.conversation.conversation_id, 'The car will not start.');
    await service.send(started.conversation.conversation_id, 'The dashboard lights still work.');
    expect(llm.calls[1]?.conversation.messages.length).toBeGreaterThan(1);
  });
});
