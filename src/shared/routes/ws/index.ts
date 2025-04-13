import { Server } from 'socket.io';
import { wsAuthMiddleware } from '../../middleware/ws.middleware';
import { chatWsRouter } from './chat.routes';
interface UserInfos {
	socketId: string;
	currentConversation: string | null;
}
export const connectedUsers = new Map<string, UserInfos>();
export const setupWsRoutes = (io: Server) => {
	io.use(wsAuthMiddleware);

	chatWsRouter.register(io);
	io.on('connection', socket => {
		// Apply per-connection middleware if needed
		// socket.use(someMiddleware);
		console.log(`User connected: ${(socket as any).userId}`);
		const userId = (socket as any).userId;
		if (connectedUsers.has(userId)) {
			const existingSocketId = connectedUsers.get(userId)?.socketId || '';
			io.to(existingSocketId).disconnectSockets(true);
		}
		connectedUsers.set(userId, {
			socketId: socket.id,
			currentConversation: null,
		});

		socket.on('disconnect', () => {
			console.log(`User disconnected: ${(socket as any).userId}`);
			connectedUsers.delete((socket as any).userId);
		});
	});
};
