const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const initDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Always delete and recreate admin user
    await User.deleteOne({ email: 'admin@rewear.com' });
    const adminUser = new User({
      email: 'admin@rewear.com',
      password: 'password',
      name: 'admin',
      gender: 'male',
      isAdmin: true,
      isVerified: true,
      points: 0,
      location: 'New York, NY',
      bio: 'Platform administrator ensuring quality and safety.',
      totalSwaps: 0,
      rating: 5.0
    });
    await adminUser.save();
    console.log('✅ Admin user created successfully');
    console.log('Email: admin@rewear.com');
    console.log('Password: password');

    // Always delete and recreate test user
    await User.deleteOne({ email: 'user@rewear.com' });
    const testUser = new User({
      email: 'user@rewear.com',
      password: 'user123456',
      name: 'Test User',
      isAdmin: false,
      isVerified: true,
      points: 10,
      location: 'Los Angeles, CA',
      bio: 'Fashion enthusiast passionate about sustainable living.',
      totalSwaps: 5,
      rating: 4.8
    });
    await testUser.save();
    console.log('✅ Test user created successfully');
    console.log('Email: user@rewear.com');
    console.log('Password: user123456');

    console.log('🎉 Database initialization completed!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the initialization
initDatabase(); 