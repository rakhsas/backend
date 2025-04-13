import { save } from './save';
import { update, updateOrInsert } from './update';
import {
	count,
	findAll,
	findById,
	findOne,
	findOneByCondition,
	findWithRelations,
	findByCondition,
	findWithRelationsAndConditions,
	findOneWithRelations,
	findWithRelationsAndConditionsPagination,
} from './find';
import { deleteById, deleteByCondition } from './delete';
import { executeSqlQuery } from './query';

export const repository = {
	save,
	update,
	updateOrInsert,
	count,
	findAll,
	findById,
	findOne,
	findOneByCondition,
	findWithRelations,
	findByCondition,
	findWithRelationsAndConditions,
	deleteById,
	deleteByCondition,
	findOneWithRelations,
	findWithRelationsAndConditionsPagination,
	executeSqlQuery,
};
