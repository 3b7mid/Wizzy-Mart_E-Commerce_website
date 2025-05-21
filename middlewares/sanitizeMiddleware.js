import xss from 'xss';

const sanitizeObject = (obj) => {
    if (typeof obj === 'string') {
        return xss(obj);
    } else if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
    } else if (typeof obj === 'object' && obj !== null) {
        const clean = {};
        for (const key in obj) {
            clean[key] = sanitizeObject(obj[key]);
        }
        return clean;
    } else {
        return obj;
    }
};

const sanitizeMiddleware = (req, res, next) => {
    if (req.body) req.body = sanitizeObject(req.body);
    if (req.query) req.query = sanitizeObject(req.query);
    if (req.params) req.params = sanitizeObject(req.params);
    next();
};

export default sanitizeMiddleware;