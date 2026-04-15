import mongoose from 'mongoose';

const CodeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Untitled.js',
  },
  code: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: 'javascript',
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
}, { timestamps: true });

export default mongoose.model('Code', CodeSchema);
