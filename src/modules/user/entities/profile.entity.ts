import {
	createModel,
	createType,
	foreignKey,
} from '../../../shared/models/entity';

const columns = {
	id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
	gender: "gender DEFAULT 'M'",
	sexualPreferences: "sexualPreferences DEFAULT 'B'",
	bio: 'VarChar(255) DEFAULT NULL',
	interests: 'interests[] DEFAULT NULL',
	location: 'VarChar(255) DEFAULT NULL',
	pictures: 'VarChar(255)[] NOT NULL',
	user_id: 'UUID NOT NULL',
};

const foreignKey: foreignKey[] = [
	{
		column: 'user_id',
		refTable: 'users',
		refColumn: 'id',
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	},
];

export default {
	syncTable: async () => {
		await createType({ typeName: 'gender', values: ['M', 'F'] });
		await createType({
			typeName: 'sexualpreferences',
			values: ['M', 'F', 'B'],
		});
		await createType({
			typeName: 'interests',
			values: ['VEGAN', 'GEEK', 'PIERCING'],
		});
		const userModel = createModel({
			tableName: 'profile',
			columns,
			foreignKey,
		});
		try {
			await userModel.syncTable();
		} catch (err) {
			console.error('❌ Error syncing profile table:', err);
		}
	},
};
