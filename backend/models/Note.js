import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [200, 'Title must be less than 200 characters'],
    },
    content: {
      type: String,
      default: '',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      enum: ['work', 'personal', 'ideas', 'archive', 'neural'],
      default: 'work',
    },
    assets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
      },
    ],
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '#ffffff', // Hex color for note background
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ['standard', 'todo', 'neural-todo', 'blueprint'],
      default: 'standard',
    },
    todoItems: [
      {
        text: String,
        completed: { type: Boolean, default: false }
      }
    ],
    lastSavedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster searches
noteSchema.index({ userId: 1, tags: 1 });
noteSchema.index({ userId: 1, title: 'text', content: 'text' });

export default mongoose.model('Note', noteSchema);
