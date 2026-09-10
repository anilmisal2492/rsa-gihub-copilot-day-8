import { readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { z } from 'zod';
import { ApiError } from '../errors.js';
import type { RoadsideAssessment } from '../types/domain.js';

export const assessmentSchema = z.object({
  problem_category: z.string().trim().min(1).max(120),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  summary: z.string().trim().min(1).max(600),
  immediate_actions: z.array(z.string().trim().min(1).max(240)).max(8),
  avoid_actions: z.array(z.string().trim().min(1).max(240)).max(8),
  recommended_service: z.enum(['NONE', 'ROADSIDE_ASSISTANCE', 'TOW_TRUCK', 'MECHANIC', 'EMERGENCY_SERVICES']),
  emergency_help: z.boolean(),
  follow_up_questions: z.array(z.string().trim().min(1).max(240)).max(5),
});

export function assessmentSystemPrompt(): string {
  try {
    return readFileSync(path.resolve(process.cwd(), 'backend/src/prompts/system.md'), 'utf8');
  } catch {
    return 'Return a safety-first roadside assessment as valid JSON.';
  }
}

export function parseAssessment(rawText: string): RoadsideAssessment {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new ApiError('LLM_UNAVAILABLE', 'The assessment service returned an invalid response. Please try again.');
  }
  const result = assessmentSchema.safeParse(parsed);
  if (!result.success) {
    throw new ApiError('LLM_UNAVAILABLE', 'The assessment service returned an unusable response. Please try again.');
  }
  return result.data;
}
