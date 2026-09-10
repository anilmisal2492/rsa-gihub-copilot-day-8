import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FailureState } from './FailureState';
import { ApiClientError } from '../services/api';

describe('FailureState', () => {
  it('shows a safe error and supports retry without exposing text', async () => {
    const retry = vi.fn();
    render(<FailureState error={new ApiClientError('LLM_UNAVAILABLE', 'Please try again.', 'req_123')} onRetry={retry} />);
    expect(screen.getByRole('alert')).toHaveTextContent(/assessment could not be completed/i);
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
