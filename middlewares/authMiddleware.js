const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  // Get the token from the request headers
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token not provided' });
  }

  try {
    // Verify the token and extract the user's ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Fetch the user from the database based on the ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Attach the user data to the request object
    req.user = user;
    next(); // Continue to the next middleware/route
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
