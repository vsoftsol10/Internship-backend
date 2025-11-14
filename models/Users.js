import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  age: Number,
});

export default mongoose.model("User", userSchema);
