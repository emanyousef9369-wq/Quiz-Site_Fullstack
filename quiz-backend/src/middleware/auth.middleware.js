import { verifyToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";

/**
 * Reads the JWT from the "Authorization: Bearer <token>" header,
 * verifies it, and attaches { userId, role } to req.user.
 * Rejects the request with 401 if the token is missing or invalid.
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(req.headers.authorization);
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Authentication required", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
  }
};
