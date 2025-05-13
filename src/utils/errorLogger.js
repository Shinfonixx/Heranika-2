const winston = require('winston');

const logger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log' }),
        new winston.transports.Console()
    ]
});

function logError(error, context = {}) {
    logger.error({
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString()
    });
}

module.exports = { logError };