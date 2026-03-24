const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, phone, password, role, workerDetails } = req.body;

    if (!name || !phone || !password) {
      res.status(400);
      return next(new Error('Please add all fields'));
    }

    // Check if user exists
    const userExists = await User.findOne({ phone });

    if (userExists) {
      res.status(400);
      return next(new Error('User already exists with this phone number'));
    }

    // Create user
    const user = await User.create({
      name,
      phone,
      password,
      role: role || 'customer',
    });

    if (user) {
      // If role is worker, create a worker profile
      if (user.role === 'worker') {
        if (!workerDetails || !workerDetails.category || !workerDetails.experience || !workerDetails.city || !workerDetails.area) {
          // Rollback user creation if worker details are missing
          await User.findByIdAndDelete(user._id);
          res.status(400);
          return next(new Error('Please provide category, experience, city, and area for worker profile'));
        }

        await WorkerProfile.create({
          user: user._id,
          category: workerDetails.category,
          experience: workerDetails.experience,
          location: {
            city: workerDetails.city,
            area: workerDetails.area
          }
        });
      }

      res.status(201).json({
        _id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400);
      return next(new Error('Invalid user data'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    // Check for user phone
    const user = await User.findOne({ phone }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401);
      return next(new Error('Invalid credentials'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let workerProfile = null;
    
    if (user.role === 'worker') {
      workerProfile = await WorkerProfile.findOne({ user: user.id });
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      workerProfile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser.id,
        name: updatedUser.name,
        phone: updatedUser.phone,
        role: updatedUser.role,
        token: generateToken(updatedUser._id, updatedUser.role),
      });
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};



module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateUserProfile,
};
