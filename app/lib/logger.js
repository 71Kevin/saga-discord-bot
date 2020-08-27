const winston = require('winston');
const moment = require('moment-timezone');

const customFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.simple(),
    winston.format.printf((info) => {
        const {
            timestamp,
            level,
            message
        } = info;
        
        const ts = moment().tz('America/Sao_Paulo').format('YYYY/MM/DD HH:mm:ss.SSS');
        return `${ts} [${level}]: ${message}`;
    }),
);

const winstonLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: customFormat
        })
    ]
});

const logger = {
    error: (message, ...args) => {
        winstonLogger.error(message);
    }, 
    warn: (message, ...args) => {
        winstonLogger.warn(message);
    }, 
    info: (message, ...args) => {
        winstonLogger.info(message);
    }, 
    debug: (message, ...args) => {
        winstonLogger.debug(message);
    }
}

module.exports = logger;
