import { createModel, createType, foreignKey } from "../../../shared/models/entity";

const columns = {
    id: 'SERIAL PRIMARY KEY',
    sender_id: 'UUID NOT NULL',
    receiver_id: 'UUID NOT NULL',
    type: "type DEFAULT 'TEXT'",
    message: 'TEXT DEFAULT NULL',
    media_url: 'VarChar(255) DEFAULT NULL',
    timestamp: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
};

const foreignKeys: foreignKey[] = [
    {
        column: 'sender_id',
        refTable: 'users',
        refColumn: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    {
        column: 'receiver_id',
        refTable: 'users',
        refColumn: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
];

export default {
    syncTable: async () => {
        try {
            await createType({ 
                typeName: 'type', 
                values: ['TEXT', 'AUDIO', 'IMAGE', 'LINK'] 
            });

            const chatModel = createModel({ 
                tableName: 'chats', 
                columns, 
                foreignKey: foreignKeys 
            });

            await chatModel.syncTable();
        } catch (err) {
            console.error('❌ Error syncing chats table:', err);
        }
    },
};
