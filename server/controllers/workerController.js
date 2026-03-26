const WorkerProfile = require('../models/WorkerProfile');
const User = require('../models/User');

// @desc    Get all workers
// @route   GET /api/workers
// @access  Public
const getWorkers = async (req, res, next) => {
  try {
    const { category, city, area, isUrgent, name } = req.query;

    // Helper to create flexible regex ignoring spacing and special characters
    const buildFuzzyRegex = (str) => {
      const cleanStr = str.replace(/[^a-zA-Z0-9]/g, '');
      return { $regex: cleanStr.split('').join('\\s*'), $options: 'i' };
    };

    // Build query
    let query = {};

    if (name) {
      const userRegex = buildFuzzyRegex(name);
      const matchingUsers = await User.find({ name: userRegex, role: 'worker' }).select('_id');
      query.user = { $in: matchingUsers.map(u => u._id) };
    }

    if (category) {
      query.category = buildFuzzyRegex(category);
    }
    if (city) {
      const locationRegex = buildFuzzyRegex(city);
      query.$or = [
        { 'location.city': locationRegex },
        { 'location.area': locationRegex }
      ];
    }
    // We can leave area check if someone hits the API directly with &area=
    if (area && !city) {
      query['location.area'] = buildFuzzyRegex(area);
    }
    if (isUrgent === 'true') {
      query.isAvailable = true;
    }

    const workers = await WorkerProfile.find(query).populate('user', 'name phone');
    res.status(200).json(workers);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single worker
// @route   GET /api/workers/:id
// @access  Public
const getWorkerById = async (req, res, next) => {
  try {
    const worker = await WorkerProfile.findById(req.params.id).populate('user', 'name phone');

    if (!worker) {
      res.status(404);
      return next(new Error('Worker not found'));
    }

    res.status(200).json(worker);
  } catch (error) {
    next(error);
  }
};

// @desc    Update worker profile
// @route   PUT /api/workers/dashboard
// @access  Private (Worker only)
const updateWorkerProfile = async (req, res, next) => {
  try {
    const { 
      description, 
      isAvailable, 
      category, 
      experience, 
      city, 
      area, 
      coordinates, 
      profileImage, 
      portfolioImages 
    } = req.body;

    let workerProfile = await WorkerProfile.findOne({ user: req.user.id });

    if (!workerProfile) {
      res.status(404);
      return next(new Error('Worker profile not found'));
    }

    // Prepare fields to update
    if (description !== undefined) workerProfile.description = description;
    if (isAvailable !== undefined) workerProfile.isAvailable = isAvailable;
    if (category) workerProfile.category = category;
    if (experience) workerProfile.experience = experience;
    if (city) workerProfile.location.city = city;
    if (area) workerProfile.location.area = area;
    if (coordinates) workerProfile.location.coordinates = coordinates;
    if (profileImage) workerProfile.profileImage = profileImage;
    if (portfolioImages) workerProfile.portfolioImages = portfolioImages;

    await workerProfile.save();

    res.status(200).json(workerProfile);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWorkers,
  getWorkerById,
  updateWorkerProfile
};
