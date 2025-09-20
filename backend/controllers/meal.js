import { Meal } from "../models/meal.js";

export const addMeal = async (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ message: "User not found" });
  try {
    const mealInfo = req.body;
    const meal = await Meal.create({
      user: user._id,
      ...mealInfo,
    });
    return res.status(201).json({ message: "mael added", meal });
  } catch (error) {
    console.error("Error adding meal:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMeals = async (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ message: "User not found" });
  try {
    const meals = await Meal.find({ user: user._id }).sort({ date: -1 });
    if (!meals || meals.length === 0) {
      return res.status(404).json({ message: "No meals found" });
    }
    return res.status(200).json({ meals });
  } catch (error) {
    console.error("Error fetching meals:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateMeal = async (req, res) => {
  const user = req.user;
  const mealId = req.params.id;
  const mealData = req.body;
  if (!user) return res.status(401).json({ message: "User not found" });
  try {
    const meal = await Meal.findOneAndUpdate(
      { _id: mealId, user: user._id }, 
      { $set: mealData }, 
      { new: true, runValidators: true } 
    );
    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }
    return res.status(200).json({ message: "Meal updated successfully", meal });
  } catch (error) {
    console.error("Error updating meal:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteMeal = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  if (!user) return res.status(401).json({ message: "User not found" });
  try {
    const meal = await Meal.findOneAndDelete({ _id: id, user: user._id });
    if (!meal) {
        console.log("no meal")
      return res.status(404).json({ message: "Meal not found" });
    }
    return res.status(200).json({ message: "Meal deleted" });
  } catch (error) {
    console.error("Error deleting meal:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logMeal = async (req, res) => {
  const user = req.user;
  const mealId = req.params.id;
  const { consumed } = req.body; 

  if (typeof consumed !== "boolean") {
    return res.status(400).json({ message: "Consumed must be boolean" });
  }
  try {
    const meal = await Meal.findOne({ _id: mealId, user: user._id });
    if (!meal) return res.status(404).json({ message: "Meal not found" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingLogIndex = meal.logs.findIndex(
      (log) => new Date(log.date).setHours(0, 0, 0, 0) === today.getTime()
    );

    if (existingLogIndex >= 0) {
      meal.logs[existingLogIndex].consumed = consumed;
    } else {
      meal.logs.push({ date: new Date(), consumed });
    }

    await meal.save();

    res.status(200).json({ message: "Meal log updated", meal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
