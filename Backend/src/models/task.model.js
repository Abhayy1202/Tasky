import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      lowercase: true,
    },
    due_date: {
      type: Date,
      default: null,
      required: true,
    },
    status: {
      type: String,
      enum: ["Todo", "Completed", "InProgress"],
      default: "Todo",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
  
    isdeleted: {
      type: Boolean,
      default: false,
    },
    user: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);


taskSchema.pre("save", async function (next) {
  if (
    this.isModified("subTask_completed_count") ||
    this.isModified("subTask_Total_count")
  ) {
    if (this.subTask_completed_count == this.subTask_Total_count)
      this.status = "Done";
    else if (
      this.subTask_completed_count > 0 &&
      this.subTask_completed_count < this.subTask_Total_count
    )
      this.status = "InProgress";
    else this.status = "Todo";
  }
  next();
});

export const Task = mongoose.model("Task", taskSchema);
