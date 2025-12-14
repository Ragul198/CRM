const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ success: false, message:'Not logged in' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ success: false, message:'User not found' });
    }

    next();
  } catch {
    res.status(401).json({ success: false, message:'Invalid token' });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message:'Forbidden' });
    }
    next();
  };
};
