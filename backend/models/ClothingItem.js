const mongoose = require('mongoose');

const clothingItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  images: [{
    type: String,
    required: [true, 'At least one image is required']
  }],
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories', 'other']
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    trim: true
  },
  size: {
    type: String,
    required: [true, 'Size is required'],
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size', 'Other']
  },
  condition: {
    type: String,
    required: [true, 'Condition is required'],
    enum: ['new', 'like-new', 'good', 'fair']
  },
  tags: [{
    type: String,
    trim: true
  }],
  uploaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader ID is required']
  },
  uploaderName: {
    type: String,
    required: [true, 'Uploader name is required']
  },
  uploaderAvatar: {
    type: String
  },
  pointValue: {
    type: Number,
    required: [true, 'Point value is required'],
    min: [1, 'Point value must be at least 1']
  },
  baseCategoryValue: {
    type: Number
  },
  itemQualityScore: {
    type: Number
  },
  demandWeight: {
    type: Number
  },
  conditionBonus: {
    type: Number
  },
  trustBoost: {
    type: Number
  },
  firstUploadBonus: {
    type: Number
  },
  campaignBonus: {
    type: Number
  },
  penalties: {
    type: Number
  },
  pointsBreakdown: {
    type: Object
  },
  totalPointsGiven: {
    type: Number
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'claimed'],
    default: 'pending'
  },
  points_given: {
    type: Number,
    min: [1, 'Points given must be at least 1']
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  claimedAt: {
    type: Date,
    default: null
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  brand: {
    type: String,
    trim: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    maxlength: [500, 'Rejection reason cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
clothingItemSchema.index({ uploaderId: 1 });
clothingItemSchema.index({ status: 1 });
clothingItemSchema.index({ category: 1 });
clothingItemSchema.index({ isAvailable: 1 });
clothingItemSchema.index({ createdAt: -1 });
clothingItemSchema.index({ pointValue: 1 });
clothingItemSchema.index({ tags: 1 });

// Virtual for time since creation
clothingItemSchema.virtual('timeSinceCreation').get(function() {
  return Date.now() - this.createdAt;
});

// Method to increment views
clothingItemSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to increment likes
clothingItemSchema.methods.incrementLikes = function() {
  this.likes += 1;
  return this.save();
};

// Method to approve item
clothingItemSchema.methods.approve = function(adminId) {
  this.status = 'approved';
  this.approvedBy = adminId;
  this.approvedAt = new Date();
  return this.save();
};

// Method to reject item
clothingItemSchema.methods.reject = function(reason) {
  this.status = 'rejected';
  this.rejectionReason = reason;
  return this.save();
};

// Static method to get featured items
clothingItemSchema.statics.getFeaturedItems = function(limit = 10) {
  return this.find({ 
    isFeatured: true, 
    isAvailable: true, 
    status: 'approved' 
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

// Static method to search items
clothingItemSchema.statics.searchItems = function(searchTerm, filters = {}) {
  const query = {
    status: 'approved',
    isAvailable: true,
    ...filters
  };

  if (searchTerm) {
    query.$or = [
      { title: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { tags: { $in: [new RegExp(searchTerm, 'i')] } },
      { brand: { $regex: searchTerm, $options: 'i' } }
    ];
  }

  return this.find(query).sort({ createdAt: -1 });
};

module.exports = mongoose.model('ClothingItem', clothingItemSchema); 