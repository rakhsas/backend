import { repository } from '../../../repository';
import { IRelations } from '../../../shared/utils/interfaces';
import bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/user.dto';

const save = async (userData: CreateUserDto) => {
	try {
		// Create a copy of the user data to avoid mutating the original object
		const userDataCopy = { ...userData };

		// Hash the password if it exists
		if (userDataCopy.password) {
			userDataCopy.password = await hashPassword(userDataCopy.password);
		}

		// Save the user data to the repository
		const newUser = await repository.save('users', userDataCopy);
		return newUser;
	} catch (error) {
		// Re-throw the error for the caller to handle
		throw error;
	}
};

const findByEmail = async (email: string): Promise<any> => {
	try {
		const user = await repository.findOneByCondition('users', { email });
		return user;
	} catch (error) {
		throw error;
	}
};

const findById = async (id: string) => {
	try {
		const user = await repository.findOneByCondition('users', { id });
		return user;
	} catch (error) {
		throw error;
	}
};

const hashPassword = async (password: any) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		return hashedPassword;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const comparePassword = async (password: string, hashedPassword: string) => {
	try {
		return await bcrypt.compare(password, hashedPassword);
	} catch (error) {
		throw error;
	}
};

const update = async (data: any, condition: any) => {
	try {
		return await repository.update('users', data, condition, true);
	} catch (error) {
		throw error;
	}
};

const getAllUsersWithRelations = async () => {
	const relations: IRelations[] = [
		{
			tableName: 'profile',
			foreignKey: 'user_id',
		},
	];
	const res = await repository.findWithRelations('users', 'id', relations);
	res.map(row => {
		delete row.id;
		delete row.password;
	});
	return res;
};

export {
	save,
	findByEmail,
	comparePassword,
	findById,
	update,
	getAllUsersWithRelations,
	hashPassword,
};
