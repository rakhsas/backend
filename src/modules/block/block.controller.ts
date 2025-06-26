import * as blockService from './block.service';
import HttpStatus from 'http-status';
import { Response } from 'express';
import { BlocksQuerySchema } from './queries.validation';

export const getUserBlocks = async (req: any, res: Response) => {
	try {
		const queryParams = BlocksQuerySchema.parse(req.query);
		const blocks = await blockService.getUserBlocks(
			req.userId,
			queryParams,
		);
		res.status(HttpStatus.CREATED).json(blocks || []);
	} catch (err: any) {
		res.status(HttpStatus.BAD_REQUEST).json({
			error: err.message,
		});
	}
};

export const unblockUser = async (req: any, res: Response) => {
	try {
		const { userId } = req.params;
		if (!userId) {
			return res
				.status(HttpStatus.BAD_REQUEST)
				.json({ error: 'User ID is required' });
		}
		await blockService.removeBlock(req.userId, userId);
		res.status(HttpStatus.OK).json({
			message: 'User unblocked successfully',
		});
	} catch (err: any) {
		res.status(HttpStatus.BAD_REQUEST).json({
			error: err.message,
		});
	}
};
