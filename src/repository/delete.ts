import { config as pool } from '../core/dbconfig/config';
import pg from 'pg';

async function deleteById(tableName: string, id: string) {
	try {
		const query = `DELETE FROM ${tableName} WHERE id = $1 RETURNING *`;

		const result = await (pool as pg.Pool).query(query, [id]);
		if (result.rowCount === 0) {
			console.log(`No record found with id ${id} in ${tableName}`);
			return;
		}
		console.log('User deleted by id:', id);
		return result.rows[0];
	} catch (error) {
		console.error(
			`Error deleting record with id ${id} from ${tableName}`,
			error,
		);
		// throw new Error(`Error deleting record with id ${id} from ${tableName}`)
	}
}

async function deleteByUserName(tableName: string, username: string) {
	try {
		const query = `DELETE FROM ${tableName} WHERE username = $1 RETURNING *`;

		const result = await (pool as pg.Pool).query(query, [username]);
		if (result.rowCount === 0) {
			console.log(
				`No record found with username ${username} in ${tableName}`,
			);
			return;
		}
		console.log('User deleted by username:', username);
		return result.rows[0];
	} catch (error) {
		console.error(
			`Error deleting record with name ${username} from ${tableName}`,
			error,
		);
	}
}

async function deleteByEmail(tableName: string, email: string) {
	try {
		const query = `DELETE FROM ${tableName} WHERE email = $1 RETURNING *`;

		const result = await (pool as pg.Pool).query(query, [email]);

		if (result.rowCount === 0) {
			console.log(`No record found with email ${email} in ${tableName}`);
			return;
		}

		console.log('User deleted by email:', email);
		return result.rows[0];
	} catch (error) {
		console.error(
			`Error deleting record with email ${email} from ${tableName}`,
			error,
		);
	}
}

async function deleteAll(tableName: string) {
	try {
		const query = `DELETE FROM ${tableName} RETURNING *`;
		const result = await (pool as pg.Pool).query(query);
		return (result.rowCount ?? 0) > 0;
	} catch (error) {
		console.error(`Error deleting all records from ${tableName}`, error);
		return false;
	}
}

async function deleteByCondition(tableName: string, condition: any) {
	try {
		const query = `DELETE FROM ${tableName} WHERE ${condition} RETURNING *`;
		const result = await (pool as pg.Pool).query(query);
		return (result.rowCount ?? 0) > 0;
	} catch (error) {
		console.error(`Error deleting all records from ${tableName}`, error);
		return false;
	}
}

export {
	deleteById,
	deleteByUserName,
	deleteByEmail,
	deleteAll,
	deleteByCondition,
};
