export class RepositoryExceptionUpdate extends Error {
	statusCode: number;
	constructor(
		message = 'Error updating the entity',
		statusCode = 500,
	) {
		super(message);
		this.statusCode = statusCode;
	}
}
