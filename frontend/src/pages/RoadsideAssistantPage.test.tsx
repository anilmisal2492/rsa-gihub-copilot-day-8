import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RoadsideAssistantPage } from './RoadsideAssistantPage';

describe('RoadsideAssistantPage', () => { it('keeps concise safety copy visible', () => { render(<RoadsideAssistantPage />); expect(screen.getByText(/Safety first/)).toBeInTheDocument(); expect(screen.getByText(/not a confirmed diagnosis/)).toBeInTheDocument(); }); });
