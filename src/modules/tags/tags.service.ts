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
		// Get current user tags from database
		const currentTags = await repository.executeSqlQuery(
			`SELECT tag_id FROM user_tags WHERE user_id = $1`,
			[userId],
		);
		const currentTagIds = currentTags.rows.map(row => row.tag_id);

		// Extract tag IDs from the new payload
		const newTagIds = tags.map(tag => tag.id).filter(Boolean);

		// Identify tags to remove (present in DB but not in new payload)
		const tagsToRemove = currentTagIds.filter(
			tagId => !newTagIds.includes(tagId),
		);

		// Remove tags that are no longer selected
		if (tagsToRemove.length > 0) {
			await repository.executeSqlQuery(
				`DELETE FROM user_tags 
                 WHERE user_id = $1 
                 AND tag_id = ANY($2::uuid[])`,
				[userId, tagsToRemove],
			);
			console.log(
				`Removed ${tagsToRemove.length} tags from user ${userId}`,
			);
		}

		// Process new tags (similar to your existing logic)
		for (const tag of tags) {
			// Skip if tag has no name (invalid tag)
			if (!tag.name) {
				console.warn('Skipping tag with no name');
				continue;
			}

			// Check if user already has this tag
			if (currentTagIds.includes(tag.id)) {
				console.log(`User ${userId} already has tag ${tag.name}`);
				continue;
			}

			let tagId = tag.id;

			// Handle new custom tags
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
				}
			}
			// Handle existing tags (non-custom)
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
			}

			// Create user-tag association if it doesn't exist
			if (tagId && !currentTagIds.includes(tagId)) {
				await repository.executeSqlQuery(
					`INSERT INTO user_tags (user_id, tag_id, created_at)
                     VALUES ($1, $2, CURRENT_TIMESTAMP)`,
					[userId, tagId],
				);
				console.log(`Associated user ${userId} with tag ${tag.name}`);
			}
		}

		return { success: true, message: 'Tags updated successfully' };
	} catch (err: any) {
		console.error('Error in saveUserTags:', err);
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
