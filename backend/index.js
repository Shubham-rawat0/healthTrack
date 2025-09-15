import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./db/connectDb"
import authRouter from './routes/auth.js'
import userRouter from './routes/user.js'

dotenv.config()

const app=express()
app.use(cors())
app.use(express.json())
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)

app.listen(process.env.PORT,()=>{
    conaole.log(`app listening at ${process.env.PORT}`);
})

connectDB()