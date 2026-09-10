import type { ApiClientError } from '../services/api';

export function FailureState({ error, onRetry }: { error: ApiClientError; onRetry: () => void }) {
  return <div className="failure-state" role="alert"><div><strong>{error.code === 'LLM_NOT_CONFIGURED' ? 'Assessment service is not configured.' : 'The assessment could not be completed.'}</strong><p>{error.message}</p>{error.requestId && <small>Request reference retained for support.</small>}</div><button className="button button-secondary" type="button" onClick={onRetry}>Retry</button></div>;
}
