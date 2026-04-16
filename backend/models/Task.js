import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      maxlength: [200, 'Title must be less than 200 characters'],
    },
    description: {
      type: String,
      maxlength: [1000, 'Description must be less than 1000 characters'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    priorityMatrix: {
      type: String,
      enum: ['Urgent/Important', 'Urgent/Not-Important', 'Not-Urgent/Important', 'Not-Urgent/Not-Important'],
      default: 'Not-Urgent/Not-Important',
    },
    projectContext: {
      type: String,
      default: 'General',
    },
    dueDate: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    category: {
      type: String,
      enum: ['work', 'personal', 'shopping', 'health'],
      default: 'personal',
    },
    subtasks: [
      {
        title: String,
        completed: { type: Boolean, default: false },
      },
    ],
    notesId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    link: {
      type: String,
      trim: true,
    },
    notified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for filtering and sorting
taskSchema.index({ userId: 1, completed: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });
taskSchema.index({ userId: 1, priority: 1 });

export default mongoose.model('Task', taskSchema);
