import chokidar from 'chokidar';
import logger from './logger'; // Assuming logger is set up as in your code

// Initialize watcher with options if needed
const watcher = chokidar.watch('./src', {
	ignored: /(^|[\/\\])\../, // Ignore dotfiles
	persistent: true, // Keep the process running
});

// Watch for file changes and log them
watcher.on('change', (path: string) => {
	logger.info(`File changed: ${path}`);
});

watcher.on('add', (path: string) => {
	logger.info(`File added: ${path}`);
});

watcher.on('unlink', (path: string) => {
	logger.info(`File removed: ${path}`);
});

watcher.on('error', (error: any) => {
	logger.error('Watcher error', error);
});
