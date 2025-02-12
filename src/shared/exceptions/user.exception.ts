// import { HttpStatus } from 'http-status-ts';

export class InvalidCredentialsException extends Error {
	// statusCode: HttpStatus = HttpStatus.UNAUTHORIZED;
	status: number;
	constructor(
		message = 'Invalid credentials. Check your email and try again.',
	) {
		super(message);
		this.name = this.constructor.name;
		this.status = 401;
	}
}

export class UserAlreadyExistsException extends Error {
	// statusCode: HttpStatus = HttpStatus.CONFLICT;
	status: number;
	constructor(message = 'User already exists.') {
		super(message);
		this.name = this.constructor.name;
		this.status = 409;
	}
}

export class UserNotFoundException extends Error {
	// statusCode: HttpStatus = HttpStatus.NOT_FOUND;
	status: number;
	constructor(message = 'Please Log in again.') {
		super(message);
		this.name = this.constructor.name;
		this.status = 404;
	}
}
