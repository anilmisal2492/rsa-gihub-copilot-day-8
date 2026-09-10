import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { IncidentActions } from './IncidentActions';

describe('IncidentActions', () => {
  it('shows the dispatch demo boundary and reset control', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<IncidentActions assistanceRequested={false} onRequestAssistance={() => rerender(<IncidentActions assistanceRequested onRequestAssistance={vi.fn()} onReset={vi.fn()} />)} onReset={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /Request Roadside Assistance/ }));
    expect(screen.getByText(/dispatch integration is not enabled/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start New Incident/ })).toBeInTheDocument();
  });
});
