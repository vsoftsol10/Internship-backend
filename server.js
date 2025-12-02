import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./src/config/db.js";
import internRoutes from "./src/routes/internRoutes.js";
import taskRoutes from "./src/routes/taskRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: "*", // allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// ----------------------------
// CONNECT TO MONGODB FIRST
// ----------------------------
connectDB();

// ----------------------------
// ROUTES
// ----------------------------
app.use("/api/interns", internRoutes);
app.use("/api/tasks", taskRoutes);

// Default test route
app.get("/", (req, res) => {
  res.json({
    message: "API is running...",
    endpoints: {
      interns: "/api/interns",
      tasks: "/api/tasks",
    },
  });
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
  console.log(`📋 Intern API: http://localhost:${PORT}/api/interns`);
  console.log(`📝 Task API: http://localhost:${PORT}/api/tasks`);
});
