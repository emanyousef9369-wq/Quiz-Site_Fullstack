import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import questionRoutes from "./routes/question.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { env } from "./config/env.js";
import resultRoutes from "./routes/result.routes.js"; 





export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

if (env.nodeEnv !== "test") {
  app.use(morgan("dev"));
}

app.get("/health", (req, res) => {
  res.status(200).json({ data: { status: "ok" } });
});

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/results", resultRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
