import mongoose, { Schema } from "mongoose";

// This is the model you will be modifying
const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  // add a field to our project schema to relate it to a user
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Project = mongoose.model("Project", projectSchema);

export default Project;