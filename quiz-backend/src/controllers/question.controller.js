import { questionService } from "../services/question.service.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getQuestions = catchAsync(async (req, res) => {
  const { tag, difficulty } = req.query;
  const questions = await questionService.getQuestions({ tag, difficulty });
  res.status(200).json({ data: questions });
});

export const createQuestion = catchAsync(async (req, res) => {
  const userId = req.user?.userId || req.user?._id || req.user?.id || req.user;

  const questionData = {
    ...req.body,
    createdBy: userId,
  };

  const question = await questionService.createQuestion(questionData);
  return res.status(201).json(question);
});

export const updateQuestion = catchAsync(async (req, res) => {
  const { id } = req.params;

  // البيانات مستلمة جاهزة ومفحوصة من الـ validate middleware
  const updatedQuestion = await questionService.updateQuestion(id, req.body);

  res.status(200).json({
    status: "success",
    data: updatedQuestion,
  });
});

export const deleteQuestion = catchAsync(async (req, res) => {
  const { id } = req.params;
  await questionService.deleteQuestion(id);

  res.status(200).json({
    status: "success",
    message: "Question deleted successfully",
  });
});