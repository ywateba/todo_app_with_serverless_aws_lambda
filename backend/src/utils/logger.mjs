import winston from 'winston'

/**
 * Create a logger instance to write log messages in JSON format.
 *
 * @param loggerName - a name of a logger that will be added to all messages
 */
export function createLogger(loggerName) {
  return winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { name: loggerName },
    transports: [
      new winston.transports.Console()
    ]
  })
}

// Middleware function to attach logger to the context object
export const attachLoggerMiddleware = (handler, logger) => {
  return async (event, context) => {
      context.logger = logger;
      return handler(event, context);
  };
};
