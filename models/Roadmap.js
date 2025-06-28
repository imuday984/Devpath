// models/Roadmap.js
import mongoose from "mongoose";

const StepSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: { type: Boolean, default: false },
});

const RoadmapSchema = new mongoose.Schema({
  userId: String,
  title: String,
  description: String,
  steps: [StepSchema],
  isPublic: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Roadmap || mongoose.model("Roadmap", RoadmapSchema);
