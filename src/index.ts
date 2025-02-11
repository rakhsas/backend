import 'reflect-metadata'; // Required for decorators if you are using them
import { logger } from './core/logger/logger';
import { connectWithRetry } from './core/dbconfig/config';
import './core/logger/file-watcher';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
import loadEntities from './core/dbconfig/load';
import path from 'path';
import express from 'express';
import routes from './shared/routes';

import dotenv from 'dotenv';

async function bootstrap() {
	
	try {
		const app = express();
		app.use(express.json());
		dotenv.config();

		logger.log('Starting application...');
		
		try {
			routes(app);
		} catch (err: any) {
			throw new Error(`Failed to setup routes: ${err.message}`);
		}

		try {
			await connectWithRetry();
		} catch (err: any) {
			throw new Error(`Database connection failed: ${err.message}`);
		}

		try {
			loadEntities(__dirname);
		} catch (err: any) {
			throw new Error(`Failed to load entities: ${err.message}`);
		}

		// Start the server and listen on a specific port
		const port = process.env.PORT || 3000;
		app.listen(port, () => {
			logger.log(`Server is running on port ${port}`);
		});

		logger.log('Application initialized successfully!');
	} catch (error: any) {
		logger.error({
			message: 'Failed to start the application',
			errorName: error.name,
			errorMessage: error.message,
			stack: error.stack,
		});
		process.exit(1); // Exit the process in case of a critical error
	}
}

bootstrap();
