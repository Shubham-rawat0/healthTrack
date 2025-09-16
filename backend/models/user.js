import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    goal:{
      type:String,
      default:"aesthetics"
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    weight: { type: Number },
  
    height: { type: Number },
    currentWeight: { type: Number ,default:0},
  
    currentHeight: { type: Number ,default:0},
    age: {
      type: Number,
      required: true,
      min: 1, 
    },
    pfp: {
      type: String, 
      default:
        process.env.DEFAULT_IMG,
    },
  },
  { timestamps: true } 
);

export const User = mongoose.model("User", UserSchema);
