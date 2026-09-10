import Joi from "joi";

export const newQuestionSchema = Joi.object({
  statement: Joi.string().trim().min(1).optional(),
  question: Joi.string().trim().min(1).optional(),
  choices: Joi.array().items(Joi.string().trim()).min(2).optional(),
  options: Joi.array().items(Joi.string().trim()).min(2).optional(),
  correctAnswer: Joi.string().trim().optional(),
  answer: Joi.string().trim().optional(),
  tags: Joi.array().items(Joi.string().trim()).default([]),
  difficulty: Joi.string().trim().default("Easy"),
  createdBy: Joi.string().trim().optional(),
});

export const updateQuestionSchema = Joi.object({
  statement: Joi.string().trim().min(1).optional(),
  question: Joi.string().trim().min(1).optional(),
  choices: Joi.array().items(Joi.string().trim()).optional(),
  options: Joi.array().items(Joi.string().trim()).optional(),
  correctAnswer: Joi.string().trim().optional(),
  answer: Joi.string().trim().optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  difficulty: Joi.string().trim().optional(),
  createdBy: Joi.string().trim().optional(),
  topic: Joi.string().trim().optional(),
}).custom((value, helpers) => {
  const choicesArr = value.choices || value.options;
  const correctAns = value.correctAnswer || value.answer;

  if (Array.isArray(choicesArr) && choicesArr.length > 0 && correctAns) {
    const cleanChoices = choicesArr.map((c) => String(c).trim().toLowerCase());
    const cleanCorrect = String(correctAns).trim().toLowerCase();

    if (!cleanChoices.includes(cleanCorrect)) {
      return helpers.message("correctAnswer must be one of the provided choices");
    }
  }

  return value;
});

export const getQuestionsQuerySchema = Joi.object({
  tag: Joi.string().trim().optional(),
  difficulty: Joi.string().trim().optional(),
});