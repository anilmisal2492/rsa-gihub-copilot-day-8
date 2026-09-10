import type { Urgency } from '../types/roadside';

interface SafetyStateProps { urgency: Urgency; emergencyHelp?: boolean }

export function SafetyState({ urgency, emergencyHelp = false }: SafetyStateProps) {
  const copy = urgency === 'HIGH' ? 'Prioritize your safety. Move away from danger and contact appropriate help.' : urgency === 'MEDIUM' ? 'Stay alert and use roadside assistance for the next safe step.' : 'Stay in a safe place while you work through the next step.';
  return <aside className={`safety-state safety-${urgency.toLowerCase()}`} aria-live="polite"><span className="safety-kicker">Safety state</span><strong>{urgency} urgency</strong><p>{copy}</p>{emergencyHelp && <b>Emergency help may be needed.</b>}</aside>;
}
