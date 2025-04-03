import mongoose, { Schema } from "mongoose";

const dailySchema = new Schema(
  {
    title: String,
    description: String,
    date: String,
    engineer: String,
    project: String,
    status: String,
    priority: String,
    hoursSpent: String,
    completionPercentage: String,
    blockers: String,
    plannedTomorrow: String,
  },
  {
    timestamps: true,
  }
);

const Daily = mongoose.models.Daily || mongoose.model("Daily", dailySchema);

export default Daily; 