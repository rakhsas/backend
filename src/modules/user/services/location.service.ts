import { repository } from '../../../repository';
import { LocationDTO } from '../../../shared/dtos';

export const save = async (location: LocationDTO) => {
	return await repository.updateOrInsert('locations', location, {
		user_id: location.user_id,
	});
};

export const updateOrInsert = async (location: LocationDTO) => {
	return await repository.updateOrInsert('locations', location, {
		user_id: location.user_id,
	});
};
const apiURL = process.env.API_URL + '/api/';

export const getNearbyUsers = async (userId: string) => {
	try {
		const userLocation = await repository.findOne(
			'locations',
			'user_id',
			userId,
		);
		if (!userLocation) {
			throw new Error('User location not found');
		}
		const earthRadius = 6371000;
		const query = `
			SELECT 
				u.id, u.firstname, u.lastname, u.username,
				l.address, l.lat, l.lng, l.visibility, l.sharelocation,
				($1 * ACOS(
				LEAST(1, 
					SIN(RADIANS($2)) * SIN(RADIANS(l.lat)) +
					COS(RADIANS($2)) * COS(RADIANS(l.lat)) *
					COS(RADIANS(l.lng - $3))
				)
				)) AS distance_meters,
				p.mainpicture
			FROM users u
			JOIN locations l ON u.id = l.user_id
			JOIN profile p ON u.id = p.user_id
			WHERE 
				l.sharelocation = TRUE AND
				u.id != $4 AND
				($1 * ACOS(
				LEAST(1, 
					SIN(RADIANS($2)) * SIN(RADIANS(l.lat)) +
					COS(RADIANS($2)) * COS(RADIANS(l.lat)) *
					COS(RADIANS(l.lng - $3))
				)
				)) <= $5
			ORDER BY distance_meters ASC
		`;

		const params = [
			earthRadius,
			userLocation.lat,
			userLocation.lng,
			userId,
			userLocation.searchradius,
		];

		const result = await repository.executeSqlQuery(query, params);
		result.rows?.map((user: any) => {
			user.mainpicture = apiURL + user.mainpicture;
		});
		return result.rows;
	} catch (error) {
		console.error('Error fetching nearby users:', error);
		throw new Error('Could not fetch nearby users');
	}
};
