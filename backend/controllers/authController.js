const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id, expiresIn = '1h') => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
};

const registerUser = async (req, res) => {
    const { name, email, password, country } = req.body;

    if (!name || !email || !password || !country) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        name,
        email,
        password,
        country,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        country: user.country,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
};

const loginUser = async (req, res) => {
    const { email, password, rememberMe } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (user && (await user.matchPassword(password))) {
        const expiresIn = rememberMe ? '30d' : '1h';
        const token = generateToken(user._id, expiresIn);
  
        return res.json({
          _id: user.id,
          name: user.name,
          email: user.email,
          country: user.country,
          token,
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error during login' });
    }
  };
  

module.exports = {
    registerUser,
    loginUser,
};
