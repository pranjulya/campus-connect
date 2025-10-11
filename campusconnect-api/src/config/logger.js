import winston from 'winston';
import env from './env.js';

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    return {
      ...info,
      message: info.message,
      stack: info.stack,
    };
  }

  return info;
});

const consoleFormat = winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
  const metaKeys = Object.keys(meta);
  const metaString = metaKeys.length ? ` ${JSON.stringify(meta)}` : '';

  return `${timestamp} ${level}: ${stack || message}${metaString}`;
});

const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    enumerateErrorFormat(),
    winston.format.splat(),
    winston.format.timestamp()
  ),
  transports: [
    new winston.transports.Console({
      format:
        env.NODE_ENV === 'production'
          ? winston.format.combine(winston.format.timestamp(), winston.format.json())
          : winston.format.combine(winston.format.colorize(), winston.format.timestamp(), consoleFormat),
    }),
  ],
});

logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

export default logger;
