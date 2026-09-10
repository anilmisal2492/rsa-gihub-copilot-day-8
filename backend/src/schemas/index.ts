import { z } from 'zod';
import { ERROR_CODES } from '../errors.js';

const optionalText = (max: number) => z.string().trim().min(1).max(max).optional();

export const vehicleSchema = z.object({
  make: optionalText(80),
  model: optionalText(80),
  year: z.number().int().min(1886).max(new Date().getFullYear() + 1).optional(),
  fuel_type: optionalText(40),
}).strict();

export const locationSchema = z.object({ description: optionalText(240) }).strict();

export const startConversationSchema = z.object({
  vehicle: vehicleSchema.optional(),
  location: locationSchema.optional(),
}).strict();

export const messageRequestSchema = z.object({
  message: z.string().trim().min(1, 'Message is required.').max(2000, 'Message is too long.'),
}).strict();

export const assessmentResponseSchema = z.object({
  problem_category: z.string(),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  summary: z.string(),
  immediate_actions: z.array(z.string()),
  avoid_actions: z.array(z.string()),
  recommended_service: z.enum(['NONE', 'ROADSIDE_ASSISTANCE', 'TOW_TRUCK', 'MECHANIC', 'EMERGENCY_SERVICES']),
  emergency_help: z.boolean(),
  follow_up_questions: z.array(z.string()),
});

export const errorResponseSchema = z.object({
  error: z.object({ code: z.enum(ERROR_CODES), message: z.string(), request_id: z.string() }),
});

export const healthResponseSchema = z.object({ status: z.literal('ok'), model: z.string(), llm_configured: z.boolean() });
