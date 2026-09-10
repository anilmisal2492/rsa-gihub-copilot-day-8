import type { ErrorEnvelope, HealthResponse, MessageResponse, StartConversationRequest, StartConversationResponse } from '../types/roadside';

export class ApiClientError extends Error {
  constructor(public readonly code: ErrorEnvelope['error']['code'], message: string, public readonly requestId?: string) { super(message); }
}

const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

type RequestOptions = { method?: string; headers?: Record<string, string>; body?: string };

async function request<T>(path: string, init?: RequestOptions): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, { headers: { 'Content-Type': 'application/json' }, ...init });
  const body = await response.json() as T | ErrorEnvelope;
  if (!response.ok) {
    const error = body as ErrorEnvelope;
    throw new ApiClientError(error.error?.code ?? 'INTERNAL_ERROR', error.error?.message ?? 'Something went wrong. Please try again.', error.error?.request_id);
  }
  return body as T;
}

export const roadsideApi = {
  health: () => request<HealthResponse>('/health'),
  start: (payload: StartConversationRequest = {}) => request<StartConversationResponse>('/conversations', { method: 'POST', body: JSON.stringify(payload) }),
  send: (conversationId: string, message: string) => request<MessageResponse>(`/conversations/${conversationId}/messages`, { method: 'POST', body: JSON.stringify({ message }) }),
  reset: (conversationId: string) => request<{ status: 'reset' }>(`/conversations/${conversationId}/reset`, { method: 'POST', body: JSON.stringify({}) }),
};
