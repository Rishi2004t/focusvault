import mongoose from 'mongoose';

const soulEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Entry content is required'],
    },
    emotion: {
      type: String,
      required: [true, 'Emotion tag is required'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('SoulEntry', soulEntrySchema);
