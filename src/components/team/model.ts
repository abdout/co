import mongoose, { Schema } from "mongoose";
import { type TeamFormValues } from "./validation";

const teamMemberSchema = new Schema<TeamFormValues>(
  {
    id: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    src: { type: String, required: true },
    alt: { type: String, required: true },
    phone: String,
    mail: String,
    location: String,
    width: Number,
    height: Number,
    iqama: String,
    eligible: [String],
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
teamMemberSchema.index({ id: 1 });
teamMemberSchema.index({ firstName: 1, lastName: 1 });
teamMemberSchema.index({ createdAt: -1 });

// Virtual for full name
teamMemberSchema.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Configure to include virtuals when converting to JSON
teamMemberSchema.set('toJSON', { virtuals: true });
teamMemberSchema.set('toObject', { virtuals: true });

const TeamMember = mongoose.models.TeamMember || mongoose.model("TeamMember", teamMemberSchema);

export default TeamMember; 