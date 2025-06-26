import express from 'express';
import {
	resetPasswordRequest,
	resetPasswordVerification,
	verifyOTP,
} from '../../modules/auth/auth.controller';
import { resetPasswordSchema } from '../../modules/auth/auth.validation';
import resetMiddleware from '../middleware/reset.middleware';
import { validateData } from '../utils/validationMiddleware';

const router = express.Router();

router.post('/forgot-password/otp', resetPasswordRequest);
router.post('/forgot-password/verify', verifyOTP);
router.post(
	'/forgot-password/reset-password-ver',
	resetMiddleware,
	validateData(resetPasswordSchema),
	resetPasswordVerification,
);
export default router;
