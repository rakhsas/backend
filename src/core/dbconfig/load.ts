import fs from 'fs';
import path from 'path';
import { entityOrder } from './order';
import logger from '../logger/logger';

let entitiesToLoad: string[] = [];

async function loadEntities1(baseDir: string) {
	const files = fs.readdirSync(baseDir);

	for (const file of files) {
		const filePath = path.join(baseDir, file);
		const isDirectory = fs.lstatSync(filePath).isDirectory();

		if (isDirectory) {
			await loadEntities1(filePath);
		} else if (file.endsWith('.entity.ts')) {
			entitiesToLoad.push(filePath);
		}
	}
}

async function syncEntities() {
	// Sort entities based on predefined order
	entitiesToLoad = entitiesToLoad.sort((a, b) => {
		const aFileName = path.basename(a);
		const bFileName = path.basename(b);

		const aIndex = entityOrder.indexOf(aFileName);
		const bIndex = entityOrder.indexOf(bFileName);

		if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
		if (aIndex !== -1) return -1;
		if (bIndex !== -1) return 1;
		return 0;
	});

	logger.debug('🔄 Sorted entities to load:', entitiesToLoad);

	// Load and sync entities in the correct order
	for (const entityFile of entitiesToLoad) {
		try {
			logger.debug(`🔹 Loading entity: ${entityFile}`);

			// Convert to .js if necessary
			// const jsEntityPath = entityFile.replace(/\.ts$/, '.js');

			const module = await import(entityFile);

			if (module.default && module.default.syncTable) {
				await module.default.syncTable();
				logger.info(`✅ Synced table for: ${entityFile}`);
			} else {
				logger.warn(
					`⚠️ ${entityFile} does not export a valid syncTable function.`,
				);
			}
		} catch (err) {
			logger.error(
				`❌ Failed to load or sync entity: ${entityFile}`,
				err,
			);
		}
	}
}

async function loadEntities(__dirname: string) {
	await loadEntities1(__dirname);
	await syncEntities();
}

export default loadEntities;
