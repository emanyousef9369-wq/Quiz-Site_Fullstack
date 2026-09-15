import { quizRepository } from "../repositories/quiz.repository.js";
import { questionRepository } from "../repositories/question.repository.js";
import { resultRepository } from "../repositories/result.repository.js";
import { AppError } from "../utils/AppError.js";


const isExistingQuestionEntry = (entry) => {
  if (typeof entry === "string") return true;
  return Boolean(entry && (entry.questionId || entry._id || entry.id));
};

export const quizService = {
  /**
   * Creates a quiz from a mix of existing question references and
   * brand-new question payloads. Any brand-new question is first
   * inserted into the shared question bank, so it becomes reusable
   * by other lecturers going forward.
   */
  async createQuiz({ title, description, questions, lecturerId }) {
    const questionIds = [];

    for (const entry of questions) {
      if (isExistingQuestionEntry(entry)) {
        
        const targetId = typeof entry === "string" ? entry : (entry.questionId || entry._id || entry.id);

        const existing = await questionRepository.findById(targetId);
        if (!existing) {
          throw new AppError(`Question not found: ${targetId}`, 404);
        }
        questionIds.push(existing._id);
      } else {
     
        const created = await questionRepository.create({
          statement: entry.statement || entry.question || entry.title,
          choices: entry.choices || entry.options || [],
          correctAnswer: entry.correctAnswer || entry.answer,
          tags: entry.tags || [],
          createdBy: lecturerId,
          difficulty: entry.difficulty || "Medium",
        });
        questionIds.push(created._id);
      }
    }

    const quiz = await quizRepository.create({
      title,
      description,
      questions: questionIds,
      createdBy: lecturerId,
    });

    return quiz;
  },

  /**
   * Returns a lightweight list of all quizzes for the quiz-selection screen.
   */
  async listQuizzes() {
    const quizzes = await quizRepository.findAll();

    return quizzes.map((quiz) => ({
      id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      questionCount: quiz.questions ? quiz.questions.length : 0,
      createdBy: quiz.createdBy?.email,
    }));
  },

  /**
   * Returns a quiz with its questions, but WITHOUT correct answers.
   * Used by students taking the quiz.
   */
  async getQuizForStudent(quizId) {
    const quiz = await quizRepository.findByIdWithQuestions(quizId);
    if (!quiz) {
      throw new AppError("Quiz not found", 404);
    }

    return {
      id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      questions: (quiz.questions || []).map((q) => ({
        id: q._id,
        statement: q.statement || q.question || q.title,
        choices: q.choices || q.options || [],
      })),
    };
  },

  /**
   * Grades a student's submission, saves the result in the database,
   * and returns full details.
   */
async submitAnswers({ quizId, answers, studentId }) {
  const quiz = await quizRepository.findByIdWithQuestions(quizId);
  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }

  // تحويل أسئلة الكويز إلى Map للبحث السريع مع توحيد المعرف كـ String
  const questionsById = new Map(
    (quiz.questions || []).map((q) => [String(q._id || q.id), q])
  );

  let score = 0;
  const details = [];

  for (const item of answers) {
    // مرونة في استخراج questionId و answer بأي صيغة من الفرونت إند
    const qId = String(item.questionId || item.id || item._id);
    const userAnswer = item.answer || item.userAnswer || item.selectedOption;

    const question = questionsById.get(qId);

    if (question) {
    
      const formattedUserAns = String(userAnswer || "").trim().toLowerCase();
      const formattedCorrectAns = String(question.correctAnswer || "").trim().toLowerCase();

      const isCorrect = formattedUserAns === formattedCorrectAns;

      if (isCorrect) {
        score += 1;
      }

      details.push({
        question: question.statement || question.question || question.title,
        userAnswer: userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
      });
    }
  }

  const totalQuestions = quiz.questions ? quiz.questions.length : 0;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const wrong = totalQuestions - score;

  
  const savedResult = await resultRepository.create({
    studentId,
    quizId: quiz._id,
    quizTitle: quiz.title,
    score: percentage,
    correct: score,
    wrong,
    totalQuestions,
    details,
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  });

  return savedResult;
},

  /**
   * Returns all results for a specific student.
   */
  async getUserResults(studentId) {
    const results = await resultRepository.findByStudentId(studentId);
    return results;
  },

  /**
   * Deletes a specific result record belonging to a student.
   */
  async deleteUserResult(resultId, studentId) {
    const deleted = await resultRepository.deleteByIdAndStudent(resultId, studentId);
    if (!deleted) {
      throw new AppError("Result not found or unauthorized to delete", 404);
    }
    return deleted;
  },
};
