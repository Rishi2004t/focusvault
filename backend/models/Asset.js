import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['pdf', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'doc', 'docx', 'image', 'document'],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    size: {
      type: Number, // in bytes
      required: true,
    },
    category: {
      type: String,
      enum: ['PDF Documents', 'Visual Frames', 'Slide Decks', 'Other'],
      required: true,
    }
  },
  { timestamps: true }
);

// Helper to categorize file types
assetSchema.pre('validate', function(next) {
  if (this.fileType === 'pdf') {
    this.category = 'PDF Documents';
  } else if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'image'].includes(this.fileType)) {
    this.category = 'Visual Frames';
  } else if (['ppt', 'pptx'].includes(this.fileType)) {
    this.category = 'Slide Decks';
  } else {
    this.category = 'Other';
  }
  next();
});

export default mongoose.model('Asset', assetSchema);
