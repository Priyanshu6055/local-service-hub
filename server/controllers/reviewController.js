const Review = require('../models/Review');
const WorkerProfile = require('../models/WorkerProfile');

// @desc    Add review
// @route   POST /api/reviews/:workerId
// @access  Private (Customer only)
const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const workerId = req.params.workerId;
    
    const worker = await WorkerProfile.findById(workerId);
    if (!worker) {
      res.status(404);
      return next(new Error('Worker not found'));
    }
    
    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      worker: workerId,
      customer: req.user.id
    });
    
    if (alreadyReviewed) {
      res.status(400);
      return next(new Error('You have already reviewed this worker'));
    }
    
    const review = await Review.create({
      worker: workerId,
      customer: req.user.id,
      rating: Number(rating),
      comment
    });
    
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a worker
// @route   GET /api/reviews/:workerId
// @access  Public
const getWorkerReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ worker: req.params.workerId }).populate('customer', 'name');
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addReview,
  getWorkerReviews
};
