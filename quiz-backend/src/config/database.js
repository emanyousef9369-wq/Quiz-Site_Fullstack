import mongoose from "mongoose";
import { env } from "./env.js";

/**
 * Connects to MongoDB using the URI from the environment.
 * Mongoose will automatically create the database and collections
 * on first write, so no manual setup is required.
 */
export const connectDB = async () => {
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.mongoUri);

  // eslint-disable-next-line no-console
  console.log(`MongoDB connected: ${mongoose.connection.host}`);

  mongoose.connection.on("error", (err) => {
    // eslint-disable-next-line no-console
    console.error("MongoDB connection error:", err.message);
  });
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
};
