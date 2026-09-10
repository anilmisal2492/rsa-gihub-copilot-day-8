export type Urgency = 'LOW' | 'MEDIUM' | 'HIGH';
export type RecommendedService = 'NONE' | 'ROADSIDE_ASSISTANCE' | 'TOW_TRUCK' | 'MECHANIC' | 'EMERGENCY_SERVICES';

export interface VehicleContext { make?: string; model?: string; year?: number; fuel_type?: string }
export interface LocationContext { description?: string }
export interface RoadsideAssessment {
  problem_category: string;
  urgency: Urgency;
  summary: string;
  immediate_actions: string[];
  avoid_actions: string[];
  recommended_service: RecommendedService;
  emergency_help: boolean;
  follow_up_questions: string[];
}
export interface RoadsideMessage {
  role: 'user' | 'assistant';
  content: string;
  request_id?: string;
  assessment?: RoadsideAssessment;
  created_at?: string;
}
export interface StartConversationRequest { vehicle?: VehicleContext; location?: LocationContext }
export interface StartConversationResponse { conversation_id: string; message: RoadsideMessage }
export interface MessageResponse { message: RoadsideMessage }
export interface HealthResponse { status: 'ok'; model: string; llm_configured: boolean }
export type ErrorCode = 'VALIDATION_ERROR' | 'RATE_LIMITED' | 'LLM_NOT_CONFIGURED' | 'LLM_UNAVAILABLE' | 'CONVERSATION_NOT_FOUND' | 'INTERNAL_ERROR';
export interface ErrorEnvelope { error: { code: ErrorCode; message: string; request_id: string } }
