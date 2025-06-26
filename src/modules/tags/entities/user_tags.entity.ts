import { createModel, foreignKey } from '../../../shared/models/entity';

const columns = {
	id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
	user_id: 'UUID NOT NULL',
	tag_id: 'UUID NOT NULL',
	created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
};

const foreignKey: foreignKey[] = [
	{
		column: 'user_id',
		refTable: 'users',
		refColumn: 'id',
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	},
	{
		column: 'tag_id',
		refTable: 'tags',
		refColumn: 'id',
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	},
];

export default {
	syncTable: async () => {
		const userTagModel = createModel({
			tableName: 'user_tags',
			columns,
			foreignKey,
		});
		try {
			await userTagModel.syncTable();
		} catch (err) {
			console.error('❌ Error syncing user_tags table:', err);
		}
	},
};
