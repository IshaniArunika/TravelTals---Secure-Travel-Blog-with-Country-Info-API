const apiKeyService = require('../services/apiKeyService');

module.exports = async function (req, res, next) {
    const apiKey = req.header('x-api-key');

    if (!apiKey) {
        return res.status(401).json({ error: 'API key missing in headers' });
    }

    try {
        const user = await apiKeyService.validateKey(apiKey);
        if (!user) {
            return res.status(403).json({ error: 'Invalid API key' });
        }

        const limitReached = await apiKeyService.checkLimit(user.id, user.plan);
        if (limitReached) {
            return res.status(429).json({ error: `Daily limit reached for ${user.plan} plan` });
        }

        await apiKeyService.logUsage(user.id, apiKey, req.originalUrl);
        req.user = user; 
        next();

    } catch (err) {
        console.error('Middleware error:', err);
        res.status(500).json({ error: 'Server error in API key check' });
    }
};
