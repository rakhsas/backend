import * as tagsService from './tags.service';
import HttpStatus from 'http-status';
import { Response } from 'express';

export const getTags = async (req: any, res: Response) => {
	try {
		const result = await tagsService.getTags();
		res.status(HttpStatus.OK).json(result);
	} catch (err: any) {
		res.status(HttpStatus.BAD_REQUEST).json({
			error: err.message,
		});
	}
};

export const saveUserTags = async (req: any, res: Response) => {
	try {
		const userId = req.userId;
		req.body.userId = userId;
		const result = await tagsService.saveUserTags(req.body);
		res.status(HttpStatus.OK).json(result);
	} catch (err: any) {
		res.status(HttpStatus.BAD_REQUEST).json({
			error: err.message,
		});
	}
};
