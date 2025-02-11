import express from 'express';
import {
	resetPasswordRequest,
	verifyOTP,
} from '../../modules/auth/auth.controller';

const router = express.Router();

router.post('/forgot-password/otp', resetPasswordRequest);
router.post('/forgot-password/verify', verifyOTP);
export default router;
