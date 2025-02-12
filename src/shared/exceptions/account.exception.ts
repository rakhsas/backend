// import { Error } from "../utils/error.exception";

export class AccountNotVerifiedException extends Error {
	status: number;
	constructor(
		message = 'Account not verified. A verification link has been sent to your email.',
		status = 401,
	) {
		super(message);
		this.status = status;
	}
}
