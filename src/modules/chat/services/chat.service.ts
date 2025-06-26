import { repository } from '../../../repository';
import * as conversationService from './conversation.service';

export const save = async (body: any) => {
	try {
		const result = await repository.save('chat', body);
		if (result) {
			await conversationService.updateConversation({
				id: body.conversation_id,
				last_message_id: result.id,
				is_active: true,
				updated_at: new Date(),
			});
		}
		return result;
	} catch (err: any) {
		throw err;
	}
};

interface smallUser {
	id: string;
	fullName: string;
	mainPicture: string;
}
interface Conversation {
	id: string;
	user_1?: smallUser;
	user_2?: smallUser;
	last_message_id: string;
	is_active: string;
}

export const getLastConversations = async (
	userId: string,
	offset: number,
	limit: number,
): Promise<Conversation[]> => {
	try {
		console.log('offset:', offset, 'limit:', limit);
		const query = `
		WITH user_conversations AS (
		  SELECT 
			c.id,
			c.last_message_id,
			c.is_active,
			c.updated_at,
			CASE 
			  WHEN c.user_1 = $1 THEN c.user_2
			  ELSE c.user_1
			END AS other_user_id
		  FROM conversations c
		  WHERE c.user_1 = $1 OR c.user_2 = $1
		)
		SELECT
		  uc.id,
		  uc.last_message_id,
		  uc.is_active,
		  
		  u.id AS other_user_id,
		  u.firstname AS other_first_name,
		  u.lastname AS other_last_name,
		  p.mainpicture AS other_main_picture,
		  
		  CASE 
			WHEN uc.last_message_id IS NULL THEN '[]'::json
			ELSE (
			  SELECT json_agg(chat.* ORDER BY chat.created_at DESC)
			  FROM (
				SELECT *
				FROM chat
				WHERE chat.conversation_id = uc.id
				ORDER BY chat.created_at DESC
				LIMIT 10
			  ) chat
			)
		  END AS chat,
		  
		  CASE
			WHEN uc.last_message_id IS NULL THEN uc.updated_at
			ELSE (SELECT MAX(created_at) FROM chat WHERE conversation_id = uc.id)
		  END AS sort_date
		  
		FROM user_conversations uc
		JOIN users u ON uc.other_user_id = u.id
		LEFT JOIN profile p ON u.id = p.user_id
		ORDER BY sort_date DESC
		LIMIT $2 OFFSET $3;
	  `;

		const result = await repository.executeSqlQuery(query, [
			userId,
			limit,
			offset,
		]);
		const apiURL = process.env.API_URL + '/api/';

		const conversations: Conversation[] = result.rows.map((row: any) => ({
			id: row.id,
			last_message_id: row.last_message_id,
			is_active: row.is_active,
			user: {
				id: row.other_user_id,
				fullName: `${row.other_first_name} ${row.other_last_name}`,
				mainPicture: apiURL + row.other_main_picture,
			},
			chat:
				row?.chat.map((msg: any) => {
					return {
						...msg,
						content:
							msg.type !== 'TEXT'
								? apiURL + msg.content
								: msg.content,
						time: msg.type === 'AUDIO' ? '0:00' : undefined,
					};
				}) || [],
		}));

		return conversations;
	} catch (err) {
		console.error('Error fetching conversations with chat:', err);
		throw new Error('Failed to retrieve conversations');
	}
};

interface CallConversationSidebarItem {
	id: string; // conversation_id
	user: {
		id: string;
		email: string;
		fullName: string;
		mainPicture: string;
	};
	details: {
		status: string; // 'ONGOING' | 'ENDED' | 'MISSED'
		duration?: number; // in seconds, optional for ongoing calls
	};
	createdAt: string;
	updatedAt: string;
}
export const getLastCallConversations = async (
	userId: string,
	offset: number,
	limit: number,
): Promise<CallConversationSidebarItem[]> => {
	try {
		const query = `
		SELECT
		  c.id AS conversation_id,
		  u.id AS user_id,
		  u.email,
		  u.firstname,
		  u.lastname,
		  p.mainpicture,
		  ch.details,
		  ch.created_at,
		  ch.updated_at
		FROM chat ch
		JOIN conversations c ON ch.conversation_id = c.id
		JOIN users u ON (u.id = CASE 
		  WHEN c.user_1 = $1 THEN c.user_2 
		  ELSE c.user_1 
		END)
		LEFT JOIN profile p ON u.id = p.user_id
		WHERE ch.type = 'CALL'
		ORDER BY ch.created_at DESC
		LIMIT $2 OFFSET $3;
	  `;

		const result = await repository.executeSqlQuery(query, [
			userId,
			limit,
			offset,
		]);

		const apiURL = process.env.API_URL + '/api/';

		return result.rows.map((row: any) => ({
			id: row.conversation_id,
			user: {
				id: row.user_id,
				email: row.email,
				fullName: `${row.firstname} ${row.lastname}`,
				mainPicture: apiURL + row.mainpicture,
			},
			details: {
				duration: row.details?.duration || '',
				status: row.details?.status || '',
			},
			createdAt: row.created_at,
			updatedAt: row.updated_at,
		}));
	} catch (err) {
		console.error('Error fetching call conversations:', err);
		throw new Error('Failed to retrieve call history');
	}
};

export const updateAllMessages = async (data: {
	target_id: string;
	conversation_id: string;
	is_seen: boolean;
}): Promise<any> => {
	try {
		const query = `
			UPDATE chat
			SET is_seen = $1, updated_at = CURRENT_TIMESTAMP
			WHERE target_id = $2 AND conversation_id = $3
		`;
		return await repository.executeSqlQuery(query, [
			data.is_seen,
			data.target_id,
			data.conversation_id,
		]);
	} catch (err) {
		console.error('DB error updating all chat:', err);
		throw new Error('Failed to update all chat');
	}
};
