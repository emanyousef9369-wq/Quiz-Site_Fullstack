import mongoose from "mongoose";

const { Schema } = mongoose;

const quizSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    questions: {
      type: [{ type: Schema.Types.ObjectId, ref: "Question" }],
      required: [true, "questions are required"],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 1,
        message: "a quiz must contain at least one question",
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "createdBy is required"],
    },
  },
  { timestamps: true }
);

export const Quiz = mongoose.model("Quiz", quizSchema);
