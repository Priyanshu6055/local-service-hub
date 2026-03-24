const express = require('express');
const router = express.Router();
const { getWorkers, getWorkerById, updateWorkerProfile } = require('../controllers/workerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getWorkers);
router.get('/:id', getWorkerById);
router.put('/dashboard', protect, authorize('worker'), updateWorkerProfile);

module.exports = router;
