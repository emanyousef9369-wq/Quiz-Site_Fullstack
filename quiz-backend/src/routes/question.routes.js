import { Router } from "express";
import { 
  getQuestions, 
  createQuestion, 
  updateQuestion, 
  deleteQuestion 
} from "../controllers/question.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { getQuestionsQuerySchema, newQuestionSchema } from "../validators/question.validator.js";
import { updateQuestionSchema } from "../validators/question.validator.js";
const router = Router();


router.use(authenticate);

router.get(
  "/",
  requireRole("lecturer"),
  validate(getQuestionsQuerySchema, "query"),
  getQuestions
);

router.post(
  "/",
  requireRole("lecturer"),
  validate(newQuestionSchema),
  createQuestion
);

router.put(
  "/:id",
  requireRole("lecturer"),
  validate(updateQuestionSchema),
  updateQuestion
);
router.delete("/:id", requireRole("lecturer"), deleteQuestion);

export default router;