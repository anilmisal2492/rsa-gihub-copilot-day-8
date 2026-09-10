import type { ErrorRequestHandler, Request, RequestHandler } from 'express';

export const ERROR_CODES = [
  'VALIDATION_ERROR',
  'RATE_LIMITED',
  'LLM_NOT_CONFIGURED',
  'LLM_UNAVAILABLE',
  'CONVERSATION_NOT_FOUND',
  'INTERNAL_ERROR',
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export class ApiError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly status = statusFor(code),
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function statusFor(code: ErrorCode): number {
  switch (code) {
    case 'VALIDATION_ERROR':
      return 400;
    case 'CONVERSATION_NOT_FOUND':
      return 404;
    case 'RATE_LIMITED':
      return 429;
    case 'LLM_NOT_CONFIGURED':
    case 'LLM_UNAVAILABLE':
      return 503;
    default:
      return 500;
  }
}

export function requestIdFrom(request: Request): string {
  return (request as Request & { requestId?: string }).requestId ?? 'req_unknown';
}

export function errorEnvelope(error: ApiError, request: Request) {
  return {
    error: {
      code: error.code,
      message: error.message,
      request_id: requestIdFrom(request),
    },
  };
}

export const notFoundHandler: RequestHandler = (_request, response) => {
  response.status(404).json({
    error: { code: 'VALIDATION_ERROR', message: 'Route not found.', request_id: 'req_unknown' },
  });
};

export const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  void next;
  const apiError = error instanceof ApiError ? error : new ApiError('INTERNAL_ERROR', 'Something went wrong. Please try again.');
  if (error instanceof SyntaxError) {
    response.status(400).json(errorEnvelope(new ApiError('VALIDATION_ERROR', 'Request body must be valid JSON.'), request));
    return;
  }
  response.status(apiError.status).json(errorEnvelope(apiError, request));
};
