import express from "express";
import Intern from "../models/intern.js";

const router = express.Router();

// --------------------------
// LOGIN ENDPOINT - ADD THIS
// --------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const intern = await Intern.findOne({ email: email.toLowerCase().trim() });

    if (!intern) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ FIX: Use bcrypt to compare hashed password
    const bcrypt = await import("bcryptjs");
    const isMatch = await bcrypt.compare(password, intern.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      internId: intern._id,
      name: intern.name,
      email: intern.email,
      phone: intern.phone,
      department: intern.department,
      position: intern.position
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

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
    const updateData = { ...req.body };

    // If password is updated, hash it
    if (updateData.password) {
      const bcrypt = await import("bcryptjs");
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updated = await Intern.findByIdAndUpdate(
      req.params.id,
      updateData,
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