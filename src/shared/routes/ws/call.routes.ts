import { WsRouter } from './ws-router';
import * as chatService from './../../../modules/chat/services/chat.service';
import { getUserInfos } from '.';
import * as notificationService from './../../../modules/notification/notification.service';

export const CallWsRouter = new WsRouter()
	.use((socket, next) => {
		next();
	})
	.on('callRequest', async (io, socket, payload) => {
		try {
			const message = JSON.parse(payload);
			await chatService.save(message);

			// Get recipient info and check conditions
			const recipientInfo = getUserInfos(message.target_id);
			const shouldNotify =
				!recipientInfo ||
				recipientInfo.currentConversation !== message.conversation_id;

			if (shouldNotify) {
				const notification = await notificationService.saveNotification(
					{
						sender_id: message.sender_id,
						receiver_id: message.target_id,
						type: 'CALL',
						content: null,
						is_read: false,
					},
				);

				if (recipientInfo?.socketId) {
					io.to(recipientInfo.socketId).emit('personalNotification', {
						type: 'CALL',
						message: notification,
					});
				}
				io.to(socket.id).emit('callNotification', {
					message,
				});
			}
		} catch (err) {
			console.error('Error in callRequest:', err);
		}
	})
	.on('callAccept', (io, socket, payload) => {
		const recipientInfo =
			getUserInfos(payload.acceptorId)?.socketId ||
			`conversation_${payload.conversation_id}`;
		io.to(recipientInfo).emit('callAccepted', {
			conversationId: payload.conversationId,
			accepted: true,
			acceptorId: payload.acceptorId,
			senderId: payload.senderId,
		});
	})
	.on('callReject', (io, socket, payload) => {
		const { callId, conversationId } = JSON.parse(payload);
		io.to(`conversation_${conversationId}`).emit('callRejected', {
			callId: payload.callId,
			rejected: true,
			rejectorId: payload.rejectorId,
		});
	})
	.on('callEnd', (io, socket, payload) => {
		const { callId, conversationId } = JSON.parse(payload);
		io.to(`conversation_${conversationId}`).emit('callEnded', {
			callId,
			ended: true,
			endedBy: socket.data.user.id,
		});
	})
	.on('callIceCandidate', (io, socket, payload) => {
		// const { candidate, conversationId } = JSON.parse(payload);
		socket
			.to(`conversation_${payload.conversationId}`)
			.emit('newIceCandidate', {
				candidate: payload.candidate,
				senderId: payload.senderId,
			});
	})
	.on('callOffer', (io, socket, payload) => {
		// const { offer, conversationId } = JSON.parse(payload);
		socket
			.to(`conversation_${payload.conversationId}`)
			.emit('incomingCallOffer', {
				offer: payload.offer,
				callerId: payload.senderId,
			});
	})
	.on('callAnswer', (io, socket, payload) => {
		// const { answer, conversationId } = JSON.parse(payload);
		socket
			.to(`conversation_${payload.conversationId}`)
			.emit('callAnswerReceived', {
				answer: payload.answer,
				answererId: socket.data.user.id,
			});
	});
