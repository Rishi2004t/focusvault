import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function resetPassword(email, newPassword) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return;
    }

    user.password = newPassword;
    await user.save(); // This should trigger the pre('save') hook

    console.log(`Password for ${email} reset successfully to: ${newPassword}`);

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('Usage: node reset_password.js <email> <new_password>');
  process.exit(1);
}

resetPassword(email, password);
