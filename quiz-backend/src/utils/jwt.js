import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

/**
 * Signs a JWT containing the user's id and role.
 */
export const signToken = ({ userId, role }) =>
  jwt.sign({ userId, role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

/**
 * Verifies a JWT and returns its decoded payload.
 * Throws if the token is invalid or expired.
 */
export const verifyToken = (token) => jwt.verify(token, env.jwtSecret);
