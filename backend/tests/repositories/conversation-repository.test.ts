import { describe, expect, it } from 'vitest';
import { SqliteConversationRepository } from '../../src/repositories/conversation-repository.js';
import { createSqliteDatabase } from '../../src/repositories/sqlite.js';

describe('SQLite conversation repository', () => {
  it('persists context, ordered messages, and reset state', () => {
    const repository = new SqliteConversationRepository(createSqliteDatabase(':memory:'));
    const conversation = repository.create({ make: 'Toyota' }, { description: 'shoulder' });
    repository.appendMessage(conversation.conversation_id, { role: 'user', content: 'help', created_at: new Date().toISOString() });
    expect(repository.getActive(conversation.conversation_id)?.messages).toHaveLength(1);
    expect(repository.reset(conversation.conversation_id)).toBe(true);
    expect(repository.getActive(conversation.conversation_id)).toBeUndefined();
  });
});
