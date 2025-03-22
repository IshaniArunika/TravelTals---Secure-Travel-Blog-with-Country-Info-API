const { verifyCsrfToken } = require('../config/csrf');

const csrfProtection = (req, res, next) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next(); // CSRF is only needed for state-changing requests (POST, PUT, DELETE)
    }

    const token = req.headers['x-csrf-token'];
    const cookieToken = req.cookies['csrf-token'];

    if (!token || !cookieToken || token !== cookieToken || !verifyCsrfToken(token, process.env.CSRF_SECRET)) {
        return res.status(403).json({ error: 'Invalid CSRF token' });
    }

    next();
};

module.exports = { csrfProtection };
