import jwt from 'jsonwebtoken';
import { ResetPasswordTokenNotFoundException } from '../exceptions/auth.exception';
import { CryptoUtil } from '../utils/crypto.utils';
import { HttpStatus } from 'http-status-ts';
import { NextFunction } from 'express';

export default async function resetMiddleware(
	req: any,
	res: any,
	next: NextFunction,
) {
	const csfParam = req.query.csf;
	try {
		if (!csfParam) {
			throw new ResetPasswordTokenNotFoundException();
		}
		if (!process.env.ATOKEN_SECRET) {
			throw new Error('ATOKEN_SECRET is not defined');
		}
		const decoded = jwt.verify(csfParam, process.env.ATOKEN_SECRET || '');
		console.log(decoded.sub, ': sub');
		const decryptedSub = CryptoUtil.decrypt(
			decoded.sub,
			process.env.PAYLOAD_ENCRYPTION_KEY || '',
		);
		req.userId = decryptedSub;
		next();
	} catch (err: any) {
		if (err.name === 'TokenExpiredError') {
			res.status(HttpStatus.UNAUTHORIZED).json({
				error: 'Reset password token expired. Please request a new one.',
			});
		} else if (err.name === 'ResetPasswordTokenNotFoundException') {
			// res.status(HttpStatus.UNAUTHORIZED).json({ error: "Reset password token not found." });
			throw err;
		} else {
			res.status(HttpStatus.UNAUTHORIZED).json({
				error: 'Invalid reset password token.',
			});
		}
	}
}
