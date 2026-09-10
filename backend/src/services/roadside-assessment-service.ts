import { randomUUID } from 'node:crypto';
import { parseAssessment } from '../llm/assessment-parser.js';
import type { LLMClient } from '../llm/LLMClient.js';
import type { Conversation, RoadsideAssessment } from '../types/domain.js';

export interface AssessmentResult { assessment: RoadsideAssessment; content: string; request_id: string; }

const safetyPatterns = {
  fire: /\b(smoke|smoking|fire|flame|burning|burnt|burned)\b/i,
  collision: /\b(crash|crashed|collision|hit|accident|wreck)\b/i,
  traffic: /\b(live traffic|traffic lane|middle of the road|高速|dangerous position)\b/i,
  fuel: /\b(fuel leak|petrol leak|gas leak|smell of fuel|smells like fuel)\b/i,
  overheating: /\b(overheating|overheated|temperature warning|steam|very hot)\b/i,
};

function deterministicAssessment(message: string): RoadsideAssessment | undefined {
  if (safetyPatterns.fire.test(message)) return highRisk('possible_fire_or_smoke', 'Smoke or fire near a vehicle can become dangerous quickly.', ['Move away from the vehicle and traffic if safe.', 'Call emergency services from a safe location.']);
  if (safetyPatterns.collision.test(message)) return highRisk('collision', 'A collision may create immediate traffic and injury risks.', ['Move to a safe location if possible.', 'Call emergency services if anyone may be injured.']);
  if (safetyPatterns.traffic.test(message)) return highRisk('unsafe_traffic_position', 'Being exposed in a live traffic area is an immediate safety concern.', ['Turn on hazard lights if safe.', 'Move behind a barrier or away from traffic if possible.']);
  if (safetyPatterns.fuel.test(message)) return highRisk('possible_fuel_leak', 'A suspected fuel leak creates fire and exposure risks.', ['Move away from ignition sources and the vehicle.', 'Call roadside or emergency services from a safe location.']);
  if (safetyPatterns.overheating.test(message)) return highRisk('severe_overheating', 'Severe overheating can cause burns or further vehicle damage.', ['Stop in a safe place and let the vehicle cool.', 'Do not open the radiator or coolant cap while hot.']);
  return undefined;
}

function highRisk(category: string, summary: string, actions: string[]): RoadsideAssessment {
  return { problem_category: category, urgency: 'HIGH', summary: `${summary} This is guidance based on reported symptoms, not a confirmed diagnosis.`, immediate_actions: actions, avoid_actions: ['Do not continue driving into danger.', 'Do not attempt a repair near traffic, fire, fuel, or hot components.'], recommended_service: 'EMERGENCY_SERVICES', emergency_help: true, follow_up_questions: ['Are you and everyone else away from immediate danger?'] };
}

export class RoadsideAssessmentService {
  constructor(private readonly llmClient: LLMClient) {}

  async assess(message: string, conversation: Conversation): Promise<AssessmentResult> {
    const requestId = `req_${randomUUID()}`;
    const deterministic = deterministicAssessment(message);
    if (deterministic) return { assessment: deterministic, content: assessmentContent(deterministic), request_id: requestId };
    const generated = await this.llmClient.generateAssessment({ message, conversation });
    const assessment = parseAssessment(generated.rawText);
    return { assessment, content: assessmentContent(assessment), request_id: requestId };
  }
}

export function assessmentContent(assessment: RoadsideAssessment): string {
  return `${assessment.summary} ${assessment.immediate_actions[0] ?? ''}`.trim();
}

export { deterministicAssessment };
