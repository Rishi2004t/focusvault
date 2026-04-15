import mongoose from 'mongoose';
import crypto from 'crypto';

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['admin', 'dev', 'viewer'], default: 'dev' },
    joinedAt: { type: Date, default: Date.now },
  }],
  accessKey: {
    type: String,
    unique: true,
    default: () => crypto.randomUUID(),
  },
  sharedAssets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Asset' }],
  codeSnippets: [{
    title: { type: String, required: true },
    language: { type: String, default: 'javascript' },
    code: { type: String, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
  }],
  messages: [{
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderName: String,
    text: String,
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

export default mongoose.model('Team', teamSchema);
