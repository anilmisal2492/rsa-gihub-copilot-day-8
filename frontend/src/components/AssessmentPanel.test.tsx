import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AssessmentPanel } from './AssessmentPanel';

const assessment = { problem_category: 'engine_start_failure', urgency: 'HIGH' as const, summary: 'Based on reported symptoms, not a confirmed diagnosis.', immediate_actions: ['Move away from traffic.'], avoid_actions: ['Do not stand in the lane.'], recommended_service: 'ROADSIDE_ASSISTANCE' as const, emergency_help: true, follow_up_questions: ['Do lights still work?'] };

describe('AssessmentPanel', () => {
  it('renders structured safety guidance', () => {
    render(<AssessmentPanel assessment={assessment} />);
    expect(screen.getByText('engine start failure')).toBeInTheDocument();
    expect(screen.getByText('Move away from traffic.')).toBeInTheDocument();
    expect(screen.getByText('Emergency help recommended')).toBeInTheDocument();
    expect(screen.getByText(/not a confirmed diagnosis/i)).toBeInTheDocument();
  });
});
