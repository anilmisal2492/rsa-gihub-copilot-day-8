import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RoadsideChat } from './RoadsideChat';

describe('RoadsideChat failure recovery', () => {
  it('preserves the entered draft when the provider fails', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.endsWith('/conversations')) return Promise.resolve(new Response(JSON.stringify({ conversation_id: 'conv_1', message: { role: 'assistant', content: 'Are you safe?' } }), { status: 201 }));
      return Promise.resolve(new Response(JSON.stringify({ error: { code: 'LLM_UNAVAILABLE', message: 'Try again.', request_id: 'req_1' } }), { status: 503 }));
    });
    vi.stubGlobal('fetch', fetchMock);
    render(<RoadsideChat />);
    await user.click(screen.getByRole('button', { name: /My vehicle has broken down/ }));
    await waitFor(() => expect(screen.getByText('Are you safe?')).toBeInTheDocument());
    const input = screen.getByLabelText('What is happening?');
    await user.type(input, 'The battery is dead');
    await user.click(screen.getByRole('button', { name: 'Send' }));
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(input).toHaveValue('The battery is dead');
  });
});
