import { createModel, foreignKey } from '../../../shared/models/entity';

const columns = {
	id: 'SERIAL PRIMARY KEY',
	liked_id: 'UUID NOT NULL',
	user_id: 'UUID NOT NULL',
	viewed_At: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
};

const foreignKey: foreignKey[] = [
	{
		column: 'liked_id',
		refTable: 'users',
		refColumn: 'id',
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	},
	{
		column: 'user_id',
		refTable: 'users',
		refColumn: 'id',
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	},
];
const model = createModel({ tableName: 'likes', columns, foreignKey });

export default {
	syncTable: async () => {
		try {
			await model.syncTable();
		} catch (error) {
			console.error('❌ Error syncing likes table:', error);
		}
	},
};
