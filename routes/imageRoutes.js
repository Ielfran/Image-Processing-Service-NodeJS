const express = require('express');
const router = express.Router();
const {
  uploadImage,
  listUserImages,
  getTransformedImage,
} = require('../controllers/imageController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Note: 'image' is the field name in the form-data
router.post('/upload', protect, upload.single('image'), uploadImage);
router.get('/', protect, listUserImages);

// This is the core transformation endpoint
router.get('/:id/transform', protect, getTransformedImage);

module.exports = router;
