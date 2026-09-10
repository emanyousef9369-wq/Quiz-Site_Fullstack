import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: 6,
      select: false, // never returned by default in queries
    },
    role: {
      type: String,
      required: [true, "role is required"],
      enum: {
        values: ["student", "lecturer"],
        message: "role must be either 'student' or 'lecturer'",
      },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
