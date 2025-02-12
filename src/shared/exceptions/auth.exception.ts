// throwable exception for authentication errors with 409 status code

// import { HttpStatus } from 'http-status-ts';

export interface Error {
	name: string;
	message: string;
	stack?: string;
	status: number;
}

export class UsernameExistsException extends Error {
	// statusCode: HttpStatus = HttpStatus.CONFLICT;
	status: number;
	constructor(
		message = 'Username already exists. Please try another username.',
	) {
		super(message);
		this.name = this.constructor.name;
		this.status = 409;
	}
}

export class PasswordMismatchException extends Error {
	// statusCode: HttpStatus = HttpStatus.UNAUTHORIZED;
	status: number;
	constructor(
		message = 'The password you entered is incorrect. Please try again.',
	) {
		super(message);
		this.name = this.constructor.name;
		this.status = 401;
	}
}

export class AccessTokenExpiredException extends Error {
	// statusCode: HttpStatus = HttpStatus.UNAUTHORIZED;
	status: number;
	constructor(message = 'Access token has expired. Please login again.') {
		super(message);
		this.name = this.constructor.name;
		this.status = 401;
	}
}

export class ExpiredOtpException extends Error {
	status: number;
	constructor(message = 'OTP has expired. Please request a new OTP.') {
		super(message);
		this.name = this.constructor.name;
		this.status = 401;
	}
}

export class InvalidOtpException extends Error {
	// statusCode: HttpStatus = HttpStatus.UNAUTHORIZED;
	status: number;
	constructor(message = 'Invalid OTP. Please try again.') {
		super(message);
		this.name = this.constructor.name;
		this.status = 401;
	}
}

export class RefreshTokenExpiredException extends Error {
	// statusCode: HttpStatus = HttpStatus.UNAUTHORIZED;
	status: number;
	constructor(message = 'Refresh token has expired. Please login again.') {
		super(message);
		this.name = this.constructor.name;
		this.status = 401;
	}
}

export class InvalidAcessTokenException extends Error {
	// statusCode: HttpStatus = HttpStatus.UNAUTHORIZED;
	status: number;
	constructor(
		message = 'Invalid access token signature. Please login again.',
	) {
		super(message);
		this.name = this.constructor.name;
		this.status = 401;
	}
}

export class InvalidRefreshTokenException extends Error {
	// statusCode: HttpStatus = HttpStatus.UNAUTHORIZED;
	status: number;
	constructor(
		message = 'Invalid refresh token signature. Please login again.',
	) {
		super(message);
		this.name = this.constructor.name;
		this.status = 401;
	}
}

export class AccessTokenNotFoundException extends Error {
	// statusCode: HttpStatus = HttpStatus.UNAUTHORIZED;
	status: number;
	constructor(message = 'Access token not found. Please login again.') {
		super(message);
		this.name = this.constructor.name;
		this.status = 401;
	}
}
export class RefreshTokenNotFoundException extends Error {
	// statusCode: HttpStatus = HttpStatus.UNAUTHORIZED;
	status: number;
	constructor(message = 'Refresh token not found. Please login again.') {
		super(message);
		this.name = this.constructor.name;
		this.status = 401;
	}
}

export class ResetPasswordTokenNotFoundException extends Error {
	// statusCode: HttpStatus = HttpStatus.UNAUTHORIZED;
	status: number;
	constructor(
		message = 'Reset password token not found. Please request a new reset link.',
	) {
		super(message);
		this.name = this.constructor.name;
		this.status = 401;
	}
}
