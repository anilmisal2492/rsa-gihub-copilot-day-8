import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RoadsideChat } from './RoadsideChat';

const assessment = { problem_category: 'battery', urgency: 'MEDIUM', summary: 'Symptoms only; not a confirmed diagnosis.', immediate_actions: ['Stay safe.'], avoid_actions: ['Do not work in traffic.'], recommended_service: 'ROADSIDE_ASSISTANCE', emergency_help: false, follow_up_questions: [] };

describe('RoadsideChat', () => {
  it('starts, sends a message, renders an assessment, and resets', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.endsWith('/conversations')) return Promise.resolve(new Response(JSON.stringify({ conversation_id: 'conv_1', message: { role: 'assistant', content: 'Are you safe?' } }), { status: 201 }));
      if (url.includes('/messages')) return Promise.resolve(new Response(JSON.stringify({ message: { role: 'assistant', content: 'Stay safe.', request_id: 'req_1', assessment } }), { status: 200 }));
      return Promise.resolve(new Response(JSON.stringify({ status: 'reset' }), { status: 200 }));
    });
    vi.stubGlobal('fetch', fetchMock);
    render(<RoadsideChat />);
    await user.click(screen.getByRole('button', { name: /My vehicle has broken down/ }));
    await waitFor(() => expect(screen.getByText('Are you safe?')).toBeInTheDocument());
    await user.type(screen.getByLabelText('What is happening?'), 'Battery symptoms');
    await user.click(screen.getByRole('button', { name: 'Send' }));
    await waitFor(() => expect(screen.getByText('battery')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /Start New Incident/ }));
    expect(screen.getByRole('button', { name: /My vehicle has broken down/ })).toBeInTheDocument();
  });
});
