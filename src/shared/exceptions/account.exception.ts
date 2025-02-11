import { HttpStatus } from 'http-status-ts';

export class AccountNotVerifiedException extends Error {
	statusCode: HttpStatus = HttpStatus.UNAUTHORIZED;
	constructor(
		message = 'Account not verified. A verification link has been sent to your email.',
	) {
		super(message);
		this.name = this.constructor.name;
	}
}
