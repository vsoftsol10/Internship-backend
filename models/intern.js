import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const internSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  department: String,
  startDate: String,
  status: { type: String, default: "Active" },
  password: String
});

// Hash password before saving
internSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();  
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("Intern", internSchema);