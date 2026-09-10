import { describe, expect, it } from 'vitest';
import { SqliteAssessmentRepository } from '../../src/repositories/assessment-repository.js';
import { createSqliteDatabase } from '../../src/repositories/sqlite.js';

describe('SQLite assessment repository', () => {
  it('persists and retrieves the latest structured assessment', () => {
    const repository = new SqliteAssessmentRepository(createSqliteDatabase(':memory:'));
    const assessment = { problem_category: 'battery', urgency: 'LOW' as const, summary: 'Symptoms only.', immediate_actions: [], avoid_actions: [], recommended_service: 'MECHANIC' as const, emergency_help: false, follow_up_questions: [] };
    repository.save('conv_1', 'msg_1', assessment);
    expect(repository.getLatest('conv_1')).toEqual(assessment);
  });
});
