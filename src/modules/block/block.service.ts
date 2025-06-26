import { repository } from '../../repository';

export const saveBlock = async (reportData: {
	title: string;
	user_id: string;
	blocked_user_id: string;
}) => {
	try {
		// Assuming you have a Report model set up
		const report = await repository.save('blocks', reportData);
		return report;
	} catch (error) {
		console.error('Error saving block record:', error);
		throw error;
	}
};

export const getBlocks = async (user1: string, user2: string) => {
	try {
		const query = `
			SELECT * FROM blocks
			WHERE (user_id = $1 AND blocked_user_id = $2)
			OR (user_id = $2 AND blocked_user_id = $1)
		`;
		const result = await repository.executeSqlQuery(query, [user1, user2]);
		if (result.rowCount != null && result.rowCount <= 1) return false;
		return true;
	} catch (error) {
		console.error('Error fetching blocks:', error);
		throw error;
	}
};

export const hasBlockedUser = async (user: string, targetUserId: string) => {
	try {
		const query = `
			SELECT * FROM blocks
			WHERE user_id = $1 AND blocked_user_id = $2
		`;
		const result = await repository.executeSqlQuery(query, [
			user,
			targetUserId,
		]);
		console.log('hasBlockedUser query parameters:', query, [
			user,
			targetUserId,
		]);
		return result.rowCount != null && result.rowCount > 0;
	} catch (error) {
		console.error('Error checking if user has blocked target user:', error);
		throw error;
	}
};

export const removeBlock = async (user1: string, user2: string) => {
	try {
		console.log('Removing block between:', user1, 'and', user2);
		const query = `
			DELETE FROM blocks
			WHERE (user_id = $1 AND blocked_user_id = $2)
			OR (user_id = $2 AND blocked_user_id = $1)
			RETURNING *;
		`;
		const result = await repository.executeSqlQuery(query, [user1, user2]);
		return result.rowCount != null && result.rowCount > 0;
	} catch (error) {
		console.error('Error removing block:', error);
		throw error;
	}
};
export const getUserBlocks = async (userId: string, queryParams: any) => {
	try {
		const query = `
            SELECT 
                b.id AS block_id,
                u.id AS blocked_user_id,
                CONCAT(u.firstname, ' ', u.lastname) AS name,
                p.mainpicture AS imageUrl,
                b.created_at AS createdAt
            FROM blocks b
            JOIN users u ON 
                (b.user_id = $1 AND b.blocked_user_id = u.id) OR
                (b.blocked_user_id = $1 AND b.user_id = u.id)
            JOIN profile p ON u.id = p.user_id
            WHERE b.user_id = $1 OR b.blocked_user_id = $1
            ORDER BY b.created_at DESC
            LIMIT $2 OFFSET $3
        `;

		const result = await repository.executeSqlQuery(query, [
			userId,
			queryParams.limit,
			queryParams.offset,
		]);
		const apiURL = process.env.API_URL + '/api/' || 'apiUrlNotDefined';

		// Format the results with proper URL handling and null checks
		return result.rows.map(row => ({
			id: row.blocked_user_id,
			name: row.name || 'Unknown User',
			imageUrl: row.imageurl ? `${apiURL}${row.imageurl}` : '',
			createdAt: row.createdat,
			blockId: row.block_id,
			imageError: false,
		}));
	} catch (error) {
		console.error('Error fetching user blocks:', error);
		throw new Error('Failed to fetch blocked users');
	}
};
