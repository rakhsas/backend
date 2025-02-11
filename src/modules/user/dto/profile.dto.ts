export enum Gender {
	M = 'M',
	F = 'F',
}
export enum SexualPreferences {
	M = 'M',
	F = 'F',
	B = 'B',
}

export enum Interest {
	VEGAN = 'vegan',
	PIERCING = 'piercing',
	GEEK = 'geek',
}

export class ProfileDto {
	id: string;
	gender: Gender;
	sexualPreferences: SexualPreferences;
	bio: string;
	interests: Interest;
	location: string;
	pictures: string[];

	constructor(body: any) {
		this.id = body.id;
		this.gender = body.gender;
		this.sexualPreferences = body.sexualPreferences;
		this.bio = body.bio;
		this.interests = body.interests;
		this.location = body.location;
		this.pictures = body.pictures;
	}
}

export class ProfileUpdateDto {
	id?: string;
	gender?: Gender;
	sexualPreferences?: SexualPreferences;
	bio?: string;
	interests?: Interest;
	location?: string;
	pictures?: string[];

	constructor(body: any) {
		this.id = body.id;
		this.bio = body.bio;
		this.gender = body.gender;
		this.interests = body.interests;
		this.location = body.location;
		this.pictures = body.pictures;
		this.sexualPreferences = body.sexualPreferences;
	}
}
