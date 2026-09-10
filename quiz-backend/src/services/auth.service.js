import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository.js";
import { signToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";

const SALT_ROUNDS = 10;

const toPublicUser = (user) => ({
  id: user._id,
  email: user.email,
  role: user.role,
});

export const authService = {
  async signup({ email, password, role }) {
    const existing = await userRepository.findByEmail(email);
  
    if (existing) {
      throw new AppError("email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await userRepository.create({
      email,
      password: hashedPassword,
      role,
    });

    const token = signToken({ userId: user._id, role: user.role });

    return { user: toPublicUser(user), token };
  },

  async login({ email, password }) {
    const user = await userRepository.findByEmailWithPassword(email);
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = signToken({ userId: user._id, role: user.role });

    return { user: toPublicUser(user), token };
  },
};
