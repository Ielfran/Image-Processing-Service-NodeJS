
      
const Image = require('../models/imageModel');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// @desc    Upload an image
// @route   POST /api/images/upload
// @access  Private
const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a file' });
  }

  try {
    const newImage = await Image.create({
      user: req.user._id,
      originalName: req.file.originalname,
      storageName: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ message: 'Error saving image to database', error: error.message });
  }
};

// @desc    List all images for the logged-in user
// @route   GET /api/images
// @access  Private
const listUserImages = async (req, res) => {
  try {
    const images = await Image.find({ user: req.user._id });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Retrieve and transform an image
// @route   GET /api/images/:id/transform
// @access  Private
const getTransformedImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Check if the logged-in user owns the image
    if (image.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to access this image' });
    }

    const {
      width, height, crop, rotate, flip, flop, grayscale, sepia, compress, format
    } = req.query;

    let transform = sharp(image.path);

    // Resize
    if (width || height) {
      transform = transform.resize(
        width ? parseInt(width) : null,
        height ? parseInt(height) : null
      );
    }
    // Crop
    if (crop) {
        const [c_width, c_height, left, top] = crop.split(',').map(Number);
        if(c_width && c_height && left >= 0 && top >= 0) {
            transform = transform.extract({ left, top, width: c_width, height: c_height });
        }
    }
    // Rotate
    if (rotate) transform = transform.rotate(parseInt(rotate));
    // Flip (vertical)
    if (flip === 'true') transform = transform.flip();
    // Flop (horizontal mirror)
    if (flop === 'true') transform = transform.flop();
    // Filters
    if (grayscale === 'true') transform = transform.grayscale();
    if (sepia === 'true') transform = transform.sepia();
    
    // Format and Compression
    const outputFormat = format || path.extname(image.originalName).slice(1);
    const quality = compress ? parseInt(compress) : 80; // Default quality 80

    switch (outputFormat.toLowerCase()) {
        case 'jpeg':
        case 'jpg':
            transform = transform.jpeg({ quality });
            break;
        case 'png':
            transform = transform.png({ quality });
            break;
        case 'webp':
            transform = transform.webp({ quality });
            break;
    }

    // Generate a unique filename for the transformed image
    const queryStr = JSON.stringify(req.query).replace(/[{"\:,}]/g, '');
    const transformedFilename = `${path.parse(image.storageName).name}-${queryStr}.${outputFormat}`;
    const outputPath = path.join(__dirname, '..', 'transformed', transformedFilename);

    // Check if the transformed image already exists
    if (fs.existsSync(outputPath)) {
        return res.sendFile(outputPath);
    }
    
    // Save the transformed image and send it
    await transform.toFile(outputPath);
    res.sendFile(outputPath);

  } catch (error) {
    console.error('Transformation Error:', error);
    res.status(500).json({ message: 'Error transforming image', error: error.message });
  }
};


module.exports = {
  uploadImage,
  listUserImages,
  getTransformedImage,
};


