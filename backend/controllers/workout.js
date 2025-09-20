import { Workout } from "../models/workout.js";

export const addWorkout = async (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ message: "User not found" });
  const exerciseData = req.body;
  try {
    let workout = await Workout.findOne({ user: user._id });
    if (workout) {
      workout.exercises.push(exerciseData);
      await workout.save();
    } else {
      workout = await Workout.create({
        user: user._id,
        exercises: [exerciseData],
      });
    }
    return res.status(201).json({ message: "Exercise added", workout });
  } catch (error) {
    console.error("Error adding workout:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getWorkouts = async (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ message: "User not found" });
  try {
    const workout = await Workout.findOne({ user: user._id });
    if (!workout || workout.exercises.length === 0) {
      return res.status(404).json({ message: "No exercises found" });
    }
    return res.status(200).json({ exercises: workout.exercises });
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getWorkout = async (req, res) => {
  const user = req.user;
  const { name: workoutName } = req.query;
  if (!user) return res.status(401).json({ message: "User not found" });
  try {
    const workout = await Workout.findOne({ user: user._id });

    if (!workout) {
      return res.status(404).json({ message: "No workout found" });
    }

    const exercises = workout.exercises.filter((ex) => ex.name === workoutName);
    if (exercises.length === 0) {
      return res
        .status(404)
        .json({ message: `Exercise "${workoutName}" not found` });
    }
    return res.status(200).json({ exercises });
  } catch (error) {
    console.error("Error fetching exercise:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateWorkout = async (req, res) => {
  const user = req.user;
  const workoutId = req.params.id;
  if (!user) return res.status(401).json({ message: "User not found" });
  const exerciseData = req.body;
  try {
    let workout = await Workout.findOne({ user: user._id });
    if (!workout) {
      return res.status(404).json({ message: "No workout found" });
    }
    const exercise = workout.exercises.id(workoutId);
    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }
    Object.assign(exercise, exerciseData);
    await workout.save();
    return res.status(200).json({ message: "Exercise updated", exercise });
  } catch (error) {
    console.error("Error updating workout:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteWorkout = async (req, res) => {
  const user = req.user;
  const exerciseId = req.params.id; 
    if (!user) {
    return res.status(401).json({ message: "User not found" });
  }
  try {
    const workout = await Workout.findOne({ user: user._id });
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    const updatedWorkout = await Workout.findOneAndUpdate(
      { user: user._id },
      { $pull: { exercises: { _id: exerciseId } } },
      { new: true }
    );
    if (!updatedWorkout) {
      return res.status(404).json({ message: "Exercise not found" });
    }
    return res.status(200).json({
      message: "Exercise deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting workout:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logWorkout = async (req, res) => {
  const user = req.user;
  const exerciseId = req.params.id;
  const { completed, completedSets, date } = req.body;
  try {
    const workout = await Workout.findOne({ user: user._id });
    if (!workout) return res.status(404).json({ message: "Workout not found" });

    const exercise = workout.exercises.id(exerciseId);
    if (!exercise)
      return res.status(404).json({ message: "Exercise not found" });

    const logDate = date ? new Date(date) : new Date();
    const existingLog = exercise.logs.find(
      (l) => new Date(l.date).toDateString() === logDate.toDateString()
    );

    const sets =
      completedSets > (exercise.targetSets || 0)
        ? exercise.targetSets
        : completedSets;

    if (existingLog) {
      existingLog.completedSets = sets;
      existingLog.completed = completed;
    } else {
      exercise.logs.push({ date: logDate, completed, completedSets: sets });
    }

    await workout.save();
    res.status(200).json({ message: "Logged exercise", exercise });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};






