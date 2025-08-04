const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');
const transformedDir = path.join(__dirname, 'transformed');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(transformedDir)) fs.mkdirSync(transformedDir);

app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);

app.use('/images/transformed', express.static(path.join(__dirname, 'transformed')));

app.get('/', (req, res) => {
  res.send('Image Processing Service API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
