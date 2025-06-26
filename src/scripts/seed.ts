// generateUsers.js
// const { Client } = require('pg');
// const {faker } =require('@faker-js/faker');
import { v4 as uuidv4 } from 'uuid';
import { Client } from 'pg';
import { faker } from '@faker-js/faker';
// const { v4: uuidv4 } = require('uuid');

// Set your DB credentials here:
const client = new Client({
	host: 'localhost',
	port: 5432,
	user: 'postgres',
	password: 'postgres',
	database: 'db',
});

const NUMBER_OF_USERS = 500;
const TAGS = Array.from({ length: 20 }, () => ({
	id: uuidv4(),
	name: faker.hacker.noun().toLowerCase(),
}));

async function seed() {
	try {
		await client.connect();
		console.log('Connected to database');

		// 1. Insert 20 tags
		console.log('Inserting tags...');
		const insertedTags: { id: string; name: string }[] = [];
		try {
			for (const tag of TAGS) {
				let result = await client.query(
					`INSERT INTO tags (id, name, is_custom, usage_count, category, created_at, updated_at)
					 VALUES ($1, $2, true, 0, 'Interest', NOW(), NOW())
					 ON CONFLICT (name) DO NOTHING RETURNING id`,
					[tag.id, tag.name],
				);

				if (result.rows.length > 0) {
					insertedTags.push({
						id: result.rows[0].id,
						name: tag.name,
					});
				} else {
					// Tag already existed → fetch the actual id
					const existing = await client.query(
						`SELECT id FROM tags WHERE name = $1`,
						[tag.name],
					);
					if (existing.rows.length > 0) {
						insertedTags.push({
							id: existing.rows[0].id,
							name: tag.name,
						});
					}
				}
			}
		} catch (err) {
			console.log('heree');
			throw err;
		}
		// 2. Insert 500 users, profiles, locations, and user_tags
		for (let i = 0; i < NUMBER_OF_USERS; i++) {
			const userId = uuidv4();
			const profileId = uuidv4();

			const firstName = faker.person.firstName();
			const lastName = faker.person.lastName();
			const email = faker.internet.email({ firstName, lastName });
			const username = faker.internet.username({ firstName, lastName });

			// Insert user
			await client.query(
				`INSERT INTO users (id, firstName, lastName, email, username, verified, created_at, updated_at)
				 VALUES ($1, $2, $3, $4, $5, TRUE, NOW(), NOW()) 
				ON CONFLICT (email) DO NOTHING;`,
				[userId, firstName, lastName, email, username],
			);

			// Insert profile
			await client.query(
				`INSERT INTO profile (id, gender, bio, pictures, mainpicture, birthdate, user_id, created_at, updated_at)
				 VALUES ($1, $2, $3, ARRAY[$4], $4, $5, $6, NOW(), NOW())`,
				[
					profileId,
					faker.helpers.arrayElement(['M', 'F']),
					faker.lorem.sentence(),
					faker.image.avatar(),
					faker.date.birthdate({ mode: 'age', min: 18, max: 40 }),
					userId,
				],
			);

			// Insert location
			await client.query(
				`INSERT INTO locations (user_id, address, lat, lng)
				 VALUES ($1, $2, $3, $4)`,
				[
					userId,
					faker.location.streetAddress(),
					faker.location.latitude({ max: 48, min: 30 }), // already number
					faker.location.longitude({ max: -1.0, min: -10.0 }), // already number
				],
			);

			// Assign 3 random tags
			const shuffled = faker.helpers.shuffle(insertedTags).slice(0, 3);
			for (const tag of shuffled) {
				await client.query(
					`INSERT INTO user_tags (user_id, tag_id, created_at)
					 VALUES ($1, $2, NOW())`,
					[userId, tag.id],
				);
			}

			if ((i + 1) % 50 === 0) {
				console.log(`✅ Inserted ${i + 1} users`);
			}
		}

		console.log('🎉 Seeding completed successfully!');
	} catch (err) {
		console.error('❌ Error seeding database:', err);
	} finally {
		await client.end();
		console.log('Disconnected from database');
	}
}

export default seed;
