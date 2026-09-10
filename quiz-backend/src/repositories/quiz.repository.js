import { Quiz } from "../models/quiz.model.js";

/**
 * Quiz repository contract:
 *   create(quizData)         -> Quiz
 *   findAll()                 -> Quiz[] (with createdBy populated)
 *   findById(id)               -> Quiz | null
 *   findByIdWithQuestions(id)  -> Quiz | null (with full question docs populated)
 */
export const quizRepository = {
  async create(quizData) {
    return Quiz.create(quizData);
  },

  async findAll() {
    return Quiz.find()
      .populate("createdBy", "email")
      .sort({ createdAt: -1 });
  },

  async findById(id) {
    return Quiz.findById(id);
  },

  async findByIdWithQuestions(id) {
    return Quiz.findById(id).populate("questions");
  },
};
