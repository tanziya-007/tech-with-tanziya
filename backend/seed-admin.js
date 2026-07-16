require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('./models');

async function seedAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  const exists = await User.findOne({ username: 'admin' });
  if (exists) {
    console.log('⚠️  Admin already exists');
  } else {
    await User.create({ username: 'admin', password: 'Angel123!' });
    console.log('✅ Admin user created');
  }
  await mongoose.disconnect();
}

seedAdmin().catch(console.error);
