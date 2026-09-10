import OpenAI from 'openai';
import { ApiError } from '../errors.js';
import { assessmentSystemPrompt } from './assessment-parser.js';
import type { LLMClient, AssessmentGenerationInput, LLMGenerationResult } from './LLMClient.js';

export class ProviderLLMClient implements LLMClient {
  readonly configured: boolean;
  readonly model: string;
  private readonly client?: OpenAI;

  constructor(model: string, apiKey?: string) {
    this.model = model;
    this.configured = Boolean(apiKey);
    if (apiKey) this.client = new OpenAI({ apiKey });
  }

  async generateAssessment(input: AssessmentGenerationInput): Promise<LLMGenerationResult> {
    if (!this.client) throw new ApiError('LLM_NOT_CONFIGURED', 'Assessment service is not configured.');
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        temperature: 0.1,
        max_tokens: 1200,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: assessmentSystemPrompt() },
          { role: 'user', content: JSON.stringify({ message: input.message, context: input.conversation.messages.slice(-8) }) },
        ],
      });
      const rawText = response.choices[0]?.message.content;
      if (!rawText) throw new Error('Empty provider response');
      return { rawText, model: this.model };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      const status = (error as { status?: number }).status;
      if (status === 429) throw new ApiError('RATE_LIMITED', 'Assessment service is busy. Please try again shortly.');
      throw new ApiError('LLM_UNAVAILABLE', 'Assessment service is unavailable. Please try again.');
    }
  }
}
