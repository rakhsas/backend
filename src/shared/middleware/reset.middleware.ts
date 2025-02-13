import jwt from 'jsonwebtoken';
import { ResetPasswordTokenNotFoundException } from '../exceptions/auth.exception';
import { CryptoUtil } from '../utils/crypto.utils';
import { NextFunction } from 'express';
import HttpStatus from 'http-status';

export default async function resetMiddleware(
	req: any,
	res: any,
	next: NextFunction,
) {
	const cookies = req.cookies;
	const { csfParam } = cookies;
	try {
		if (!csfParam) {
			throw new ResetPasswordTokenNotFoundException();
		}
		if (!process.env.RTOKEN_SECRET) {
			throw new Error('RTOKEN_SECRET is not defined');
		}
		const decoded = jwt.verify(csfParam, process.env.RTOKEN_SECRET || '');
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
			res.status(HttpStatus.UNAUTHORIZED).json({ error: "Reset password token not found." });
		} else {
			res.status(HttpStatus.UNAUTHORIZED).json({
				error: 'Invalid reset password token.',
			});
		}
	}
}
