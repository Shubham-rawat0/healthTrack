import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./db/connectDb.js"
import authRouter from './routes/auth.js'
import userRouter from './routes/user.js'
import cloudinary from "./config/cloudinary.js";
import authenticating from "./routes/authenticate.js"
// import { serve } from "inngest/express";
// import { inngest, functions } from "./inngest/index.js";

dotenv.config()

const app=express()
app.use(cors())
app.use(express.json())
// app.use("/api/inngest", serve({ client: inngest, functions }));
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/authenticate',authenticating)

app.listen(process.env.PORT,()=>{
    console.log(`app listening at ${process.env.PORT}`);
})

connectDB()

console.log("Cloudinary configured:", cloudinary.config().cloud_name);