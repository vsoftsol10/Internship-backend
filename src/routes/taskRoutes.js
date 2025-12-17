import express from "express";
import Task from "../models/task.js";
import Intern from "../models/intern.js";

const router = express.Router();

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().populate("internId", "name email");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tasks by intern ID
router.get("/intern/:internId", async (req, res) => {
  try {
    const tasks = await Task.find({ internId: req.params.internId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single task by ID
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("internId", "name email");
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new task
router.post("/", async (req, res) => {
  try {
    const { internId, title, description, deadline, status } = req.body;

    // Validate required fields
    if (!internId || !title || !deadline) {
      return res.status(400).json({ error: "Intern ID, title, and deadline are required" });
    }

    // Check if intern exists
    const intern = await Intern.findById(internId);
    if (!intern) {
      return res.status(404).json({ error: "Intern not found" });
    }

    const task = new Task({
      internId,
      title,
      description,
      deadline,
      status: status || "Acknowledge"
    });

    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update task (PATCH) - THIS IS THE KEY FIX
router.patch("/:id", async (req, res) => {
  try {
    const { status, reason } = req.body;
    
    const updateData = {};
    if (status !== undefined) {
      updateData.status = status;
    }
    if (reason !== undefined) {
      updateData.reason = reason;
    }
    
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error("Task update error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Update task (PUT) - Full update
router.put("/:id", async (req, res) => {
  try {
    const { internId, title, description, deadline, status, reason } = req.body;

    // Check if intern exists if internId is being updated
    if (internId) {
      const intern = await Intern.findById(internId);
      if (!intern) {
        return res.status(404).json({ error: "Intern not found" });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { internId, title, description, deadline, status, reason },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update task status only
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete task
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully", task: deletedTask });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete all tasks for a specific intern
router.delete("/intern/:internId", async (req, res) => {
  try {
    const result = await Task.deleteMany({ internId: req.params.internId });
    res.json({ 
      message: `${result.deletedCount} task(s) deleted successfully`,
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;