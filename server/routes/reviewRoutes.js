const express = require('express');
const router = express.Router();
const { addReview, getWorkerReviews } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/:workerId', protect, authorize('customer'), addReview);
router.get('/:workerId', getWorkerReviews);

module.exports = router;
