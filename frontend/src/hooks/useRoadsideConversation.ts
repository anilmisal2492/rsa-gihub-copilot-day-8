import { useState } from 'react';
import { ApiClientError, roadsideApi } from '../services/api';
import type { RoadsideAssessment, RoadsideMessage, StartConversationRequest, Urgency } from '../types/roadside';

export interface ConversationState {
  conversationId?: string;
  messages: RoadsideMessage[];
  assessment?: RoadsideAssessment;
  urgency: Urgency;
  loading: boolean;
  error?: ApiClientError;
  draft: string;
  assistanceRequested: boolean;
}

const initialState: ConversationState = { messages: [], urgency: 'LOW', loading: false, draft: '', assistanceRequested: false };

export function useRoadsideConversation() {
  const [state, setState] = useState<ConversationState>(initialState);

  async function start(payload?: StartConversationRequest) {
    setState((current) => ({ ...current, loading: true, error: undefined }));
    try {
      const result = await roadsideApi.start(payload);
      setState((current) => ({ ...current, conversationId: result.conversation_id, messages: [result.message], loading: false }));
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: asApiError(error) }));
    }
  }

  async function send() {
    if (!state.conversationId || !state.draft.trim() || state.loading) return;
    const draft = state.draft;
    setState((current) => ({ ...current, loading: true, error: undefined, messages: [...current.messages, { role: 'user', content: draft }] }));
    try {
      const result = await roadsideApi.send(state.conversationId, draft);
      setState((current) => ({ ...current, loading: false, draft: '', messages: [...current.messages, result.message], assessment: result.message.assessment, urgency: result.message.assessment?.urgency ?? current.urgency }));
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: asApiError(error) }));
    }
  }

  async function reset() {
    if (state.conversationId) await roadsideApi.reset(state.conversationId).catch(() => undefined);
    setState(initialState);
  }

  function setDraft(draft: string) { setState((current) => ({ ...current, draft })); }
  function requestAssistance() { setState((current) => ({ ...current, assistanceRequested: true })); }

  return { state, start, send, reset, setDraft, requestAssistance };
}

function asApiError(error: unknown): ApiClientError {
  return error instanceof ApiClientError ? error : new ApiClientError('INTERNAL_ERROR', 'Something went wrong. Please try again.');
}
