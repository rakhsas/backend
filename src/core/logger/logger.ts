// import logger  from '@nestjs/common';

// export const logger = new Logger('App');

import winston from 'winston';

const logger = winston.createLogger({
	level: 'info', // Logging level
	format: winston.format.combine(
		winston.format.timestamp(), // Add timestamp
		winston.format.json(), // JSON format
	),
	transports: [
		// Log to the console
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(), // Add colors to console output
				winston.format.simple(), // Simple format for console
			),
		}),
		// Log to a file
		new winston.transports.File({
			filename: 'logs/error.log',
			level: 'error',
		}),
		new winston.transports.File({ filename: 'logs/combined.log' }),
	],
});

export default logger;
