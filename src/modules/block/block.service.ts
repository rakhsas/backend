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
