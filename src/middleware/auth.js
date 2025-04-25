const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Middleware to authenticate users via JWT token
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format

    if (!token) {
      return res.status(401).json({ message: 'Authentication token is required' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add user to request object
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

/**
 * Middleware to check if user is a trainer
 */
const isTrainer = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.userId);
    
    if (!user || !user.is_trainer) {
      return res.status(403).json({ message: 'Access denied. Trainer privileges required.' });
    }
    
    next();
  } catch (error) {
    console.error('Trainer verification error:', error);
    res.status(500).json({ message: 'Server error verifying trainer status' });
  }
};

module.exports = {
  authenticateToken,
  isTrainer
}; 