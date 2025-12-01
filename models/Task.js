import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  internId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Intern",
    required: [true, "Intern ID is required"]
  },
  title: {
    type: String,
    required: [true, "Task title is required"],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ""
  },
  deadline: {
    type: String,
    required: [true, "Deadline is required"]
  },
  status: {
    type: String,
    enum: ["Acknowledge", "Pending", "In Progress", "Completed", "Blocked"],
    default: "Acknowledge"
  },
  reason: {
    type: String,
    trim: true,
    default: ""
  },
  assignedDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  }
}, {
  timestamps: true
});

// Index for faster queries
taskSchema.index({ internId: 1 });
taskSchema.index({ status: 1 });

export default mongoose.model("Task", taskSchema);