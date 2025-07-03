import xss from 'xss';

const sanitizeObject = (input) => {
    if (typeof input === 'string') {
        return xss(input);
    }

    if (Array.isArray(input)) {
        return input.map(item => sanitizeObject(item));
    }

    if (typeof input === 'object' && input !== null) {
        const sanitized = {};
        for (const key in input) {
            if (Object.prototype.hasOwnProperty.call(input, key)) {
                sanitized[key] = sanitizeObject(input[key]);
            }
        }
        return sanitized;
    }

    return input;
};

const sanitizeMiddleware = (req, res, next) => {
    if (req.body) req.body = sanitizeObject(req.body);
    if (req.query) req.query = sanitizeObject(req.query);
    if (req.params) req.params = sanitizeObject(req.params);
    next();
};

export default sanitizeMiddleware;