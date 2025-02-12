import winston from 'winston';
import colors from 'colors/safe';

const customFormat = winston.format.printf(({level, message, timestamp}) =>{
    const color = {
        info: colors.blue,
        error: colors.red,
        warn: colors.yellow,
        debug: colors.magenta
    }[level] || colors.white;

    return `${colors.gray(timestamp)} [${color(level.toUpperCase())}]
    ${message}`;
});

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}),
        customFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error'},
            new winston.transports.File({ filename: 'logs/combined.log'})
        )
    ]
});

export default logger;