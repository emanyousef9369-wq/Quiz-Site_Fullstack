import Joi from "joi";
import { newQuestionSchema } from "./question.validator.js";

const objectId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .message('"{{#label}}" must be a valid MongoDB ObjectId');

// Each entry in the quiz's `questions` array is either:
//   { questionId: "..." }                       -> reuse existing question
//   { statement, choices, correctAnswer, tags }  -> create a new question
const quizQuestionEntrySchema = Joi.alternatives().try(
  Joi.object({ questionId: objectId.required() }),
  newQuestionSchema
);

export const createQuizSchema = Joi.object({
  title: Joi.string().trim().min(1).required(),
  description: Joi.string().trim().allow("").default(""),
  questions: Joi.array().items(quizQuestionEntrySchema).min(1).required(),
});

export const submitQuizSchema = Joi.object({
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: objectId.required(),
        answer: Joi.string().trim().required(),
      })
    )
    .min(1)
    .required(),
});

export const quizIdParamSchema = Joi.object({
  quizId: objectId.required(),
});
