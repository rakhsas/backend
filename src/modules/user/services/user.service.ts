import { repository } from '../../../repository';
import { IRelations } from '../../../shared/utils/interfaces';
import bcrypt from 'bcrypt';
import { CreateUserDto, GetUserWithRelationsDTO } from '../dto/user.dto';
import * as tagsService from './../../tags/tags.service';

const save = async (userData: CreateUserDto) => {
	try {
		// Create a copy of the user data to avoid mutating the original object
		const userDataCopy = {
			...userData,
			email: userData.email.toLowerCase(),
		};

		// Hash the password if it exists
		if (userDataCopy.password) {
			userDataCopy.password = await hashPassword(userDataCopy.password);
		}

		// Save the user data to the repository
		const newUser = await repository.save('users', userDataCopy);
		return newUser;
	} catch (error) {
		// Re-throw the error for the caller to handle
		throw error;
	}
};

const findByEmail = async (email: string): Promise<any> => {
	try {
		const user = await repository.findOneByCondition('users', { email });
		return user;
	} catch (error) {
		throw error;
	}
};

const findById = async (id: string) => {
	try {
		const user = await repository.findOneByCondition('users', { id });
		return user;
	} catch (error) {
		throw error;
	}
};

const hashPassword = async (password: any) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		return hashedPassword;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const comparePassword = async (password: string, hashedPassword: string) => {
	try {
		return await bcrypt.compare(password, hashedPassword);
	} catch (error) {
		throw error;
	}
};

const update = async (
	data: any,
	condition: any,
	distinct: boolean,
	differentClause: boolean = true,
) => {
	try {
		return await repository.update(
			'users',
			data,
			condition,
			distinct,
			differentClause,
		);
	} catch (error) {
		throw error;
	}
};

const getAllUsersWithRelations = async () => {
	const relations: IRelations[] = [
		{
			tableName: 'profile',
			foreignKey: 'user_id',
		},
	];
	const res = await repository.findWithRelations('users', 'id', relations);
	res.map(row => {
		delete row.id;
		delete row.password;
	});
	return res;
};

const getUserWithRelations = async (id: string) => {
	try {
		const relations: IRelations[] = [
			{
				tableName: 'profile',
				foreignKey: 'user_id',
			},
			{
				tableName: 'locations',
				foreignKey: 'user_id',
			},
			{
				tableName: 'user_tags',
				foreignKey: 'user_id',
			},
		];

		// Find user with relations
		const user = await repository.findOneWithRelationsSeparateQueries(
			'users',
			'id',
			id,
			relations,
		);

		// Return null if user not found
		if (!user) {
			return null;
		}

		// Get user tags
		const tags = await tagsService.getUserTags(id);

		// Transform data with tags
		return transformUserData({
			...user,
			tags: tags || [],
		});
	} catch (error) {
		console.error('Error in getUserWithRelations:', error);
		throw new Error('Failed to fetch user with relations');
	}
};

export const getUserWithRelationsNEW = async (id: string) => {
	const relations: IRelations[] = [
		{
			tableName: 'profile',
			foreignKey: 'user_id',
		},
		{
			tableName: 'locations',
			foreignKey: 'user_id',
		},
	];
	const res = await repository.findOneWithRelationsSeparateQueries(
		'users',
		'id',
		id,
		relations,
	);
	delete res.users;
	return res;
};

function transformUserData(raw: any): any {
	// Safely get API URL with fallback
	const apiURL = process.env.API_URL ? `${process.env.API_URL}/api/` : '';
	// Safely handle pictures array with multiple fallbacks
	const pictures = [];
	if (raw.profile?.pictures) {
		pictures.push(...raw.profile.pictures);
	} else if (raw.pictures) {
		pictures.push(...raw.pictures);
	}

	// Process pictures with null checks
	const processedPictures = pictures.map(picture => apiURL + picture);

	// Safely get main picture with fallbacks
	let mainPicture = '';
	if (raw.profile?.mainpicture) {
		mainPicture = apiURL + raw.profile.mainpicture;
	} else if (raw.mainpicture) {
		mainPicture = apiURL + raw.mainpicture;
	}

	// Safely get location data
	const location = raw.locations
		? {
				address: raw.locations.address || '',
				lat: raw.locations.lat || 0,
				lng: raw.locations.lng || 0,
				visibility: raw.locations.visibility || 'private',
				searchRadius: raw.locations.searchradius || 50,
				shareLocation: raw.locations.sharelocation || false,
			}
		: {
				address: '',
				lat: 0,
				lng: 0,
				visibility: 'private',
				searchRadius: 50,
				shareLocation: false,
			};

	// Safely get tags/interests
	const interests = raw.tags?.map((tag: any) => tag.name);

	return {
		id: raw.users?.id || raw.user_id || '',
		firstname: raw.users?.firstname || raw.firstname || '',
		lastname: raw.users?.lastname || raw.lastname || '',
		username: raw.users?.username || raw.username || '',
		gender: raw.profile?.gender || raw.gender || 'other',
		birthdate: raw.profile?.birthdate || raw.birthdate || null,
		bio: raw.profile?.bio || raw.bio || '',
		interests,
		location,
		pictures: processedPictures,
		mainPicture,
	};
}
export const saveUserWithRelations = async (
	userProfile: GetUserWithRelationsDTO,
) => {
	try {
	} catch (error) {
		throw error;
	}
};

export const searchUsersProfile = async (query: string, userId: string) => {
	try {
		const relations: IRelations[] = [
			{
				tableName: 'profile',
				foreignKey: 'user_id',
			},
		];
		const condition = `((users.username ILIKE '%${query}%' OR 
			users.email ILIKE '%${query}%' OR 
			CONCAT(users.firstname, ' ', users.lastname) ILIKE '%${query}%') OR
			users.firstname ILIKE '%${query}%' OR users.lastname ILIKE '%${query}%')
			AND users.id != '${userId}'
			`;
		const users = await repository.findWithRelationsAndConditions(
			'users',
			'id',
			relations,
			condition,
		);
		return users.map(user => transformUserData(user));
	} catch (error) {
		throw error;
	}
};

export {
	save,
	findByEmail,
	comparePassword,
	findById,
	update,
	getAllUsersWithRelations,
	hashPassword,
	getUserWithRelations,
};
