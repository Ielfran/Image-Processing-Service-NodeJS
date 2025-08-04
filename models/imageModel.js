const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  originalName: { type: String, required: true },
  storageName: { type: String, required: true }, // The unique name used for storing the file
  path: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
}, { timestamps: true });

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;
