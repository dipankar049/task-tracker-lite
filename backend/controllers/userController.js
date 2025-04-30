const User = require('../models/User');
const Project = require('../models/Project');

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCurrentUser };
