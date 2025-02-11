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
} from './find';
import { deleteById, deleteByCondition } from './delete';
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
};
