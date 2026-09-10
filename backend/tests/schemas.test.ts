import { describe, expect, it } from 'vitest';
import { messageRequestSchema, startConversationSchema } from '../src/schemas/index.js';

describe('API schemas', () => {
  it('accepts documented context and rejects oversized message data', () => {
    expect(startConversationSchema.safeParse({ vehicle: { year: 2020 }, location: { description: 'shoulder' } }).success).toBe(true);
    expect(messageRequestSchema.safeParse({ message: 'x'.repeat(2001) }).success).toBe(false);
  });
});
