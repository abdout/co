import mongoose, { Schema } from "mongoose";
import { type Systems } from "./types";
import { type ProjectFormValues } from "./validation";

const activitySchema = new Schema({
  system: String,
  category: String,
  subcategory: String,
  activity: String
});

const projectSchema = new Schema<ProjectFormValues>(
  {
    // Basic Information
    customer: String,
    description: String,
    location: String,
    client: String,
    consultant: String,
    status: String,
    priority: String,
    phase: String,
    
    // Team Information
    team: [String],
    teamLead: String,
    
    // Systems and Activities
    systems: [String],
    activities: [activitySchema],
    
    // Resources
    mobilization: String,
    accommodation: String,
    kits: [String],
    cars: [String],
    
    // Additional Fields
    startDate: Date,
    endDate: Date,
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
projectSchema.index({ customer: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ createdAt: -1 });

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;