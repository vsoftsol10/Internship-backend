import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import mongoose from "mongoose";
import internRoutes from "./routes/internRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/interns", internRoutes);
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

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
