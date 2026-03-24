const mongoose = require('mongoose');

const workerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: [true, 'Please add a service category (e.g. Plumber, Electrician)']
  },
  experience: {
    type: Number,
    required: [true, 'Please add years of experience']
  },
  location: {
    city: {
      type: String,
      required: true
    },
    area: {
      type: String,
      required: true
    },
    // For "Near Me" feature in the future
    coordinates: {
      type: [Number],
      index: '2dsphere',
      default: [0,0]
    }
  },
  description: {
    type: String,
    maxlength: 500
  },
  profileImage: {
    type: String,
    default: 'default.jpg'
  },
  portfolioImages: {
    type: [String],
    default: []
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  averageRating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WorkerProfile', workerProfileSchema);
