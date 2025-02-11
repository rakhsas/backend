import pg from 'pg';
const { Pool } = pg;
import 'dotenv/config';
import { logger } from '../logger/logger';

interface DatabaseConfig {
	user: string;
	host: string;
	database: string;
	password: string;
	port: number;
}

let config: pg.Pool | DatabaseConfig;

if (process.env.NODE_ENV === 'test') {
	config = require('../../tests/mockDatabase').default;
} else {
	config = new Pool({
		user: process.env.POSTGRES_USER,
		host: process.env.POSTGRES_CONTAINER_NAME,
		database: process.env.POSTGRES_DB,
		password: process.env.POSTGRES_PASSWORD,
		port: Number(process.env.POSTGRES_PORT),
	});
}

const connectWithRetry = async (maxRetries = 5, delay = 2000) => {
	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			await (config as pg.Pool).connect();
			// console.log('Connected to the database successfully.');
			logger.log('Connected to the database successfully.');
			return;
		} catch (error: any) {
			console.error(
				`Attempt ${attempt} - Failed to connect to the database:`,
				error.message,
			);
			if (attempt === maxRetries) {
				console.error('Max retries reached. Exiting application.');
				process.exit(1); // Exit the process with failure
			}
			console.error(`Waiting for ${delay / 1000}s before next retry...`);
			await new Promise(res => setTimeout(res, delay));
			delay *= 2; // Exponential backoff
		}
	}
};

export { config, connectWithRetry };
