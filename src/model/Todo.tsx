import mongoose, { Schema, Document, models } from "mongoose";

export type TodoStatus = "pending" | "in_progress" | "completed";

export interface ITodo extends Document {
  userId: string;
  title: string;
  status: TodoStatus;
  completed: boolean;
  createdAt: Date;
}

const TodoSchema = new Schema<ITodo>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },
    completed: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true } }
);

export const Todo = models.Todo || mongoose.model<ITodo>("Todo", TodoSchema);