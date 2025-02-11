import { repository } from '../../../repository';
import * as bcrypt from 'bcrypt-ts';
import { IRelations } from '../../../shared/utils/interfaces';

const save = async (UserData: any) => {
	try {
		const userData = await hashPassword(UserData);
		const newUser = await repository.save('users', userData);
		return newUser;
	} catch (error) {
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

const hashPassword = async (UserData: any) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(UserData.password, salt);
		UserData.password = hashedPassword;
		return UserData;
	} catch (error) {}
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
};
