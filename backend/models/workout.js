import mongoose from "mongoose";

const WorkoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true }, 
    exercise: { type: String, required: true }, 
    targetSets: { type: Number },
    duration: { type: Number }, 
    caloriesBurned: { type: Number },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Workout = mongoose.model("Workout", WorkoutSchema);

const WorkoutLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    workout: { type: mongoose.Schema.Types.ObjectId, ref: "Workout" }, 
    exercise: { type: String, required: true }, 
    sets: { type: Number, required: true }, 
    reps: { type: Number, required: true }, 
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const WorkoutLog = mongoose.model("WorkoutLog", WorkoutLogSchema);
