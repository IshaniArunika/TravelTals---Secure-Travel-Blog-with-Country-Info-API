const { verifyToken } = require('../config/jwt');

const authenticateJWT = (req, res, next) => {
  // 1. Try to get token from HttpOnly cookie
  let token = req.cookies?.jwt;

  // 2. If not in cookie, try to get from Authorization header
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 3. If still no token, reject
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No Token Provided' });
  }

  // 4. Verify token
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or Expired Token' });
  }

  req.user = decoded; // Attach decoded payload
  next();
};

module.exports = { authenticateJWT };
