import express from "express";
import User from "../models/user.js";

const router = express.Router();

// --------------------------
// LOGIN ENDPOINT - ADD THIS
// --------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const bcrypt = await import("bcryptjs");
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (role && user.role !== role) {
      return res.status(401).json({ message: `This account is not registered as ${role}` });
    }

    res.json({
      internId: user._id,
      name: user.name,
      email: user.email,
      department: user.department,
      status: user.status,
      role: user.role
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// --------------------------
// Get all users
// --------------------------
router.get("/", async (req, res) => {
  try {
    // Update all existing users to have a role field if they don't have one
    await User.updateMany(
      { role: { $exists: false } }, // Find documents where role field doesn't exist
      { $set: { role: 'Intern' } }  // Set default role
    );

    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --------------------------
// Add user
// --------------------------
router.post("/", async (req, res) => {
  try {
    const { name, email, department, startDate, status, role, password } = req.body;

    // Validate required fields
    if (!name || !email || !department || !startDate || !password) {
      return res.status(400).json({ error: "Name, email, department, start date, and password are required" });
    }

    // Validate role
    if (role && !['Intern', 'Student'].includes(role)) {
      return res.status(400).json({ error: "Role must be either 'Intern' or 'Student'" });
    }

    const internData = {
      name,
      email: email.toLowerCase().trim(),
      department,
      startDate,
      status: status || 'Active',
      role: role || 'Intern', // Default to Intern if not provided
      password
    };

    const user = new User(internData);
    const savedUser = await user.save();

    // Explicitly return the data we want
    res.status(201).json({
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      department: savedUser.department,
      startDate: savedUser.startDate,
      status: savedUser.status,
      role: savedUser.role
    });
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

    // Validate role if provided
    if (updateData.role && !['Intern', 'Student'].includes(updateData.role)) {
      return res.status(400).json({ error: "Role must be either 'Intern' or 'Student'" });
    }

    // If password is updated, hash it
    if (updateData.password) {
      const bcrypt = await import("bcryptjs");
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    // Explicitly return the data we want
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      department: updated.department,
      startDate: updated.startDate,
      status: updated.status,
      role: updated.role
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// --------------------------
// Delete intern
// --------------------------
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;