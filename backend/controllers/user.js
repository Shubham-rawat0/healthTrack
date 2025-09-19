import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
// import { inngest } from "../inngest/index.js";

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export const signup = async (req, res) => {
  try {
    const { name, email, age, password } = req.body;
    if (!name || !email || !password || !age) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, age, password: hashedPass });
    if (!user) {
      return res.status(500).json({ message: "User creation failed" });
    }

    const token = generateToken(user);
    // await inngest.send({ name: "api/sendmail", data: { to:email, name:name } });
    return res.status(201).json({ message: "Account created", token });
  } catch (error) {
    console.error("Error while signup:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken(user);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error while login:", error);
    res.status(500).json({ message: "Server error" });
  }
};
