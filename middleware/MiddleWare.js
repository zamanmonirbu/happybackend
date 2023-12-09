const jwt = require('jsonwebtoken');
const dotenv=require('dotenv');
require('dotenv').config();
const your_secret_key = process.env.SECRETE_KEY;

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ error: 'Access denied. Token not provided.' });
    }
  
    try {
      const decoded = jwt.verify(token, your_secret_key);
      req.userId = decoded.userId;
      req.email = decoded.email;
      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ error: 'Invalid token.' });
    }
  };

  module.exports=verifyToken;
  