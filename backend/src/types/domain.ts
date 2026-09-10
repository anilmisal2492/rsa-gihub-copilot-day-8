export type Urgency = 'LOW' | 'MEDIUM' | 'HIGH';

export type RecommendedService =
  | 'NONE'
  | 'ROADSIDE_ASSISTANCE'
  | 'TOW_TRUCK'
  | 'MECHANIC'
  | 'EMERGENCY_SERVICES';

export interface VehicleContext {
  make?: string;
  model?: string;
  year?: number;
  fuel_type?: string;
}

export interface LocationContext {
  description?: string;
}

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

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  assessment?: RoadsideAssessment;
  request_id?: string;
  created_at: string;
}

export interface Conversation {
  conversation_id: string;
  created_at: string;
  updated_at: string;
  vehicle?: VehicleContext;
  location?: LocationContext;
  status: 'active' | 'reset';
  messages: Message[];
}
