import chokidar from 'chokidar';
import { logger } from './logger'; // Assuming logger is set up as in your code

// Initialize watcher with options if needed
const watcher = chokidar.watch('./src', {
	ignored: /(^|[\/\\])\../, // Ignore dotfiles
	persistent: true, // Keep the process running
});

// Watch for file changes and log them
watcher.on('change', (path: string) => {
	logger.log(`File changed: ${path}`);
});

watcher.on('add', (path: string) => {
	logger.log(`File added: ${path}`);
});

watcher.on('unlink', (path: string) => {
	logger.log(`File removed: ${path}`);
});

watcher.on('error', (error: Error) => {
	logger.error('Watcher error', error);
});
