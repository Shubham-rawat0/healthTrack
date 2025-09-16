import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  targetSets: { type: Number }, 
  duration: { type: Number }, 
  caloriesBurned: { type: Number }, 
  completed: { type: Boolean, default: false }, 
});

const WorkoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    exercises: [ExerciseSchema],
    date: { type: Date, default: Date.now },
    description: { type: String },
  },
  { timestamps: true }
);

export const Workout = mongoose.model("Workout", WorkoutSchema);
