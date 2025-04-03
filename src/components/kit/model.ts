import mongoose, { Schema } from "mongoose";
import { type KitFormValues } from "./validation";

const kitSchema = new Schema<KitFormValues>(
  {
    id: { type: String, unique: true },
    name: { type: String },
    src: { type: String },
    alt: { type: String },
    width: Number,
    bg: String,
    calibration: String,
    datasheet: String,
    manual: String,
    status: String,
    under: String,
    location: String,
    price: String,
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
kitSchema.index({ id: 1 });
kitSchema.index({ name: 1 });
kitSchema.index({ status: 1 });
kitSchema.index({ createdAt: -1 });

const Kit = mongoose.models.Kit || mongoose.model("Kit", kitSchema);

export default Kit; 