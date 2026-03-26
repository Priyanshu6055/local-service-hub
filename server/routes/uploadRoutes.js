const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'job-now',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
  },
});

const upload = multer({ storage });

router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'Please upload a file' });
  }
  res.send({
    message: 'Image Uploaded',
    image: req.file.path,
  });
});

module.exports = router;
