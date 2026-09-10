import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { IncidentEmptyState } from './IncidentEmptyState';

describe('IncidentEmptyState', () => {
  it('keeps the safety reminder and entry point visible', async () => {
    const onStart = vi.fn();
    render(<IncidentEmptyState onStart={onStart} loading={false} />);
    expect(screen.getByText(/move away from traffic/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /My vehicle has broken down/ }));
    expect(onStart).toHaveBeenCalledOnce();
  });
});
