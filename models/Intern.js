import mongoose from "mongoose";

const internSchema = new mongoose.Schema({
  name: String,
  email: String,
  department: String,
  startDate: String,
  status: {
    type: String,
    default: "Active"
  }
});

export default mongoose.model("Intern", internSchema);
