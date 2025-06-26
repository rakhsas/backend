// throwable exception for authentication errors with 409 statusCode code

//
export interface Error {
	name: string;
	message: string;
	stack?: string;
	statusCodeCode: number;
}

export class UsernameExistsException extends Error {
	// statusCodeCode: HttpstatusCode = HttpstatusCode.CONFLICT;
	statusCode: number;
	constructor(
		message = 'Username already exists. Please try another username.',
	) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = 409;
	}
}

export class PasswordMismatchException extends Error {
	// statusCodeCode: HttpstatusCode = HttpstatusCode.UNAUTHORIZED;
	statusCode: number;
	constructor(
		message = 'The password you entered is incorrect. Please try again.',
	) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = 401;
	}
}

export class PasswordMatchException extends Error {
	// statusCodeCode: HttpstatusCode = HttpstatusCode.UNAUTHORIZED;
	statusCode: number;
	constructor(
		message = 'You have used the same password before. Please try a different one.',
	) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = 400;
	}
}

export class AccessTokenExpiredException extends Error {
	// statusCodeCode: HttpstatusCode = HttpstatusCode.UNAUTHORIZED;
	statusCode: number;
	constructor(message = 'Access token has expired. Please login again.') {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = 401;
	}
}

export class ExpiredOtpException extends Error {
	statusCode: number;
	constructor(message = 'OTP has expired. Please request a new OTP.') {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = 401;
	}
}

export class InvalidOtpException extends Error {
	// statusCodeCode: HttpstatusCode = HttpstatusCode.UNAUTHORIZED;
	statusCode: number;
	constructor(message = 'Invalid OTP. Please try again.') {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = 401;
	}
}

export class RefreshTokenExpiredException extends Error {
	// statusCodeCode: HttpstatusCode = HttpstatusCode.UNAUTHORIZED;
	statusCode: number;
	constructor(message = 'Refresh token has expired. Please login again.') {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = 401;
	}
}

export class InvalidAcessTokenException extends Error {
	// statusCodeCode: HttpstatusCode = HttpstatusCode.UNAUTHORIZED;
	statusCode: number;
	constructor(
		message = 'Invalid access token signature. Please login again.',
	) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = 401;
	}
}

export class InvalidRefreshTokenException extends Error {
	// statusCodeCode: HttpstatusCode = HttpstatusCode.UNAUTHORIZED;
	statusCode: number;
	constructor(
		message = 'Invalid refresh token signature. Please login again.',
	) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = 401;
	}
}

export class AccessTokenNotFoundException extends Error {
	// statusCodeCode: HttpstatusCode = HttpstatusCode.UNAUTHORIZED;
	statusCode: number;
	constructor(message = 'Access token not found. Please login again.') {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = 401;
	}
}
export class RefreshTokenNotFoundException extends Error {
	// statusCodeCode: HttpstatusCode = HttpstatusCode.UNAUTHORIZED;
	statusCode: number;
	constructor(message = 'Refresh token not found. Please login again.') {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = 401;
	}
}

export class ResetPasswordTokenNotFoundException extends Error {
	// statusCodeCode: HttpstatusCode = HttpstatusCode.UNAUTHORIZED;
	statusCode: number;
	constructor(
		message = 'Reset password token not found. Please request a new reset link.',
	) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = 401;
	}
}
