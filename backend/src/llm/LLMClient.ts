import type { Conversation, RoadsideAssessment } from '../types/domain.js';

export interface AssessmentGenerationInput {
  message: string;
  conversation: Conversation;
}

export interface LLMGenerationResult {
  rawText: string;
  model: string;
}

export interface LLMClient {
  readonly configured: boolean;
  readonly model: string;
  generateAssessment(input: AssessmentGenerationInput): Promise<LLMGenerationResult>;
}

export type AssessmentGenerator = (input: AssessmentGenerationInput) => Promise<RoadsideAssessment>;
