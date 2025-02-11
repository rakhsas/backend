import * as userService from '../../user/services/user.service';
import {
	InvalidCredentialsException,
	UserAlreadyExistsException,
} from '../../../shared/exceptions/user.exception';
import { PasswordMismatchException } from '../../../shared/exceptions/auth.exception';
import jwt from 'jsonwebtoken';
import { CryptoUtil } from '../../../shared/utils/crypto.utils';
import nodemailer from 'nodemailer';
import {
	getResetPasswordEmailTemplate,
	accountVerificationTemplate,
} from '../utils/email.template';
import { LoginDTO } from '../dto/login.dto';
import { CreateUserDto } from '../../user/dto/user.dto';
import { AccountNotVerifiedException } from '../../../shared/exceptions/account.exception';
import * as otpService from './otp.service';

export const login = async (loginDTO: LoginDTO) => {
	try {
		const user = await userService.findByEmail(loginDTO.email);

		if (!user) throw new InvalidCredentialsException();
		const isMatch = await userService.comparePassword(
			loginDTO.password,
			user.password,
		);
		if (!isMatch) throw new PasswordMismatchException();
		if (user.verified === false) {
			accountVerification(user.email);
			throw new AccountNotVerifiedException();
		}
		const { aToken, rToken } = await generateTokens(user);
		const result = await userService.update({ rToken }, { id: user.id });
		if (!result) throw new Error('Error updating refresh token');
		return { aToken, rToken };
	} catch (err) {
		throw err;
	}
};

export const generateTokens = async (user: any) => {
	try {
		const payload = {
			sub: CryptoUtil.encrypt(
				user.id,
				process.env.PAYLOAD_ENCRYPTION_KEY || '',
			),
		};
		const aToken = jwt.sign(payload, process.env.ATOKEN_SECRET || '', {
			expiresIn: process.env.ATOKEN_VALIDITY_DURATION,
		});
		const rToken = jwt.sign(payload, process.env.RTOKEN_SECRET || '', {
			expiresIn: process.env.RTOKEN_VALIDITY_DURATION,
		});
		return {
			aToken,
			rToken,
		};
	} catch (err) {
		console.log(err);
		throw err;
	}
};

export const register = async (registerDTO: CreateUserDto) => {
	try {
		const user = await userService.findByEmail(registerDTO.email);
		if (user) throw new UserAlreadyExistsException();

		const createdUser: CreateUserDto = await userService.save(registerDTO);
		accountVerification(createdUser.email);
		return createdUser;
	} catch (err) {
		throw err;
	}
};

export const accountVerification = async (email: string) => {
	const verificationLink = generateVerificationLink(email);
	await sendMail(
		email,
		verificationLink,
		'Account Verification',
		accountVerificationTemplate,
	);
};

export const generateVerificationLink = (email: string) => {
	try {
		const payload = {
			sub: CryptoUtil.encrypt(
				email,
				process.env.PAYLOAD_ENCRYPTION_KEY || '',
			),
		};
		const verificationToken = jwt.sign(
			payload,
			process.env.VTOKEN_SECRET || '',
			{ expiresIn: process.env.VERIFICATION_TOKEN_DURATION },
		);
		return `${process.env.CLIENT_URL}/api/authenticate/verify?csf=${verificationToken}`;
	} catch (err) {
		throw err;
	}
};

export const resetPasswordRequest = async (email: string) => {
	try {
		const user = await userService.findByEmail(email);
		if (!user) throw new InvalidCredentialsException();
		await generateAndSendOtp(user);
	} catch (err) {
		throw err;
	}
};

export const generateAndSendOtp = async (user: any) => {
	const otp = await otpService.OtpProcess(user);
	await sendMail(
		user.email,
		otp.toString(),
		'Password Reset',
		getResetPasswordEmailTemplate,
	);
};

async function sendMail(
	to: string,
	content: string,
	subject: string,
	fn: (a: string) => string,
) {
	try {
		const mailOptions = getMailOptions(to, subject, fn(content));
		await transporter.sendMail(mailOptions);
		console.log('Email sent successfully');
	} catch (error) {
		console.error('Error sending password reset email:', error);
	}
}

export const resetPasswordVerification = async (
	password: string,
	userId: string,
) => {
	try {
		const result = await userService.update(
			{ password: password },
			{ id: userId },
		);
		return result
			? 'Password reseted successfully'
			: 'Please User different Password';
	} catch (err) {
		console.log(err);
		throw err;
	}
};

function generateResetLink(user: any) {
	const payload = {
		sub: CryptoUtil.encrypt(
			user.id,
			process.env.PAYLOAD_ENCRYPTION_KEY || '',
		),
	};
	const resetToken = jwt.sign(payload, process.env.ATOKEN_SECRET || '', {
		expiresIn: process.env.RESET_TOKEN_DURATION,
	});
	return `http://${process.env.CLIENT_URL}/api/authenticate/reset-password-ver?csf=${resetToken}`;
}

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL, // Your Gmail address
		pass: process.env.GMAIL_APP_PASSWORD, // App-specific password or Gmail password
	},
});

function getMailOptions(to: string, subject: string, template: string) {
	const mailOptions = {
		from: 'no-reply@t.t',
		to: to,
		subject: subject,
		html: template,
	};
	return mailOptions;
}

export async function verifyEmail(token: string): Promise<boolean> {
	try {
		const payload = jwt.verify(token, process.env.VTOKEN_SECRET || '');
		const email = CryptoUtil.decrypt(
			payload.sub,
			process.env.PAYLOAD_ENCRYPTION_KEY || '',
		);
		const result = await userService.update({ verified: true }, { email });
		return result;
	} catch (err) {
		throw err;
	}
}

export async function verifyOTP(otp: string, email: string): Promise<boolean> {
	try {
		const user = await userService.findByEmail(email);
		if (!user) throw new InvalidCredentialsException();

		const result = await otpService.verifyOTP(user, otp);
		return result;
	} catch (err) {
		throw err;
	}
}
