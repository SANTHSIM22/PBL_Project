
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';

const router = express.Router();

// Get all users for superadmin (excluding passwords)
router.get('/superadmin/users', async (req, res) => {
  try {
    // Optionally, add authentication/authorization for superadmin here
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper to create JWT
function createToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '6h' });
}

// Signup for buyer or seller
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role, phone } = req.body;
    if (!username || !email || !password || !role) return res.status(400).json({ error: 'Missing fields' });
    if (!['buyer', 'seller'].includes(role)) return res.status(400).json({ error: 'Invalid role' });

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(409).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
      // generate a short unique slug for seller profiles
      const slug = `${username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}-${crypto.randomBytes(4).toString('hex')}`;
      const user = new User({ username, email, password: hashed, role, phone, slug });
    await user.save();

  const token = createToken({ id: user._id, role: user.role, username: user.username });
  res.json({ user: { id: user._id, username: user.username, email: user.email, role: user.role, phone: user.phone, slug: user.slug }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get artisan by slug (public profile)
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const user = await User.findOne({ slug }, '-password');
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login for buyer/seller
router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) return res.status(400).json({ error: 'Missing fields' });

    const user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = createToken({ id: user._id, role: user.role, username: user.username });
  res.json({ user: { id: user._id, username: user.username, email: user.email, role: user.role, phone: user.phone, slug: user.slug }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Superadmin login — credentials stored in env vars (SUPERADMIN_USER / SUPERADMIN_PASS)
router.post('/superadmin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

    const adminUser = process.env.SUPERADMIN_USER;
    const adminPass = process.env.SUPERADMIN_PASS;
    if (!adminUser || !adminPass) return res.status(500).json({ error: 'Superadmin not configured' });

    if (username !== adminUser || password !== adminPass) return res.status(401).json({ error: 'Invalid superadmin credentials' });

    const token = createToken({ role: 'superadmin', username: adminUser });
    res.json({ user: { username: adminUser, role: 'superadmin' }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
