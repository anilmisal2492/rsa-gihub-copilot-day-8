import type { RoadsideAssessment } from '../types/roadside';

export function AssessmentPanel({ assessment }: { assessment: RoadsideAssessment }) {
  return <section className="assessment-panel" aria-label="Roadside assessment">
    <div className="assessment-heading"><div><span className="eyebrow">Reported symptoms suggest</span><h2>{assessment.problem_category.replace(/_/g, ' ')}</h2></div><span className={`urgency-pill urgency-${assessment.urgency.toLowerCase()}`}>{assessment.urgency}</span></div>
    <p className="assessment-summary">{assessment.summary}</p>
    <div className="assessment-columns"><div><h3>Do now</h3><ul>{assessment.immediate_actions.map((action) => <li key={action}>{action}</li>)}</ul></div><div><h3>Avoid</h3><ul>{assessment.avoid_actions.map((action) => <li key={action}>{action}</li>)}</ul></div></div>
    <div className="assessment-meta"><span>Recommended service <strong>{assessment.recommended_service.replace(/_/g, ' ')}</strong></span>{assessment.emergency_help && <span className="emergency-note">Emergency help recommended</span>}</div>
    {assessment.follow_up_questions.length > 0 && <div className="follow-up"><h3>Useful next detail</h3><p>{assessment.follow_up_questions.join(' ')}</p></div>}
  </section>;
}
