import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  department: String,
  startDate: String,
  status: { type: String, default: "Active" },
  role: { type: String, default: "Intern", enum: ["Intern", "Student"] }, // Role field with validation
  password: String
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", userSchema);
