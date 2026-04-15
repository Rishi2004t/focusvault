import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['VAULT_ADD', 'VAULT_DEL', 'NOTE_SYNC', 'NOTE_CREATE', 'TASK_OK', 'TASK_ADD', 'TEAM_JOIN', 'SYSTEM_LOG', 'IDE_EXEC'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'system', 'security', 'neural'],
    default: 'system',
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

// Index for fast lookups by user and time
activitySchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model('Activity', activitySchema);
