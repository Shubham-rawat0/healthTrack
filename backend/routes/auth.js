import express from "express"
import { authenticate } from "../middleware/authenticate.js"
const router=express.Router()
import upload from "../middleware/upload.js"
import { profile,updateProfile,trackProgress } from "../controllers/auth.js"

router.get("/profile",authenticate,profile)
router.patch("/profileUp", authenticate, upload.single("pfp"), updateProfile);
router.get("/track",authenticate,trackProgress)
// router.post("/workout/:id",authenticate,updateWorkout)
// router.get("/workout",authenticate,getWorkout)
// router.get("/meal",authenticate,getMeal)
export default router