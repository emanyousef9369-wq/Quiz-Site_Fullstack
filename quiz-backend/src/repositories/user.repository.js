import { User } from "../models/user.model.js";

/**
 * User repository contract:
 *   findByUsername(username)              -> User | null (no password)
 *   findByUsernameWithPassword(username)   -> User | null (includes password)
 *   findById(id)                           -> User | null
 *   create({ username, password, role })   -> User
 *
 * Keeping all Mongoose-specific code behind this repository means the
 * service layer never talks to Mongoose directly.
 */
export const userRepository = {
  async findByEmail(email) {
    return User.findOne({ email });
  },

  async findByEmailWithPassword(email) {
    return User.findOne({ email }).select("+password");
  },

  async findById(id) {
    return User.findById(id);
  },

  async create({ email, password, role }) {
    return User.create({ email, password, role });
  },
};
