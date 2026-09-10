import { Router } from "express";
import {
  createQuiz,
  listQuizzes,
  getQuizForStudent,
  submitQuiz,
} from "../controllers/quiz.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createQuizSchema,
  submitQuizSchema,
  quizIdParamSchema,
} from "../validators/quiz.validator.js";

const router = Router();

// Lecturers create quizzes.
router.post("/", authenticate, requireRole("lecturer"), validate(createQuizSchema), createQuiz);

// Anyone authenticated can browse the quiz list (frontend uses this
// to display quizzes before a student picks one).
router.get("/", authenticate, listQuizzes);

// Students take a quiz by id — correct answers are stripped.
router.get(
  "/:quizId",
  authenticate,
  requireRole("student"),
  validate(quizIdParamSchema, "params"),
  getQuizForStudent
);

// Students submit their answers for grading.
router.post(
  "/:quizId/submit",
  authenticate,
  requireRole("student"),
  validate(quizIdParamSchema, "params"),
  validate(submitQuizSchema),
  submitQuiz
);

export default router;
