import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['info', 'error', 'warning', 'success', 'system'],
    default: 'info',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  }
});

const Log = mongoose.model('Log', logSchema);
export default Log;
