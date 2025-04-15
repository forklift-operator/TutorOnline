import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.headers['token'];
    if (!token) return res.status(403).json({ error: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

const checkRole = (role) => (req, res, next) => {
    if (req.user.role !== role) {
        return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }
    next();
};

export { verifyToken, checkRole };