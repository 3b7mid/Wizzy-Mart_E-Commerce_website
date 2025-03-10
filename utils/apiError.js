class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        if(!statusCode || typeof statusCode !== 'number') {
            throw new Error('Status Code must be a valid number');
        }

        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError;