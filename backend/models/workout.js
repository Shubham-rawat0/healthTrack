import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  targetSets: { type: Number },
  duration: { type: Number },
  caloriesBurned: { type: Number, default: 5 },
  completed: { type: Boolean, default: false },
  description: { type: String },
  type: { type: String, required: true },
  logs: [
    {
      date: { type: Date, default: Date.now }, 
      completedSets: { type: Number, default: 0 }, 
      completed: { type: Boolean, default: false }, 
    },
  ],
});

const WorkoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    exercises: [ExerciseSchema],
    date: { type: Date, default: Date.now },   
  },
  { timestamps: true }
);

export const Workout = mongoose.model("Workout", WorkoutSchema);
