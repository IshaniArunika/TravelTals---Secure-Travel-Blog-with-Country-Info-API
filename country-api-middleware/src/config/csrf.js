const Tokens = require('csrf');
const tokens = new Tokens();

const generateCSRFToken = () => {
    return tokens.create(process.env.CSRF_SECRET || 'default_csrf_secret_key');
};

const verifyCSRFToken = (token) => {
    return tokens.verify(process.env.CSRF_SECRET || 'default_csrf_secret_key', token);
};

module.exports = { generateCSRFToken, verifyCSRFToken };
