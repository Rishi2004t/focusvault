import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function checkUser(email, password) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('User found:', user.username);
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

// Replace with actual email/password you want to test
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('Usage: node test_auth.js <email> <password>');
  process.exit(1);
}

checkUser(email, password);
