const jwt = require('jsonwebtoken');

function authRequired(req, res, next) {
    const header = req.headers.authorization || '';
    const [type, token] = header.split(' ');

    if (type !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload; // { id, email, iat, exp }
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

function adminRequired(req, res, next) {
    const header = req.headers.authorization || '';
    const [type, token] = header.split(' ');

    if (type !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (payload.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        req.admin = payload;
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}
function counsellorRequired(req, res, next) {
    const header = req.headers.authorization || '';
    const [type, token] = header.split(' ');

    if (type !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (payload.role !== 'counsellor') {
            return res.status(403).json({ message: 'Counsellor access required' });
        }
        req.counsellor = payload;
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}
module.exports = { authRequired, adminRequired, counsellorRequired };
