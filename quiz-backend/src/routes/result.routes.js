import { Router } from "express";
import { getUserResults, deleteUserResult } from "../controllers/quiz.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", getUserResults);
router.delete("/:id", deleteUserResult);

export default router;