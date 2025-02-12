import { HttpStatus } from 'http-status-ts';
import * as userService from './../services/user.service';
import { Response } from 'express';
import { HttpStatusWrapper } from '../../../shared/utils/http-status.class';

export const getUsersWithRelations = async (req: any, res: Response) => {
	try {
		const users = await userService.getAllUsersWithRelations();
		res.status(await HttpStatusWrapper.getStatus('OK')).json(users);
	} catch (err: any) {
		res.status(await HttpStatusWrapper.getStatus('BAD_REQUEST')).json({
			error: err.message,
		});
	}
};
