import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username must be less than 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: false, // Optional for OAuth users
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    provider: {
      type: String,
      required: true,
      enum: ['local', 'google', 'github'],
      default: 'local',
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    darkMode: {
      type: Boolean,
      default: false,
    },
    xp: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastStreakUpdate: {
      type: Date,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    badges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge',
      },
    ],
    productivityLevel: {
      type: Number,
      default: 1,
    },
    preferences: {
      notificationsEnabled: { type: Boolean, default: true },
      theme: { type: String, default: 'light' },
    },
    moodLock: {
      isSetup: { type: Boolean, default: false },
      color: { type: String },
      emoji: { type: String },
      securityQuestion: { type: String },
      securityAnswer: { type: String },
      failedAttempts: { type: Number, default: 0 },
      lockoutUntil: { type: Date },
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
