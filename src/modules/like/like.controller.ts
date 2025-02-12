import { HttpStatus } from 'http-status-ts';
import * as likeService from './like.service';
import { Response } from 'express';
import { HttpStatusWrapper } from '../../shared/utils/http-status.class';

export const save = async (req: any, res: Response) => {
	try {
		req.body.user_id = req.userId;
		const result = await likeService.save(req.body);
		res.status(await HttpStatusWrapper.getStatus('CREATED')).json(result);
	} catch (err: any) {
		throw err;
	}
};

export const remove = async (req: any, res: Response) => {
	try {
		req.body.liked_id = req.userId;
		await likeService.remove(req.body);
		res.status(await HttpStatusWrapper.getStatus('OK')).json(
			'Like removed',
		);
	} catch (err: any) {
		res.status(await HttpStatusWrapper.getStatus('NOT_FOUND')).json({
			error: err.message,
		});
	}
};

export const getLikes = async (req: any, res: Response) => {
	try {
		const result = await likeService.getLikes(req.userId);
		res.status(await HttpStatusWrapper.getStatus('OK')).json(result);
	} catch (err: any) {
		res.status(await HttpStatusWrapper.getStatus('NOT_FOUND')).json({
			error: err.message,
		});
	}
};

export const getLikesWithRelation = async (req: any, res: Response) => {
	try {
		const result = await likeService.getLikesWithRelation(req.userId);
		res.status(await HttpStatusWrapper.getStatus('OK')).json(result);
	} catch (err: any) {
		res.status(await HttpStatusWrapper.getStatus('NOT_FOUND')).json({
			error: err.message,
		});
	}
};
