import { createModel } from '../../../shared/models/entity';

const columns = {
	id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
	name: 'VarChar(50) NOT NULL UNIQUE',
	category: 'VarChar(50) DEFAULT NULL',
	color: 'VarChar(20) DEFAULT NULL',
	is_custom: 'BOOLEAN DEFAULT false',
	usage_count: 'INTEGER DEFAULT 0',
	created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
	updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
};

export default {
	syncTable: async () => {
		const tagModel = createModel({
			tableName: 'tags',
			columns,
			foreignKey: [],
		});
		try {
			await tagModel.syncTable();
		} catch (err) {
			console.error('❌ Error syncing tags table:', err);
		}
	},
};
