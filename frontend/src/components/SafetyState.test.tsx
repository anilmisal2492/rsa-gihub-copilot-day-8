import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SafetyState } from './SafetyState';

describe('SafetyState', () => {
  it.each(['LOW', 'MEDIUM', 'HIGH'] as const)('shows %s urgency', (urgency) => { render(<SafetyState urgency={urgency} />); expect(screen.getByText(`${urgency} urgency`)).toBeInTheDocument(); });
  it('makes emergency guidance visible', () => { render(<SafetyState urgency="HIGH" emergencyHelp />); expect(screen.getByText(/Emergency help may be needed/)).toBeInTheDocument(); });
});
