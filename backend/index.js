import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";

import connectDB from "./db/connectDb.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import authenticating from "./routes/authenticate.js";
import cloudinary from "./config/cloudinary.js";

dotenv.config();

const app = express();
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json({ limit: "10kb" }));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/authenticate", authenticating);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Cloudinary configured:", cloudinary.config().cloud_name);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
