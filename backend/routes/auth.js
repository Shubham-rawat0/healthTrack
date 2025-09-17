import express from "express"
import { authenticate } from "../middleware/authenticate.js"
const router=express.Router()
import upload from "../middleware/upload.js"
import { profile,trackProgress, updateProfile} from "../controllers/profile.js"
import { addWorkout, deleteWorkout, getWorkout, getWorkouts, updateWorkout } from "../controllers/workout.js"
import { addMeal, deleteMeal, getMeals, updateMeal } from "../controllers/meal.js"

router.get("/profile",authenticate,profile)
router.patch("/profileUp", authenticate, upload.single("pfp"), updateProfile);
router.get("/track",authenticate,trackProgress)

router.patch("/workout/:id",authenticate,updateWorkout)
router.get("/workout",authenticate,getWorkouts)
router.get("/search",authenticate,getWorkout)
router.post("/workout",authenticate,addWorkout)
router.delete("/workout/:id",authenticate,deleteWorkout)

router.post("/meal",authenticate,addMeal)
router.get("/meal",authenticate,getMeals)
router.patch("/meal/:id",authenticate,updateMeal)
router.delete("/meal/:id",authenticate,deleteMeal)


export default router