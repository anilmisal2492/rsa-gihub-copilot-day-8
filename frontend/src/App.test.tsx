import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => { it('renders the safety-first roadside entry point', () => { render(<App />); expect(screen.getAllByText('Roadside Assistant')).toHaveLength(2); expect(screen.getByRole('button', { name: /My vehicle has broken down/ })).toBeInTheDocument(); }); });
