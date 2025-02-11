import { HttpStatus } from 'http-status-ts';
import * as userService from './../services/user.service';
import { Response } from 'express';

export const getUsersWithRelations = async (req: any, res: Response) => {
	try {
		const users = await userService.getAllUsersWithRelations();
		res.status(HttpStatus.OK).json(users);
	} catch (err: any) {
		res.status(HttpStatus.BAD_REQUEST).json({ error: err.message });
	}
};
