import { HttpStatus } from 'http-status-ts';
import * as viewersService from './../services/viewers.service';
import { Response } from 'express';

export const getUserViewers = async (req: any, res: Response) => {
	try {
		const viewers = await viewersService.getViewers(req.userId);
		res.status(HttpStatus.OK).json(viewers);
	} catch (err: any) {
		res.status(HttpStatus.BAD_REQUEST).json({ error: err.message });
	}
};

export const getUserViewersCount = async (req: any, res: Response) => {
	try {
		const viewers = await viewersService.getViewersCount(req.userId);
		res.status(HttpStatus.OK).json(viewers);
	} catch (err: any) {
		res.status(HttpStatus.BAD_REQUEST).json({ error: err.message });
	}
};

export const getUserViewersWithRelations = async (req: any, res: Response) => {
	try {
		const viewers = await viewersService.getViewersWithRelations(
			req.userId,
		);
		res.status(HttpStatus.OK).json(viewers);
	} catch (err: any) {
		res.status(HttpStatus.BAD_REQUEST).json({ error: err.message });
	}
};

export const saveUserViewer = async (req: any, res: Response) => {
	try {
		req.body.user_id = req.userId;
		const viewer = await viewersService.save(req.body);
		res.status(HttpStatus.CREATED).json({
			message: 'Viewer created successfully',
			viewer,
		});
	} catch (err: any) {
		res.status(HttpStatus.BAD_REQUEST).json({ error: err.message });
	}
};
export const deleteUserViewer = async (req: any, res: Response) => {};
export const updateUserViewer = async (req: any, res: Response) => {};
