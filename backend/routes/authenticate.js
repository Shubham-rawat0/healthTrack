import express from "express";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.get("/user", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      email: req.user.email,
    },
  });
});

export default router;
