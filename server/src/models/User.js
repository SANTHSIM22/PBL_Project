import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  slug: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ['buyer', 'seller'], required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
