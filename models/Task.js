import mongoose, { Schema } from "mongoose";

// This is the model you will be modifying
const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  // add a field to our task schema to relate it to a project
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  }
});

const Task = mongoose.model("Task", taskSchema);

export default Task;