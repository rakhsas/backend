import { HttpStatus } from 'http-status-ts';

export class InvalidCredentialsException extends Error {
	statusCode: HttpStatus = HttpStatus.UNAUTHORIZED;
	constructor(
		message = 'Invalid credentials. Check your email and try again.',
	) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class UserAlreadyExistsException extends Error {
	statusCode: HttpStatus = HttpStatus.CONFLICT;
	constructor(message = 'User already exists.') {
		super(message);
		this.name = this.constructor.name;
	}
}

export class UserNotFoundException extends Error {
	statusCode: HttpStatus = HttpStatus.NOT_FOUND;
	constructor(message = 'Please Log in again.') {
		super(message);
		this.name = this.constructor.name;
	}
}
