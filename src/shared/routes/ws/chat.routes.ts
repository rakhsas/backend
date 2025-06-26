import { WsRouter } from './ws-router';
import * as chatService from './../../../modules/chat/services/chat.service';
import { connectedUsers, getUserInfos } from '.';
import * as notificationService from './../../../modules/notification/notification.service';
const apiURL = process.env.API_URL + '/api/';

export const chatWsRouter = new WsRouter()
	.use((socket, next) => {
		console.log('Chat route middleware');
		next();
	})
	.on('sendMessage', async (io, socket, rawMessage) => {
		try {
			const message = JSON.parse(rawMessage);
			const savedMessage = await chatService.save(message);
			if (savedMessage.type !== 'TEXT') {
				savedMessage.content = apiURL + savedMessage.content;
			}
			// 1. Emit to all participants in the conversation
			io.to(`conversation_${savedMessage.conversation_id}`).emit(
				'newMessage',
				savedMessage,
			);

			// 2. Get recipient info and check conditions
			const recipientInfo = getUserInfos(message.target_id);
			const shouldNotify =
				!recipientInfo ||
				recipientInfo.currentConversation !== message.conversation_id;

			if (shouldNotify) {
				// 3. Create and save notification
				const notification = await notificationService.saveNotification(
					{
						sender_id: message.sender_id,
						receiver_id: message.target_id,
						type: 'MESSAGE',
						content: {
							conversationId: savedMessage.conversation_id,
							message: message.content,
							preview:
								message.content.substring(0, 30) +
								(message.content.length > 30 ? '...' : ''), // Add preview
						},
						is_read: false,
					},
				);

				// 4. Send real-time notification if user is online (even if not in conversation)
				if (recipientInfo?.socketId) {
					io.to(recipientInfo.socketId).emit('personalNotification', {
						type: 'MESSAGE',
						message: notification,
					});
				}
			}
		} catch (err: any) {
			console.error('sendMessage error:', err);
			// Consider emitting an error back to the sender
			socket.emit('messageError', {
				error: 'Failed to send message',
				details: err.message,
			});
		}
	})
	.on('messageSeen', async (io, socket, data) => {
		try {
			console.log('messageSeen event received:', data);
			const message = data;
			//
			await notificationService.updateNotification({
				id: message.conversationId,
				is_read: true,
			});
			const targetUserId = message.target_id;
			const targetSocketId = connectedUsers.get(targetUserId)?.socketId;
			io.to(targetSocketId || '').emit('messageSeen', message.messageId);
		} catch (err) {
			console.error('sendMessage error:', err);
		}
	})
	.on('joinConversation', async (io, socket, conversationId) => {
		console.log(
			`${(socket as any).userId} is joined the room conversation_${conversationId}`,
		);
		// save the current conversation on the connected user map
		const userId = (socket as any).userId;
		if (connectedUsers.has(userId)) {
			connectedUsers.get(userId)!.currentConversation = conversationId;
		} else {
			connectedUsers.set(userId, {
				socketId: socket.id,
				currentConversation: conversationId,
			});
		}
		socket.join(`conversation_${conversationId}`);
		await chatService.updateAllMessages({
			target_id: userId,
			conversation_id: conversationId,
			is_seen: true,
		});
		getRoomUsers(conversationId).forEach(user => {
			console.log(user);
			if (user.socketId !== socket.id) {
				console.log(
					user.socketId,
					'is notified that all messages are seen',
				);
				io.to(user.socketId).emit('allMessagesSeen', {
					conversationId,
				});
			}
		});
	})
	.on('leaveConversation', (io, socket, conversationId) => {
		console.log(
			`${(socket as any).userId} is leaving the room conversation_${conversationId}`,
		);
		const userId = (socket as any).userId;
		if (connectedUsers.has(userId)) {
			connectedUsers.get(userId)!.currentConversation = null;
		}
		socket.leave(`conversation_${conversationId}`);
	});

export const getRoomUsers = (conversationId: string) => {
	const users: { userId: string; socketId: string }[] = [];
	connectedUsers.forEach((user, userId) => {
		if (user.currentConversation === conversationId) {
			users.push({ userId, socketId: user.socketId });
		}
	});
	return users;
};
