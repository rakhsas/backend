import { createModel, foreignKey } from '../../../shared/models/entity';

const columns = {
	id: 'SERIAL PRIMARY KEY',
	viewerId: 'UUID NOT NULL',
	user_id: 'UUID NOT NULL',
	viewed_At: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
};

let model = null;
(async () => {
	const foreignKey: foreignKey[] = [
		{
			column: 'viewerId',
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
	model = createModel({ tableName: 'profileViews', columns, foreignKey });
	model.syncTable();
})();
