import express from "express"
import { authenticate } from "../middleware/authenticate.js"
const router=express.Router()
import upload from "../middleware/upload.js"
import {  profile,trackProgress, updateProfile} from "../controllers/profile.js"
import { addWorkout, deleteWorkout, getWorkout, getWorkouts, logWorkout, updateWorkout } from "../controllers/workout.js"
import { addMeal, deleteMeal, getMeals, logMeal, updateMeal } from "../controllers/meal.js"
// import { askAi } from "../utils/ai.js"

router.get("/profile",authenticate,profile)
router.patch("/profileUp", authenticate, upload.single("pfp"), updateProfile);
router.get("/track",authenticate,trackProgress)
// router.post("/search",authenticate,askAi)

router.patch("/workout/:id",authenticate,updateWorkout)
router.get("/workout",authenticate,getWorkouts)
router.get("/search",authenticate,getWorkout)
router.post("/workout",authenticate,addWorkout)
router.delete("/workout/:id",authenticate,deleteWorkout)
router.post("/workout/log/:id",authenticate,logWorkout)


router.post("/meal",authenticate,addMeal)
router.get("/meal",authenticate,getMeals)
router.patch("/meal/:id",authenticate,updateMeal)
router.delete("/meal/:id",authenticate,deleteMeal)
router.post("/meal/log/:id",authenticate,logMeal)


export default router