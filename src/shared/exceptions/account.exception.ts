// import { Error } from "../utils/error.exception";

export class AccountNotVerifiedException extends Error {
	statusCode: number;
	constructor(
		message = 'Account not verified. A verification link has been sent to your email.',
		statusCode = 401,
	) {
		super(message);
		this.statusCode = statusCode;
	}
}
