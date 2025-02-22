// src/dtos/userDto.js
export class CreateUserDto {
	id?: string;
	firstName: string;
	lastName: string;
	email: string;
	username: string;
	verified: boolean;
	password: string;
	provider?: string;
	constructor(body: any) {
		this.firstName = body.firstName;
		this.lastName = body.lastName;
		this.email = body.email;
		this.username = body.username;
		this.password = body.password;
		this.verified = body.verified || false;
	}
}

export class UpdateUserDto {
	firstName: string;
	lastName: string;
	email: string;
	username: string;

	constructor(body: any) {
		this.firstName = body.firstName;
		this.lastName = body.lastName;
		this.email = body.email;
		this.username = body.username;
	}
}
