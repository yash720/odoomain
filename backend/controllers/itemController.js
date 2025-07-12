const ClothingItem = require('../models/ClothingItem');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const calculatePointsForItem = require('../utils/calculatePointsForItem');
const PointsHistory = require('../models/PointsHistory');

// @desc    Create new clothing item
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
  try {
    console.log('DEBUG createItem req.body:', req.body);
    console.log('DEBUG createItem req.files:', req.files);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
    } else if (req.body.images && Array.isArray(req.body.images)) {
      images = req.body.images;
    } else if (req.body.images && typeof req.body.images === 'string') {
      // If sent as a single string (not array)
      images = [req.body.images];
    }

    const {
      title,
      description,
      category,
      type,
      size,
      condition,
      tags,
      pointValue,
      brand,
      originalPrice
    } = req.body;

    // Parse tags if sent as a string
    let tagsArray = [];
    if (Array.isArray(tags)) {
      tagsArray = tags;
    } else if (typeof tags === 'string' && tags.length > 0) {
      tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    // Ensure images are present and are valid URLs
    if (!images || !Array.isArray(images) || images.length === 0 || !images.every(url => typeof url === 'string' && url.startsWith('http'))) {
      return res.status(400).json({ success: false, message: 'Images must be an array of valid URLs (uploaded to Cloudinary)' });
    }

    const item = new ClothingItem({
      title,
      description,
      images,
      category,
      type,
      size,
      condition,
      tags: tagsArray,
      pointValue,
      brand,
      originalPrice,
      uploaderId: req.user._id,
      uploaderName: req.user.name,
      uploaderAvatar: req.user.avatar
    });

    await item.save();

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: {
        item
      }
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get all items with filters
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      condition,
      size,
      minPoints,
      maxPoints,
      sortBy = 'createdAt',
      brand
    } = req.query;

    const filters = {};

    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) filters.category = category;
    if (condition) filters.condition = condition;
    if (size) filters.size = size;
    if (brand) filters.brand = { $regex: brand, $options: 'i' };
    if (minPoints) filters.pointValue = { $gte: parseInt(minPoints) };
    if (maxPoints) {
      filters.pointValue = filters.pointValue || {};
      filters.pointValue.$lte = parseInt(maxPoints);
    }

    // Only show approved and available items to public
    filters.status = 'approved';
    filters.isAvailable = true;

    const sortOptions = {};
    if (sortBy === 'price') sortOptions.pointValue = 1;
    else if (sortBy === 'price-desc') sortOptions.pointValue = -1;
    else if (sortBy === 'newest') sortOptions.createdAt = -1;
    else if (sortBy === 'oldest') sortOptions.createdAt = 1;
    else if (sortBy === 'popular') sortOptions.views = -1;
    else sortOptions.createdAt = -1;

    const items = await ClothingItem.find(filters)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('uploaderId', 'name avatar rating');

    const total = await ClothingItem.countDocuments(filters);

    res.json({
      success: true,
      data: {
        items,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Public
const getItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await ClothingItem.findById(id)
      .populate('uploaderId', 'name avatar rating totalSwaps')
      .populate('approvedBy', 'name');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Increment views
    await item.incrementViews();

    res.json({
      success: true,
      data: {
        item
      }
    });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
const updateItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    const item = await ClothingItem.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check ownership or admin status
    if (item.uploaderId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item'
      });
    }

    // Reset approval status if item is modified
    if (!req.user.isAdmin) {
      updateData.status = 'pending';
      updateData.approvedBy = null;
      updateData.approvedAt = null;
      updateData.rejectionReason = null;
    }

    const updatedItem = await ClothingItem.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: {
        item: updatedItem
      }
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await ClothingItem.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check ownership or admin status
    if (item.uploaderId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item'
      });
    }

    await ClothingItem.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get user's items
// @route   GET /api/items/my-items
// @access  Private
const getMyItems = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filters = { uploaderId: req.user._id };
    if (status) filters.status = status;

    const items = await ClothingItem.find(filters)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ClothingItem.countDocuments(filters);

    res.json({
      success: true,
      data: {
        items,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get my items error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get featured items
// @route   GET /api/items/featured
// @access  Public
const getFeaturedItems = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const items = await ClothingItem.getFeaturedItems(parseInt(limit));

    res.json({
      success: true,
      data: {
        items
      }
    });
  } catch (error) {
    console.error('Get featured items error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Approve item (Admin only)
// @route   PUT /api/items/:id/approve
// @access  Private/Admin
const approveItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await ClothingItem.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Get uploader
    const uploader = await User.findById(item.uploaderId);
    if (!uploader || uploader.isAdmin) {
      return res.status(400).json({ success: false, message: 'Invalid uploader' });
    }

    // Check if first upload
    const isFirstUpload = (uploader.totalUploads || 0) === 0;

    // Calculate points and breakdown
    const { totalPoints, breakdown } = calculatePointsForItem({ item, user: uploader, isFirstUpload });

    // Update item with breakdown fields
    item.status = 'approved';
    item.approvedBy = req.user._id;
    item.approvedAt = new Date();
    item.baseCategoryValue = breakdown.baseCategoryValue;
    item.itemQualityScore = breakdown.itemQualityScore;
    item.demandWeight = breakdown.demandWeight;
    item.conditionBonus = breakdown.conditionBonus;
    item.trustBoost = breakdown.trustBoost;
    item.firstUploadBonus = breakdown.firstUploadBonus;
    item.campaignBonus = breakdown.campaignBonus;
    item.penalties = breakdown.penalties;
    item.pointsBreakdown = breakdown;
    item.totalPointsGiven = totalPoints;
    item.pointValue = totalPoints;
    await item.save();

    // Update uploader's points, trust, and uploads
    uploader.points += totalPoints;
    uploader.totalUploads = (uploader.totalUploads || 0) + 1;
    uploader.trustScore = breakdown.trustBoost;
    await uploader.save();

    // Log to PointsHistory
    await PointsHistory.create({
      user_id: uploader._id,
      item_id: item._id,
      points_changed: totalPoints,
      action: 'item_approved',
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Item approved successfully',
      data: {
        item,
        pointsBreakdown: breakdown
      }
    });
  } catch (error) {
    console.error('Approve item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Reject item (Admin only)
// @route   PUT /api/items/:id/reject
// @access  Private/Admin
const rejectItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const item = await ClothingItem.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    await item.reject(reason);

    res.json({
      success: true,
      message: 'Item rejected successfully',
      data: {
        item
      }
    });
  } catch (error) {
    console.error('Reject item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get pending items (Admin only)
// @route   GET /api/items/pending
// @access  Private/Admin
const getPendingItems = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const items = await ClothingItem.find({ status: 'pending' })
      .populate('uploaderId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ClothingItem.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      data: {
        items,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get pending items error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Like an item (add to user's favorites)
// @route   POST /api/items/:id/like
// @access  Private
const likeItem = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.favorites.includes(id)) {
      return res.status(400).json({ success: false, message: 'Item already in favorites' });
    }
    user.favorites.push(id);
    await user.save();
    res.json({ success: true, message: 'Item added to favorites' });
  } catch (error) {
    console.error('Like item error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// @desc    Unlike an item (remove from user's favorites)
// @route   DELETE /api/items/:id/like
// @access  Private
const unlikeItem = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.favorites = user.favorites.filter(favId => favId.toString() !== id);
    await user.save();
    res.json({ success: true, message: 'Item removed from favorites' });
  } catch (error) {
    console.error('Unlike item error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// @desc    Get all favorite items for the user
// @route   GET /api/items/favorites
// @access  Private
const getFavoriteItems = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: { items: user.favorites } });
  } catch (error) {
    console.error('Get favorite items error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
  getMyItems,
  getFeaturedItems,
  approveItem,
  rejectItem,
  getPendingItems,
  likeItem,
  unlikeItem,
  getFavoriteItems
}; 