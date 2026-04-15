import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['In Review', 'In Development', 'Testing', 'Completed', 'On Hold'],
      default: 'In Development',
    },
    priority: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low'],
      default: 'Medium',
    },
    taskCount: {
      type: Number,
      default: 0,
    },
    completedTasks: {
      type: Number,
      default: 0,
    },
    nextMilestone: {
      type: String,
      default: 'Pending Definition',
    },
    milestoneDate: {
      type: Date,
    },
    team: [
      {
        name: String,
        avatar: String,
      },
    ],
    activityLog: [
      {
        date: String,
        value: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
