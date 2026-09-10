import { quizService } from "../services/quiz.service.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createQuiz = catchAsync(async (req, res) => {
  const { title, description, questions } = req.body;
  const quiz = await quizService.createQuiz({
    title,
    description,
    questions,
    lecturerId: req.user.userId || req.user._id || req.user.id,
  });
  res.status(201).json({ data: quiz });
});

export const listQuizzes = catchAsync(async (req, res) => {
  const quizzes = await quizService.listQuizzes();
  res.status(200).json({ data: quizzes });
});

export const getQuizForStudent = catchAsync(async (req, res) => {
  const { quizId } = req.params;
  const quiz = await quizService.getQuizForStudent(quizId);
  res.status(200).json({ data: quiz });
});

export const submitQuiz = catchAsync(async (req, res) => {
  const { quizId } = req.params;
  const { answers } = req.body;
  
 
  const studentId = req.user?.userId || req.user?._id || req.user?.id;

  const result = await quizService.submitAnswers({ quizId, answers, studentId });
  res.status(200).json({ data: result });
});


export const getUserResults = catchAsync(async (req, res) => {
  const studentId = req.user?.userId || req.user?._id || req.user?.id;
  const results = await quizService.getUserResults(studentId);
  res.status(200).json({ data: results });
});

export const deleteUserResult = catchAsync(async (req, res) => {
  const { id } = req.params;
  const studentId = req.user?.userId || req.user?._id || req.user?.id;

  await quizService.deleteUserResult(id, studentId);
  res.status(200).json({ status: "success", message: "Result deleted successfully" });
});