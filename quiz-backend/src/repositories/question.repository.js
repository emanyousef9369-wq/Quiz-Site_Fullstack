import { Question } from "../models/question.model.js";

/**
 * Question repository contract:
 *   findAll()                    -> Question[]
 *   findByTag(tag)                -> Question[]
 *   findById(id)                  -> Question | null
 *   findByIds(ids)                -> Question[]
 *   create(questionData)          -> Question
 */
export const questionRepository = {
  async findAll() {
    return Question.find().sort({ createdAt: -1 });
  },

  async findByTag(tag) {
    return Question.find({ tags: tag }).sort({ createdAt: -1 });
  },

  async findByDifficulty(difficulty) {    
    return Question.find({ difficulty: difficulty });
  },

  async findById(id) {
    return Question.findById(id);
  },

  async findByIds(ids) {
    return Question.find({ _id: { $in: ids } });
  },

  async create(questionData) {
    return Question.create(questionData);
  },
  async update(id, updateData) {
    return await Question.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      context: "query",
    });
  },

  async delete(id) {
    return await Question.findByIdAndDelete(id);
  },
};
