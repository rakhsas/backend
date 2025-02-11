import { repository } from '../../repository';
import { IRelations } from '../../shared/utils/interfaces';

export const save = async (body: any) => {
	try {
		return await repository.save('likes', body);
	} catch (err: any) {
		throw err;
	}
};

export const remove = async (condition: object) => {
	try {
		const conditionKeys = Object.keys(condition);
		const conditionValues = Object.values(condition);
		const conditionclause = conditionKeys
			.map((key, index) => `${key} = '${conditionValues[index]}'`)
			.join(' AND ');
		const result = await repository.deleteByCondition(
			'likes',
			conditionclause,
		);
		if (!result) {
			throw new Error('Like not found');
		}
	} catch (err: any) {
		throw err;
	}
};

export const getLikes = async (userId: string) => {
	try {
		const result = await repository.findByCondition('likes', {
			liked_id: userId,
		});
		if (!result) {
			throw new Error('No likes found');
		}
		return result;
	} catch (err: any) {
		throw err;
	}
};

export const getLikesWithRelation = async (userId: string) => {
	try {
		const relations: IRelations[] = [
			{
				tableName: 'users',
				foreignKey: 'id',
			},
		];
		const conditions = [
			{
				liked_id: userId,
			},
		];
		const keys = relations
			.map(
				(relation: any, index: number) =>
					`likes.liked_id= '${conditions[index].liked_id}'`,
			)
			.join(' AND ');
		const likedUsers = await repository.findWithRelationsAndConditions(
			'likes',
			'user_id',
			relations,
			keys,
		);
		if (!likedUsers) {
			throw new Error('No likes found');
		}
		likedUsers.forEach(likedUser => {
			[
				'user_id',
				'rtoken',
				'password',
				'otp',
				'otp_expiry',
				'created_at',
				'updated_at',
				'verified',
			].forEach(key => {
				delete likedUser[key];
			});
		});
		return likedUsers;
	} catch (err: any) {
		throw err;
	}
};
