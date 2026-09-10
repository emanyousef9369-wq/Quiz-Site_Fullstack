import { questionRepository } from "../repositories/question.repository.js";
import { AppError } from "../utils/AppError.js";
export const questionService = {
  async getQuestions({ tag, difficulty } = {}) {
    if (tag) {
      return questionRepository.findByTag(tag);
    }

    if (difficulty) {
      return questionRepository.findByDifficulty(difficulty);
    }

    return questionRepository.findAll();
  },

  async createQuestion(data) {
    return questionRepository.create({
      statement: data.statement,
      choices: data.choices,
      correctAnswer: data.correctAnswer,
      tags: data.tags || [],
      difficulty: data.difficulty,
      createdBy: data.createdBy,
    });
  },
async updateQuestion(id, updateData) {
   
    const formattedData = {
      statement: updateData.statement || updateData.question || updateData.title,
      choices: updateData.choices || updateData.options || [],
      correctAnswer: updateData.correctAnswer || updateData.answer,
      difficulty: updateData.difficulty || "Medium",
      tags: updateData.tags || [],
    };

   
    Object.keys(formattedData).forEach(
      (key) => formattedData[key] === undefined && delete formattedData[key]
    );

    const updated = await questionRepository.update(id, formattedData);
    if (!updated) {
      throw new AppError("Question not found", 404);
    }
    return updated;
  },

  async deleteQuestion(id) {
    const deleted = await questionRepository.delete(id);
    if (!deleted) {
      throw new AppError("Question not found", 404);
    }
    return deleted;
  },
};

