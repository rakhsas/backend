import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import passwordRoutes from './password.routes';
import likesRoutes from './likes.routes';

// import authMiddleware from '../middleware/auth.middleware.js';
import express from 'express';
import authMiddleware from '../middleware/auth.middleware';

export default (app: express.Application) => {
	app.use('/api/user', userRoutes);
	app.use('/api/authenticate', authRoutes);
	app.use('/api', passwordRoutes);
	app.use('/api/likes', authMiddleware, likesRoutes);
};
