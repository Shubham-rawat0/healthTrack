import express from "express"
import { authenticate } from "../middleware/authenticate.js"
const router=express.Router()

router.post("/workout/:id",authenticate,updateWorkout)
router.get("/workout",authenticate,getWorkout)
router.get("/meal",authenticate,getMeal)
export default router