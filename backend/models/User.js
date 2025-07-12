const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  avatar: {
    type: String,
    default: null
  },
  points: {
    type: Number,
    default: 10,
    min: [0, 'Points cannot be negative']
  },
  trustScore: {
    type: Number,
    default: 1.0,
    min: [0, 'Trust score cannot be negative']
  },
  spamReports: {
    type: Number,
    default: 0,
    min: [0, 'Spam reports cannot be negative']
  },
  totalUploads: {
    type: Number,
    default: 0,
    min: [0, 'Total uploads cannot be negative']
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  totalSwaps: {
    type: Number,
    default: 0,
    min: [0, 'Total swaps cannot be negative']
  },
  rating: {
    type: Number,
    default: 5.0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'other'
  },
  age: {
    type: Number,
    min: 10,
    max: 120
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ClothingItem' }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ isAdmin: 1 });
userSchema.index({ createdAt: -1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { 
      id: this._id, 
      email: this.email, 
      isAdmin: this.isAdmin 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Public profile method (excludes sensitive data)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Add points method
userSchema.methods.addPoints = function(points) {
  if (this.isAdmin) return this; // Admins do not have points
  this.points += points;
  return this.save();
};

// Remove points method
userSchema.methods.removePoints = function(points) {
  if (this.isAdmin) return this; // Admins do not have points
  if (this.points >= points) {
    this.points -= points;
    return this.save();
  }
  throw new Error('Insufficient points');
};

module.exports = mongoose.model('User', userSchema); 