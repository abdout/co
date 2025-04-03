import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    project: { type: String },
    task: { type: String },
    club: { type: String },
    status: { 
      type: String, 
      enum: ["pending", "stuck", "in_progress", "done"],
      default: "pending"
    },
    priority: { 
      type: String, 
      enum: ["pending", "high", "medium", "low"],
      default: "pending"
    },
    duration: { type: String },
    desc: { type: String },
    label: { type: String },
    tag: { type: String },
    remark: { type: String },
    date: { type: Date },
    hours: { type: Number },
    overtime: { type: Number },
    linkedActivity: {
      projectId: { type: String },
      system: { type: String },
      category: { type: String },
      subcategory: { type: String },
      activity: { type: String }
    },
    assignedTo: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;