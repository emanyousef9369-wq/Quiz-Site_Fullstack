import { Result } from "../models/result.model.js"; 

export const resultRepository = {
  async create(data) {
    return await Result.create(data);
  },

  async findByStudentId(studentId) {
    return await Result.find({ studentId }).sort({ createdAt: -1 });
  },

  async deleteByIdAndStudent(resultId, studentId) {
    return await Result.findOneAndDelete({ _id: resultId, studentId });
  },
};