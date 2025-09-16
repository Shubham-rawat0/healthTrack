import { Workout } from "../models/workout.js";
import { User } from "../models/user.js";
import cloudinary from "../config/cloudinary.js";

export const profile = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  try {
    return res.status(200).json({
      name: user.name,
      email: user.email,
      goal: user.goal,
      age: user.age,
      weight: user.weight,
      height: user.height,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const trackProgress = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  try {
    const workouts = await Workout.find({ user: user._id });

    if (!workouts || workouts.length === 0) {
      return res.status(404).json({ message: "No workouts found" });
    }

    const formattedWorkouts = workouts.map((workout) => ({
      type: workout.type,
      date: workout.date,
      description: workout.description,
      exercises: workout.exercises.map((ex) => ({
        name: ex.name,
        targetSets: ex.targetSets,
        duration: ex.duration,
        caloriesBurned: ex.caloriesBurned,
        completed: ex.completed,
      })),
    }));

    return res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        goal: user.goal,
        age: user.age,
        currentWeight: user.currentWeight,
        currentHeight: user.currentHeight,
      },
      workouts: formattedWorkouts,
    });
  } catch (error) {
    console.error("Error in trackProgress:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = req.user;

    const allowedUpdates = [
      "name",
      "age",
      "height",
      "weight",
      "currentWeight",
      "currentHeight",
      "goal",
      "pfp",
    ];

    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profile_pics" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      updates.pfp = result.secure_url; 
    }

    Object.assign(user, updates);
    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        age: user.age,
        height: user.height,
        weight: user.weight,
        currentWeight: user.currentWeight,
        currentHeight: user.currentHeight,
        goal: user.goal,
        pfp: user.pfp,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};




