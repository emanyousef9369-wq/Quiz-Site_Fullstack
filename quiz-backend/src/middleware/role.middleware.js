import { AppError } from "../utils/AppError.js";

/**
 * Restricts a route to one or more roles. Must run after `authenticate`,
 * since it relies on req.user being set.
 *
 * Usage: requireRole("lecturer") or requireRole("student", "lecturer")
 */
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication required", 401));
  }

  if (!roles.includes(req.user.role)) {
    return next(new AppError("You do not have permission to perform this action", 403));
  }

  next();
};
