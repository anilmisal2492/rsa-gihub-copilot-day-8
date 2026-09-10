import type { Request, RequestHandler } from 'express';
import { randomUUID } from 'node:crypto';

export interface RequestLogger {
  (event: { request_id: string; method: string; path: string; status: number; duration_ms: number }): void;
}

export function requestLogging(logger: RequestLogger = (event) => console.info(JSON.stringify(event))): RequestHandler {
  return (request, response, next) => {
    const requestId = `req_${randomUUID()}`;
    (request as unknown as Request & { requestId: string }).requestId = requestId;
    const started = Date.now();
    response.on('finish', () => {
      logger({
        request_id: requestId,
        method: request.method,
        path: request.path,
        status: response.statusCode,
        duration_ms: Date.now() - started,
      });
    });
    next();
  };
}
