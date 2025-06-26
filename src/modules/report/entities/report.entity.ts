import { createModel, foreignKey } from '../../../shared/models/entity';

const columns = {
	id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
	title: 'VarChar(100) NOT NULL',
	user_id: 'UUID DEFAULT NULL',
	reported_user_id: 'UUID DEFAULT NULL',
	created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
	updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
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
		column: 'reported_user_id',
		refTable: 'tags',
		refColumn: 'id',
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	},
];
export default {
	syncTable: async () => {
		const tagModel = createModel({
			tableName: 'reports',
			columns,
			foreignKey: [],
		});
		try {
			await tagModel.syncTable();
		} catch (err) {
			console.error('❌ Error syncing reports table:', err);
		}
	},
};
