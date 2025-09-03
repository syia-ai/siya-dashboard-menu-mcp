/**
 * Logging utility for Siya Dashboard Menu MCP
 */



import winston from 'winston';

const logLevel = process.env.LOG_LEVEL || 'info';

export const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'siya-dashboard-menu-mcp' },
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  ]
});

// Handle uncaught exceptions and rejections
logger.exceptions.handle(
  new winston.transports.File({
    filename: 'logs/exceptions.log'
  })
);

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});