const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkerProfile',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Please add a review text']
  }
}, {
  timestamps: true
});

// Prevent user from submitting more than one review per worker
reviewSchema.index({ worker: 1, customer: 1 }, { unique: true });

// Static method to get auth rating and save
reviewSchema.statics.getAverageRating = async function(workerId) {
  const obj = await this.aggregate([
    {
      $match: { worker: workerId }
    },
    {
      $group: {
        _id: '$worker',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  try {
    await this.model('WorkerProfile').findByIdAndUpdate(workerId, {
      averageRating: obj.length > 0 ? Math.round(obj[0].averageRating * 10) / 10 : 0,
      totalReviews: obj.length > 0 ? obj[0].totalReviews : 0
    });
  } catch (err) {
    console.error(err);
  }
}

// Call getAverageRating after save
reviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.worker);
});

// Call getAverageRating before remove
reviewSchema.pre('deleteOne', { document: true, query: false }, function() {
  this.constructor.getAverageRating(this.worker);
});

module.exports = mongoose.model('Review', reviewSchema);
