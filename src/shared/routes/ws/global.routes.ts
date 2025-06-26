import { WsRouter } from './ws-router';
import * as likeService from './../../../modules/like/like.service';
import * as reportService from './../../../modules/report/report.service';
import * as blockService from './../../../modules/block/block.service';
import { getUserInfos } from '.';
import * as notificationService from './../../../modules/notification/notification.service';

export const GlobalWsRouter = new WsRouter()
	.use((socket, next) => {
		next();
	})
	.on('likeUser', async (io, socket, payload) => {
		try {
			const { userId, targetUserId } = JSON.parse(payload);
			const likeResult = await likeService.save({
				liked_id: userId,
				user_id: targetUserId,
			});

			const targetSocketId = getUserInfos(targetUserId)?.socketId;
			// create a notification as seen and sendit
			const notification = await notificationService.saveNotification({
				sender_id: userId,
				receiver_id: targetUserId,
				type: 'LIKE',
				content: {
					message: 'You have a new like!',
				},
				is_read: false,
			});

			// Send real-time notification if user is online

			if (targetSocketId) {
				io.to(targetSocketId).emit('likeUser', {
					type: 'LIKE',
					message: notification,
				});
			}
			io.to(socket.id).emit('likeUser', {
				userId,
				targetUserId,
				likeResult,
			});
		} catch (err) {
			console.error('likeUser error:', err);
		}
	})
	.on('unlikeUser', async (io, socket, payload) => {
		try {
			const { userId, targetUserId } = JSON.parse(payload);
			const unlikeResult = await likeService.remove({
				liked_id: userId,
				user_id: targetUserId,
			});

			const targetSocketId = getUserInfos(targetUserId)?.socketId;
			// create a notification as seen and sendit
			const notification = await notificationService.saveNotification({
				sender_id: userId,
				receiver_id: targetUserId,
				type: 'UNLIKE',
				content: {
					message: 'You have an unlike action!',
				},
				is_read: false,
			});

			// Send real-time notification if user is online
			if (targetSocketId) {
				io.to(targetSocketId).emit('unlikeUser', {
					type: 'UNLIKE',
					message: notification,
				});
			}
			io.to(socket.id).emit('unlikeUser', {
				userId,
				targetUserId,
				unlikeResult,
			});
		} catch (err) {
			console.error('unlikeUser error:', err);
		}
	})
	.on('reportUser', async (io, socket, payload) => {
		try {
			const { title, user_id, reported_user_id } = JSON.parse(payload);

			const report = await reportService.saveReport({
				title,
				user_id,
				reported_user_id,
			});

			const targetSocketId = getUserInfos(reported_user_id)?.socketId;
			// create a notification as seen and send it
			const notification = await notificationService.saveNotification({
				sender_id: user_id,
				receiver_id: reported_user_id,
				type: 'REPORT',
				content: {
					message: 'You have a new report!',
				},
				is_read: false,
			});

			// Send real-time notification if user is online
			if (targetSocketId) {
				io.to(targetSocketId).emit('reportUser', {
					type: 'REPORT',
					message: notification,
				});
			}
			io.to(socket.id).emit('reportUser', {
				title,
				user_id,
				reported_user_id,
				report,
			});
		} catch (err) {
			console.error('reportUser error:', err);
		}
	})
	.on('blockUser', async (io, socket, payload) => {
		try {
			const { title, user_id, blocked_user_id } = JSON.parse(payload);
			const block = await blockService.saveBlock({
				title,
				user_id,
				blocked_user_id,
			});

			// req.body.liked_id = req.userId;
			const removeLike = await likeService.remove({
				liked_id: user_id,
				user_id: blocked_user_id,
			});

			const targetSocketId = getUserInfos(blocked_user_id)?.socketId;
			// create a notification as seen and send it
			const notification = await notificationService.saveNotification({
				sender_id: user_id,
				receiver_id: blocked_user_id,
				type: 'BLOCK',
				content: {
					message: 'You have been blocked!',
				},
				is_read: false,
			});

			// Send real-time notification if user is online
			if (targetSocketId) {
				io.to(targetSocketId).emit('blockUser', {
					type: 'BLOCK',
					message: notification,
				});
			}
			io.to(socket.id).emit('blockUser', {
				title,
				user_id,
				blocked_user_id,
				block,
			});
		} catch (err) {
			console.error('blockUser error:', err);
		}
	})
	.on('unblockUser', async (io, socket, payload) => {
		try {
			const { user_id, blocked_user_id } = JSON.parse(payload);
			const unblockResult = await blockService.removeBlock(
				user_id,
				blocked_user_id,
			);

			const targetSocketId = getUserInfos(blocked_user_id)?.socketId;
			// create a notification as seen and send it
			const notification = await notificationService.saveNotification({
				sender_id: user_id,
				receiver_id: blocked_user_id,
				type: 'UNBLOCK',
				content: {
					message: 'You have been unblocked!',
				},
				is_read: false,
			});

			// Send real-time notification if user is online
			if (targetSocketId) {
				io.to(targetSocketId).emit('unblockUser', {
					type: 'UNBLOCK',
					message: notification,
				});
			}
			io.to(socket.id).emit('unblockUser', {
				user_id,
				blocked_user_id,
				unblockResult,
			});
		} catch (err) {
			console.error('unblockUser error:', err);
		}
	})
	.on('getBlocks', async (io, socket, payload) => {
		try {
			const { user1, user2 } = JSON.parse(payload);
			const blocks = await blockService.getBlocks(user1, user2);
			io.to(socket.id).emit('getBlocks', blocks);
		} catch (err) {
			console.error('getBlocks error:', err);
		}
	})
	.on('hasBlockedUser', async (io, socket, payload) => {
		try {
			const { userId, targetUserId } = JSON.parse(payload);
			const hasBlocked = await blockService.hasBlockedUser(
				userId,
				targetUserId,
			);
			console.log('hasBlockedUser result:', hasBlocked);
			io.to(socket.id).emit('hasBlockedUser', hasBlocked);
		} catch (err) {
			console.error('hasBlockedUser error:', err);
		}
	});
