import { STATUS_CODES } from "../utils/enums.js";

function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
    const message = err.message || "Something went wrong"
    console.error(`[${req.method}] ${req.url} - Error: ${message}`);
    res.status(statusCode).json({
        message,
        statusCode
    })
}


export default errorHandler;