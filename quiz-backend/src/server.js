import { app } from "./app.js";
import { connectDB } from "./config/database.js";
import { env } from "./config/env.js";

const start = async () => {
  try {
    await connectDB();

    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Quiz backend server running on port ${env.port}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

start();
