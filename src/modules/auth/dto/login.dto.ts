export class LoginDTO {
	email: string;
	password: string;
	constructor(body: any) {
		this.email = body.email;
		this.password = body.password;
	}
}
