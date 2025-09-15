import express from "express"
const router=express.Router()

router.post("/login",login)
router.post("/signup",signup)
router.get("/lohout",logout)

export default router