const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');
const {
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
} = require('../controllers/itemController');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const router = express.Router();

// Cloudinary storage config for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'rewear/items',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});
const upload = multer({ storage });

// Validation middleware
const createItemValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('images')
    .custom((value, { req }) => {
      // Accept both array and string
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'string') return value.length > 0;
      return false;
    })
    .withMessage('At least one image is required'),
  body('images.*')
    .optional()
    .isURL()
    .withMessage('All images must be valid URLs'),
  body('category')
    .isIn(['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories', 'other'])
    .withMessage('Invalid category'),
  body('type')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Type must be between 2 and 50 characters'),
  body('size')
    .isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size', 'Other'])
    .withMessage('Invalid size'),
  body('condition')
    .isIn(['new', 'like-new', 'good', 'fair'])
    .withMessage('Invalid condition'),
  body('tags')
    .optional()
    .custom((value, { req }) => {
      if (!value) return true;
      if (Array.isArray(value)) return true;
      if (typeof value === 'string') return true;
      return false;
    })
    .withMessage('Tags must be an array or a comma-separated string'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Each tag must be between 1 and 20 characters'),
  body('brand')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Brand cannot exceed 50 characters'),
  body('originalPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Original price must be a positive number')
];

const updateItemValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('images')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one image is required'),
  body('images.*')
    .optional()
    .isURL()
    .withMessage('All images must be valid URLs'),
  body('category')
    .optional()
    .isIn(['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories', 'other'])
    .withMessage('Invalid category'),
  body('type')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Type must be between 2 and 50 characters'),
  body('size')
    .optional()
    .isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size', 'Other'])
    .withMessage('Invalid size'),
  body('condition')
    .optional()
    .isIn(['new', 'like-new', 'good', 'fair'])
    .withMessage('Invalid condition'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Each tag must be between 1 and 20 characters'),
  body('pointValue')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('Point value must be between 1 and 10000'),
  body('brand')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Brand cannot exceed 50 characters'),
  body('originalPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Original price must be a positive number'),
  body('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable must be a boolean'),
  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean')
];

const rejectItemValidation = [
  body('reason')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Rejection reason must be between 5 and 500 characters')
];

// Public routes
router.get('/', optionalAuth, getItems);
router.get('/featured', getFeaturedItems);
router.get('/:id', optionalAuth, getItem);

// Protected routes
router.post(
  '/',
  authenticateToken,
  upload.array('images', 5),
  (req, res, next) => {
    console.log('DEBUG middleware req.body:', req.body);
    console.log('DEBUG middleware req.files:', req.files);
    // Convert multer files to images array of URLs for validation
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => file.path);
    }
    // Convert tags string to array if needed
    if (typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    next();
  },
  createItemValidation,
  createItem
);
router.post('/upload', authenticateToken, upload.array('images', 5), async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    const urls = files.map(file => file.path);
    res.json({ success: true, message: 'Images uploaded', data: { urls } });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ success: false, message: 'Image upload failed' });
  }
});
router.put('/:id', authenticateToken, updateItemValidation, updateItem);
router.delete('/:id', authenticateToken, deleteItem);
router.get('/my-items', authenticateToken, getMyItems);

// Favorites (like/unlike) routes
router.post('/:id/like', authenticateToken, likeItem);
router.delete('/:id/like', authenticateToken, unlikeItem);
router.get('/favorites', authenticateToken, getFavoriteItems);

// Admin routes
router.get('/pending', authenticateToken, requireAdmin, getPendingItems);
router.put('/:id/approve', authenticateToken, requireAdmin, approveItem);
router.put('/:id/reject', authenticateToken, requireAdmin, rejectItemValidation, rejectItem);

module.exports = router; 