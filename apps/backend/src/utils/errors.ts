export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: Array<{ field: string; message: string }>;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(details: Array<{ field: string; message: string }>) {
    super(400, 'VALIDATION_ERROR', 'Validation failed', details);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(401, 'UNAUTHORIZED', message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(403, 'FORBIDDEN', message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(code = 'NOT_FOUND', message = 'Resource not found') {
    super(404, code, message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ConflictError extends AppError {
  constructor(code = 'CONFLICT', message = 'Resource already exists') {
    super(409, code, message);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
