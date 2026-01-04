import type { ErrorResponse } from './types';

export class RespawnHostError extends Error {
  public readonly statusCode: number;
  public readonly response: ErrorResponse | null;

  constructor(message: string, statusCode: number, response: ErrorResponse | null = null) {
    super(message);
    this.name = 'RespawnHostError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

export class UnauthorizedError extends RespawnHostError {
  constructor(response: ErrorResponse | null = null) {
    super('Unauthorized - API key required or invalid', 401, response);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends RespawnHostError {
  constructor(response: ErrorResponse | null = null) {
    super('Forbidden - Insufficient permissions or missing API key scope', 403, response);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends RespawnHostError {
  constructor(message: string = 'Resource not found', response: ErrorResponse | null = null) {
    super(message, 404, response);
    this.name = 'NotFoundError';
  }
}

export class BadRequestError extends RespawnHostError {
  constructor(message: string = 'Bad request', response: ErrorResponse | null = null) {
    super(message, 400, response);
    this.name = 'BadRequestError';
  }
}

export class ValidationError extends BadRequestError {
  constructor(response: ErrorResponse | null = null) {
    super('Validation error', response);
    this.name = 'ValidationError';
  }
}

export class ConflictError extends RespawnHostError {
  constructor(message: string = 'Resource conflict', response: ErrorResponse | null = null) {
    super(message, 409, response);
    this.name = 'ConflictError';
  }
}

export class PreconditionRequiredError extends RespawnHostError {
  constructor(response: ErrorResponse | null = null) {
    super('Precondition required', 428, response);
    this.name = 'PreconditionRequiredError';
  }
}

export class InternalServerError extends RespawnHostError {
  constructor(message: string = 'Internal server error', response: ErrorResponse | null = null) {
    super(message, 500, response);
    this.name = 'InternalServerError';
  }
}

export function handleError(statusCode: number, response: ErrorResponse | null = null): RespawnHostError {
  switch (statusCode) {
    case 400:
      return new BadRequestError(response?.statusMessage || 'Bad request', response);
    case 401:
      return new UnauthorizedError(response);
    case 403:
      return new ForbiddenError(response);
    case 404:
      return new NotFoundError(response?.statusMessage, response);
    case 409:
      return new ConflictError(response?.statusMessage, response);
    case 428:
      return new PreconditionRequiredError(response);
    case 500:
      return new InternalServerError(response?.statusMessage, response);
    default:
      return new RespawnHostError(`HTTP error: ${statusCode}`, statusCode, response);
  }
}
