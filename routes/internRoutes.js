import express from "express";
import Intern from "../models/Intern.js";

const router = express.Router();

// --------------------------
// Get all interns
// --------------------------
router.get("/", async (req, res) => {
  try {
    const interns = await Intern.find();
    res.json(interns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --------------------------
// Add intern
// --------------------------
router.post("/", async (req, res) => {
  try {
    const intern = new Intern(req.body);
    await intern.save();
    res.status(201).json(intern);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --------------------------
// Edit intern
// --------------------------
router.put("/:id", async (req, res) => {
  try {
    const updated = await Intern.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Intern not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --------------------------
// Delete intern
// --------------------------
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Intern.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Intern not found" });
    }

    res.json({ message: "Intern deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
