import { randomUUID } from 'node:crypto';
import type { RoadsideAssessment } from '../types/domain.js';
import type { AssessmentRepository } from './repository-types.js';
import type { SqliteDatabase } from './sqlite.js';

export class SqliteAssessmentRepository implements AssessmentRepository {
  constructor(private readonly database: SqliteDatabase) {}

  save(conversationId: string, messageId: string, assessment: RoadsideAssessment): void {
    this.database.prepare('INSERT INTO assessments (assessment_id, conversation_id, message_id, assessment_json, created_at) VALUES (?, ?, ?, ?, ?)').run(`assessment_${randomUUID()}`, conversationId, messageId, JSON.stringify(assessment), new Date().toISOString());
  }

  getLatest(conversationId: string): RoadsideAssessment | undefined {
    const row = this.database.prepare('SELECT assessment_json FROM assessments WHERE conversation_id = ? ORDER BY created_at DESC LIMIT 1').get(conversationId) as { assessment_json: string } | undefined;
    return row ? JSON.parse(row.assessment_json) as RoadsideAssessment : undefined;
  }
}
