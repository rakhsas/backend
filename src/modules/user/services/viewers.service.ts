import { repository } from '../../../repository';
import { IRelations } from '../../../shared/utils/interfaces';

export const getViewers = async (id: string): Promise<any> => {
	try {
		const viewers = await repository.findByCondition('profileviews', {
			user_id: id,
		});
		return viewers;
	} catch (err: any) {
		throw err;
	}
};
export const getViewersCount = async (id: string): Promise<number> => {
	try {
		const viewers = await repository.findByCondition('profileviews', {
			user_id: id,
		});
		return viewers?.length || 0;
	} catch (err: any) {
		throw err;
	}
};
export const getViewersWithRelations = async (id: string): Promise<any[]> => {
	try {
		const relations: IRelations[] = [
			{
				tableName: 'users',
				foreignKey: 'id',
			},
		];
		const conditions = [
			{
				user_id: id,
			},
		];
		const keys = relations
			.map(
				(relation: any, index: number) =>
					`profileviews.user_id= '${conditions[index].user_id}'`,
			)
			.join(' AND ');
		const viewers = await repository.findWithRelationsAndConditions(
			'profileviews',
			'viewerid',
			relations,
			keys,
		);
		viewers.forEach(viewer => {
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
				delete viewer[key];
			});
		});
		return viewers;
	} catch (err: any) {
		throw err;
	}
};

export const save = async (body: any) => {
	try {
		return await repository.save('profileviews', body);
	} catch (err: any) {
		throw err;
	}
};
