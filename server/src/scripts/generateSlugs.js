import mongoose from 'mongoose';
import dotenv from 'dotenv';
import crypto from 'crypto';
import User from '../models/User.js';

dotenv.config();

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pbl_project';

function makeSlug(username) {
  const base = (username || 'user').replace(/[^a-zA-Z0-9]/g, '').toLowerCase().slice(0, 20) || 'user';
  return `${base}-${crypto.randomBytes(4).toString('hex')}`;
}

async function run() {
  try {
    await mongoose.connect(MONGO, { autoIndex: true });
    console.log('Connected to MongoDB');

    const users = await User.find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }] });
    console.log(`Found ${users.length} users without slugs`);

    let updated = 0;
    for (const user of users) {
      let slug;
      // ensure unique slug
      do {
        slug = makeSlug(user.username || user.email || 'user');
        // eslint-disable-next-line no-await-in-loop
      } while (await User.findOne({ slug }));

      user.slug = slug;
      // eslint-disable-next-line no-await-in-loop
      await user.save();
      updated += 1;
      console.log(`Updated user ${user._id} -> slug=${slug}`);
    }

    console.log(`Finished. Updated ${updated} users.`);
    process.exit(0);
  } catch (err) {
    console.error('Error generating slugs', err);
    process.exit(1);
  }
}

run();
