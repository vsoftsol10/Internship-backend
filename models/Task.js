import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  internId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Intern"
  },
  title: String,
  description: String,
  deadline: String,
  status: {
    type: String,
    default: "Pending"
  }
});

export default mongoose.model("Task", taskSchema);
