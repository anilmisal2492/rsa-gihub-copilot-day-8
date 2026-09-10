import { randomUUID } from 'node:crypto';
import type { Conversation, LocationContext, Message, VehicleContext } from '../types/domain.js';
import type { ConversationRepository } from './repository-types.js';
import type { SqliteDatabase } from './sqlite.js';

type StoredConversation = { conversation_id: string; created_at: string; updated_at: string; vehicle_json: string | null; location_json: string | null; status: 'active' | 'reset' };

export class SqliteConversationRepository implements ConversationRepository {
  constructor(private readonly database: SqliteDatabase) {}

  create(vehicle?: VehicleContext, location?: LocationContext): Conversation {
    const now = new Date().toISOString();
    const conversationId = `conv_${randomUUID()}`;
    this.database.prepare('INSERT INTO conversations (conversation_id, created_at, updated_at, vehicle_json, location_json, status) VALUES (?, ?, ?, ?, ?, ?)').run(conversationId, now, now, vehicle ? JSON.stringify(vehicle) : null, location ? JSON.stringify(location) : null, 'active');
    return { conversation_id: conversationId, created_at: now, updated_at: now, vehicle, location, status: 'active', messages: [] };
  }

  getActive(conversationId: string): Conversation | undefined {
    const row = this.database.prepare('SELECT * FROM conversations WHERE conversation_id = ? AND status = ?').get(conversationId, 'active') as StoredConversation | undefined;
    if (!row) return undefined;
    const messages = this.database.prepare('SELECT role, content, assessment_json, request_id, created_at FROM messages WHERE conversation_id = ? ORDER BY created_at ASC').all(conversationId) as Array<{ role: 'user' | 'assistant'; content: string; assessment_json: string | null; request_id: string | null; created_at: string }>;
    return {
      conversation_id: row.conversation_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      vehicle: row.vehicle_json ? JSON.parse(row.vehicle_json) : undefined,
      location: row.location_json ? JSON.parse(row.location_json) : undefined,
      status: row.status,
      messages: messages.map((message) => ({ role: message.role, content: message.content, request_id: message.request_id ?? undefined, assessment: message.assessment_json ? JSON.parse(message.assessment_json) : undefined, created_at: message.created_at })),
    };
  }

  appendMessage(conversationId: string, message: Message): Conversation {
    const existing = this.getActive(conversationId);
    if (!existing) throw new Error('Conversation not found');
    const messageId = `msg_${randomUUID()}`;
    this.database.prepare('INSERT INTO messages (message_id, conversation_id, role, content, assessment_json, request_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').run(messageId, conversationId, message.role, message.content, message.assessment ? JSON.stringify(message.assessment) : null, message.request_id ?? null, message.created_at);
    this.database.prepare('UPDATE conversations SET updated_at = ? WHERE conversation_id = ?').run(message.created_at, conversationId);
    return this.getActive(conversationId)!;
  }

  reset(conversationId: string): boolean {
    const result = this.database.prepare('UPDATE conversations SET status = ?, updated_at = ? WHERE conversation_id = ? AND status = ?').run('reset', new Date().toISOString(), conversationId, 'active');
    return result.changes > 0;
  }
}
