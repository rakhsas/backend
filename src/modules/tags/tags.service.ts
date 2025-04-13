import { repository } from '../../repository';

export const getTags = async () => {
	try {
		return await repository.findAll('tags');
	} catch (err: any) {
		throw err;
	}
};

export const saveUserTags = async (body: any) => {
	const { userId, tags } = body;
	if (!userId || !Array.isArray(tags)) {
		throw new Error('Invalid payload: userId and tags array are required');
	}

	try {
		for (const tag of tags) {
			// Skip if tag has no name (invalid tag)
			if (!tag.name) {
				console.warn('Skipping tag with no name');
				continue;
			}

			// 1️⃣ First check if user already has this tag
			const userHasTag = await repository.executeSqlQuery(
				`SELECT 1 FROM user_tags 
                 WHERE user_id = $1 
                 AND tag_id = $2 
                 LIMIT 1`,
				[userId, tag.id],
			);

			if (userHasTag.rows.length > 0) {
				console.log(
					`User ${userId} already has tag ${tag.name} (ID: ${tag.id})`,
				);
				continue; // Skip to next tag
			}

			let tagId = tag.id;

			// 2️⃣ Handle new custom tags
			if (!tagId && tag.is_custom) {
				// Check if identical custom tag exists
				const existingTag = await repository.executeSqlQuery(
					`SELECT id FROM tags 
                     WHERE name = $1 
                     AND is_custom = true 
                     LIMIT 1`,
					[tag.name],
				);

				tagId = existingTag.rows[0]?.id;

				if (!tagId) {
					// Create new custom tag
					const insertResult = await repository.save('tags', {
						name: tag.name,
						category: tag.category || 'Custom',
						is_custom: true,
						usage_count: 1,
						created_at: new Date(),
						updated_at: new Date(),
					});
					tagId = insertResult.id;
					console.log(
						`Created new custom tag: ${tag.name} (ID: ${tagId})`,
					);
				} else {
					// Increment usage for existing custom tag
					await repository.executeSqlQuery(
						`UPDATE tags 
                         SET usage_count = usage_count + 1,
                             updated_at = CURRENT_TIMESTAMP
                         WHERE id = $1`,
						[tagId],
					);
					console.log(
						`Incremented usage for existing custom tag: ${tag.name} (ID: ${tagId})`,
					);
				}
			}
			// 3️⃣ Handle existing tags (non-custom)
			else if (tagId) {
				// Verify tag exists
				const tagExists = await repository.executeSqlQuery(
					`SELECT 1 FROM tags WHERE id = $1 LIMIT 1`,
					[tagId],
				);

				if (tagExists.rows.length === 0) {
					console.warn(`Tag ID ${tagId} not found, skipping`);
					continue;
				}

				// Increment usage count
				await repository.executeSqlQuery(
					`UPDATE tags 
                     SET usage_count = usage_count + 1,
                         updated_at = CURRENT_TIMESTAMP
                     WHERE id = $1`,
					[tagId],
				);
				console.log(
					`Incremented usage for existing tag: ${tag.name} (ID: ${tagId})`,
				);
			}

			// 4️⃣ Create user-tag association if it doesn't exist
			if (tagId) {
				await repository.executeSqlQuery(
					`INSERT INTO user_tags (user_id, tag_id, created_at)
                     VALUES ($1, $2, CURRENT_TIMESTAMP)`,
					[userId, tagId],
				);
				console.log(
					`Associated user ${userId} with tag ${tag.name} (ID: ${tagId})`,
				);
			}
		}

		return { success: true, message: 'Tags processed successfully' };
	} catch (err: any) {
		console.error('Error in saveUserTags:', {
			error: err.message,
			stack: err.stack,
			userId,
			tags,
		});
		throw new Error('Failed to process user tags');
	}
};
export const getUserTags = async (userId: string) => {
	try {
		const query = `
			SELECT t.id, t.name, t.category, t.is_custom
			FROM user_tags ut
			JOIN tags t ON ut.tag_id = t.id
			WHERE ut.user_id = $1
		`;
		const result = await repository.executeSqlQuery(query, [userId]);
		return result.rows;
	} catch (err: any) {
		console.error(
			'❌ Erreur lors de la récupération des tags utilisateur:',
			err,
		);
		throw new Error('Échec lors de la récupération des tags utilisateur');
	}
};
