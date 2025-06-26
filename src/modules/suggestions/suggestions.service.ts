import * as userService from './../user/services/user.service';
import * as tagsService from './../tags/tags.service';
import { repository } from './../../repository';

export const getSuggestions = async (userId: string, queryParams: any) => {
	try {
		const user = await userService.getUserWithRelationsNEW(userId);
		if (!user) {
			throw new Error('User not found');
		}
		// console.log('Current User:', user);
		console.log('Query Parameters:', queryParams);
		const { sqlQuery, params } = await buildBaseQuery(user, queryParams);
		// console.log('SQL Query:', sqlQuery, params);
		const result = await repository.executeSqlQuery(sqlQuery, params);

		return transformSuggestions(result.rows);
	} catch (error: any) {
		console.error('Error fetching suggestions:', error);
		throw {
			statusCode: 500,
			message: 'Internal server error while fetching suggestions',
			error: error.message || 'Unknown error',
		};
	}
};

const transformSuggestions = (rows: any[]): any[] => {
	const apiURL = process.env.API_URL + '/api/';
	const currentYear = new Date().getFullYear();
	// console.log('Transforming suggestions:', rows);
	return rows.map((row: any) => {
		const birthDate = new Date(row.birthdate);
		const age = currentYear - birthDate.getFullYear();
		// console.log(row);
		const userProfile: any = {
			id: row.profile_id,
			firstName: row.firstname,
			lastName: row.lastname,
			birthDate: birthDate,
			age: age,
			location: {
				lat: row.lat,
				lng: row.lng,
				address: row.address || '',
			},
			distance: row.distance || 0,
			fameRating: row.fame_score || 0,
			tags: row.tags || [],
			mainPicture: `${apiURL}${row.mainpicture}`,
			pictures:
				row.pictures.length > 0
					? row.pictures.map((pic: string) => `${apiURL}${pic}`)
					: [],
			bio: row.bio,
			lastSeen: new Date(row.last_seen),
			isOnline: row.is_online || false,
		};

		return userProfile;
	});
};

async function buildBaseQuery(currentUser: any, query: any) {
	// Validate currentUser structure
	console.log(currentUser);
	if (!currentUser?.profile?.user_id || !currentUser?.locations) {
		throw new Error('Invalid current user data');
	}

	const userOrientation = currentUser.sexual_preferences?.sexual_orientation;
	let currentUserTagNames: string[] = [];

	// Get current user's tags
	if (currentUser.user_tags?.length) {
		const tagPromises = currentUser.user_tags.map(
			(tag: any) => (
				console.log('Fetching tag by ID:', tag.tag_id),
				tagsService.getTagById(tag.tag_id)
			),
		);
		currentUserTagNames = (await Promise.all(tagPromises)).filter(Boolean);
	}

	// Base query with explicit joins and null checks
	let sqlQuery = `
        SELECT
            profile.*,
            users.*,
			users.id AS profile_id,
            locations.*,
            sexual_preferences.*,
            user_metrics.fame_score,
            (
                6371 * acos(
                    cos(radians($2)) * cos(radians(locations.lat)) *
                    cos(radians(locations.lng) - radians($3)) +
                    sin(radians($2)) * sin(radians(locations.lat))
                )
            ) AS distance,
            ARRAY(
                SELECT tags.name 
                FROM user_tags
                JOIN tags ON user_tags.tag_id = tags.id
                WHERE user_tags.user_id = users.id
            ) AS tags,
            ARRAY(
                SELECT tags.name 
                FROM user_tags
                JOIN tags ON user_tags.tag_id = tags.id
                WHERE user_tags.user_id = users.id
                AND tags.name = ANY(${currentUserTagNames.length ? '$4' : 'ARRAY[]::varchar[]'})
            ) AS common_tags
        FROM profile
        INNER JOIN users ON profile.user_id = users.id
        INNER JOIN locations ON users.id = locations.user_id
        LEFT JOIN sexual_preferences ON users.id = sexual_preferences.user_id
        LEFT JOIN user_metrics ON users.id = user_metrics.user_id
        WHERE
            users.id != $1
            AND profile.pictures IS NOT NULL
            AND array_length(profile.pictures, 1) > 0
            AND locations.lat IS NOT NULL
            AND locations.lng IS NOT NULL
    `;

	const params = [
		currentUser.profile.user_id, // $1 - Exclude current user
		currentUser.locations.lat, // $2
		currentUser.locations.lng, // $3
	];

	// Add tags if they exist
	if (currentUserTagNames.length > 0) {
		params.push(currentUserTagNames); // $4
	}

	let paramIndex = params.length + 1;

	// Orientation filtering - improved with parameterized queries
	if (userOrientation === 'heterosexual') {
		const targetGender = currentUser.profile.gender === 'F' ? 'M' : 'F';
		sqlQuery += ` AND profile.gender = $${paramIndex++}`;
		params.push(targetGender);

		sqlQuery += ` AND (
            sexual_preferences.sexual_orientation = 'heterosexual' OR 
            sexual_preferences.sexual_orientation = 'bisexual' OR 
            sexual_preferences.sexual_orientation = 'pansexual'
        )`;
	}

	// Age filtering with parameterized queries
	if (query.minAge) {
		sqlQuery += ` AND EXTRACT(YEAR FROM AGE(CURRENT_DATE, profile.birthdate)) >= $${paramIndex++}`;
		params.push(query.minAge);
	}

	if (query.maxAge) {
		sqlQuery += ` AND EXTRACT(YEAR FROM AGE(CURRENT_DATE, profile.birthdate)) <= $${paramIndex++}`;
		params.push(query.maxAge);
	}

	// Fame rating filtering
	if (query.minFameRating) {
		sqlQuery += ` AND (user_metrics.fame_score >= $${paramIndex++} OR user_metrics.fame_score IS NULL)`;
		params.push(query.minFameRating);
	}

	// Distance filtering
	if (query.maxDistance) {
		sqlQuery += ` AND (6371 * acos(
            cos(radians($2)) * cos(radians(locations.lat)) * 
            cos(radians(locations.lng) - radians($3)) + 
            sin(radians($2)) * sin(radians(locations.lat))
        )) <= $${paramIndex++}`;
		params.push(query.maxDistance);
	}

	// Tags filtering
	if (query.tags?.length) {
		sqlQuery += ` AND profile.interests && $${paramIndex++}::varchar[]`;
		params.push(query.tags);
	}

	// Sorting with validation
	if (query.sortBy) {
		const sortOrder = query.sortOrder === 'DESC' ? 'DESC' : 'ASC';
		const allowedSortFields = ['age', 'fame_score', 'distance'];
		if (allowedSortFields.includes(query.sortBy)) {
			sqlQuery += ` ORDER BY ${query.sortBy} ${sortOrder}`;
		}
	} else {
		sqlQuery += ` ORDER BY profile.created_at DESC`;
	}

	// Pagination with validation
	const limit = Math.min(parseInt(query.limit) || 5, 100); // Max 100 records
	const offset = parseInt(query.offset) || 0;
	sqlQuery += ` LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
	params.push(limit, offset);

	console.log(sqlQuery, params);
	return { sqlQuery, params };
}
