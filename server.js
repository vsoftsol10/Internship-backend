import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import mongoose from "mongoose";
import User from "./models/Users.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Default test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Check DB connection
app.get("/db-status", (req, res) => {
  const state = mongoose.connection.readyState;

  const status =
    state === 1
      ? "Connected"
      : state === 2
      ? "Connecting"
      : state === 3
      ? "Disconnecting"
      : "Disconnected";

  res.json({ database: status });
});

// ----------------------------
// Add User Route
// ----------------------------
app.post("/add-user", async (req, res) => {
  try {
    const { name, password, age } = req.body;

    const newUser = await User.create({ name, password, age });

    res.status(201).json({
      message: "User added successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------------------
// Get all users
// ----------------------------
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
