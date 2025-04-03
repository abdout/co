import mongoose, { Schema } from "mongoose";
import { type CarFormValues } from "./validation";

const carSchema = new Schema<CarFormValues>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    src: { type: String, required: true },
    alt: { type: String, required: true },
    sim: String,
    petrol: Number,
    oil: String,
    history: String,
    status: String,
    under: String,
    km: Number,
    width: Number,
    licence: String,
    penalty: String,
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
carSchema.index({ id: 1 });
carSchema.index({ name: 1 });
carSchema.index({ status: 1 });
carSchema.index({ createdAt: -1 });

const Car = mongoose.models.Car || mongoose.model("Car", carSchema);

export default Car; 