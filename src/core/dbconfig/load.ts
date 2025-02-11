import fs from 'fs';
import path from 'path';
import { entityOrder } from './order';

async function loadEntities(__dirname: string) {
	const files = fs.readdirSync(__dirname);
	const entitiesToLoad = [];

	for (const file of files) {
		const isDirectory = fs
			.lstatSync(path.join(__dirname, file))
			.isDirectory();
		if (isDirectory) {
			await loadEntities(path.join(__dirname, file));
		} else {
			if (file.endsWith('.entity.ts')) {
				entitiesToLoad.push(file);
			}
		}
	}

	// Load entities in the specified order
	for (const entityFile of entityOrder) {
		if (entitiesToLoad.includes(entityFile)) {
			await import(path.join(__dirname, entityFile));
		}
	}

	// Load any remaining entities that were not specified in the order
	for (const entityFile of entitiesToLoad) {
		if (!entityOrder.includes(entityFile)) {
			await import(path.join(__dirname, entityFile));
		}
	}
}

export default loadEntities;
