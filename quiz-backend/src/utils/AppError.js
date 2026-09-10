/**
 * Operational error used throughout the app so the centralized error
 * middleware can distinguish "expected" errors (bad input, not found,
 * unauthorized, etc.) from unexpected bugs.
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
