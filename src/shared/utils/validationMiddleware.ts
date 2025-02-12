import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

import { HttpStatusWrapper } from './http-status.class';

export function validateData(schema: z.ZodObject<any, any>) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse(req.body);
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const errorMsg =
					error.errors[0].path.toString().toUpperCase() +
					' ' +
					error.errors[0].message;
				res.status(
					await HttpStatusWrapper.getStatus('BAD_REQUEST'),
				).json({
					error: 'Invalid data',
					details: errorMsg,
				});
			} else {
				res.status(
					await HttpStatusWrapper.getStatus('INTERNAL_SERVER_ERROR'),
				).json({
					error: 'Internal Server Error',
				});
			}
		}
	};
}
