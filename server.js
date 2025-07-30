      
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Create upload and transformed directories if they don't exist
const uploadsDir = path.join(__dirname, 'uploads');
const transformedDir = path.join(__dirname, 'transformed');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(transformedDir)) fs.mkdirSync(transformedDir);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);

// Serve transformed images statically
app.use('/images/transformed', express.static(path.join(__dirname, 'transformed')));

// Basic route for health check
app.get('/', (req, res) => {
  res.send('Image Processing Service API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


