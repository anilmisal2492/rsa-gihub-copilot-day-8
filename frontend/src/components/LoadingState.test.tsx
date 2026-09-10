import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LoadingState } from './LoadingState';

describe('LoadingState', () => { it('announces processing', () => { render(<LoadingState />); expect(screen.getByRole('status')).toHaveTextContent(/Reviewing the reported symptoms/); }); });
