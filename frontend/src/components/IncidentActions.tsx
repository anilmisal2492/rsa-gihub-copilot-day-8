interface IncidentActionsProps { assistanceRequested: boolean; onRequestAssistance: () => void; onReset: () => void }

export function IncidentActions({ assistanceRequested, onRequestAssistance, onReset }: IncidentActionsProps) {
  return <div className="incident-actions"><div>{assistanceRequested && <p className="demo-note" role="status">Dispatch integration is not enabled in this demo. No provider was contacted.</p>}<button className="button button-primary" type="button" onClick={onRequestAssistance} disabled={assistanceRequested}>Request Roadside Assistance</button></div><button className="button button-quiet" type="button" onClick={onReset}>Start New Incident</button></div>;
}
