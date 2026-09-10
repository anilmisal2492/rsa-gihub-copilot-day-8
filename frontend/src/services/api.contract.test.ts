import { describe, expect, it } from 'vitest';
import { ApiClientError } from './api';

describe('frontend API contract', () => { it('keeps request references non-prominent and typed', () => { const error = new ApiClientError('VALIDATION_ERROR', 'Message is required.', 'req_123'); expect(error.code).toBe('VALIDATION_ERROR'); expect(error.requestId).toBe('req_123'); }); });
