import mongoose from "mongoose";

const { Schema } = mongoose;

const questionSchema = new Schema(
  {
    statement: {
      type: String,
      required: [true, "statement is required"],
      trim: true,
    },
    choices: {
      type: [String],
      required: [true, "choices are required"],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 2,
        message: "a question must have at least 2 choices",
      },
    },
    correctAnswer: {
      type: String,
      required: [true, "correctAnswer is required"],
      validate: {
        // `this` refers to the document being validated. This only
        // reliably works on document.save()/create(), which is how
        // the repository creates questions.
          validator: function (value) {
              if (this instanceof mongoose.Query) {
                return true;
              }

              return Array.isArray(this.choices) && this.choices.includes(value);
            },
        message: "correctAnswer must be one of the provided choices",
      },
    },
    tags: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "createdBy is required"],
    },
    difficulty: {
      type: String,
      required: [true, "difficulty is required"],
    },
  },
  { timestamps: true }
);

questionSchema.index({ tags: 1 });
questionSchema.index({ difficulty: 1 });

export const Question = mongoose.model("Question", questionSchema);
