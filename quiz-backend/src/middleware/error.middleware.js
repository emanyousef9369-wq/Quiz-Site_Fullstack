import { env } from "../config/env.js";

/**
 * Converts known Mongoose errors into predictable AppError-shaped
 * responses, then falls back to a generic 500 for anything else.
 */
const handleMongooseErrors = (err) => {
  // Duplicate key (e.g. duplicate username)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return { statusCode: 409, message: `${field} already exists` };
  }

  // Mongoose validation error (required fields, enum, custom validators)
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return { statusCode: 400, message };
  }

  // Invalid ObjectId cast (e.g. malformed :quizId)
  if (err.name === "CastError") {
    return { statusCode: 400, message: `Invalid ${err.path}: ${err.value}` };
  }

  return null;
};

/**
 * Centralized Express error handler. Must be registered last, after
 * all routes.
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  const mongooseError = handleMongooseErrors(err);
  if (mongooseError) {
    statusCode = mongooseError.statusCode;
    message = mongooseError.message;
  }

  if (statusCode === 500 && env.nodeEnv !== "production") {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(statusCode).json({
    message: statusCode === 500 ? "Internal server error" : message,
  });
};

/**
 * Catches requests to routes that don't exist.
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};
