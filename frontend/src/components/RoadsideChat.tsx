import { useState } from 'react';
import { useRoadsideConversation } from '../hooks/useRoadsideConversation';
import { AssessmentPanel } from './AssessmentPanel';
import { FailureState } from './FailureState';
import { IncidentActions } from './IncidentActions';
import { IncidentEmptyState } from './IncidentEmptyState';
import { LoadingState } from './LoadingState';
import { SafetyState } from './SafetyState';

export function RoadsideChat() {
  const { state, start, send, reset, setDraft, requestAssistance } = useRoadsideConversation();
  const [started, setStarted] = useState(false);
  const startIncident = async () => { setStarted(true); await start(); };
  const retry = () => void send();
  if (!started) return <IncidentEmptyState onStart={startIncident} loading={state.loading} />;
  return <div className="conversation-shell"><SafetyState urgency={state.urgency} emergencyHelp={state.assessment?.emergency_help} /><div className="message-list" aria-live="polite">{state.messages.map((message, index) => <div className={`message message-${message.role}`} key={`${message.created_at ?? 'message'}-${index}`}><span className="message-role">{message.role === 'assistant' ? 'Assistant' : 'You'}</span><p>{message.content}</p></div>)}{state.loading && <LoadingState />}</div>{state.assessment && <AssessmentPanel assessment={state.assessment} />}{state.error && <FailureState error={state.error} onRetry={retry} />}<form className="composer" onSubmit={(event) => { event.preventDefault(); void send(); }}><label htmlFor="roadside-message">What is happening?</label><div className="composer-row"><textarea id="roadside-message" value={state.draft} onChange={(event) => setDraft(event.target.value)} placeholder="For example: the car stopped and will not start" rows={2} disabled={state.loading} /><button className="button button-primary" type="submit" disabled={state.loading || !state.draft.trim()}>Send</button></div></form><IncidentActions assistanceRequested={state.assistanceRequested} onRequestAssistance={requestAssistance} onReset={() => { void reset(); setStarted(false); }} /></div>;
}
