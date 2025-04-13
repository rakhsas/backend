import { createModel } from '../../../shared/models/entity';

const columns = {
    id: 'SERIAL PRIMARY KEY',
    user_id: 'UUID NOT NULL',
    address: 'VARCHAR(255) NOT NULL',
    lat: 'FLOAT NOT NULL',
    lng: 'FLOAT NOT NULL',
}

const foreignKey = [
    {
        column: 'user_id',
        refTable: 'users',
        refColumn: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }
];

export default {
    syncTable: async () => {
        const userInterestsModel = createModel({
            tableName: 'locations',
            columns,
            foreignKey
        });

        try {
            await userInterestsModel.syncTable();
        } catch (err) {
            console.error('❌ Error syncing user_interests table:', err);
        }
    }
};
