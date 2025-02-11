import express from 'express';
import {
	save,
	remove,
	getLikes,
	getLikesWithRelation,
} from '../../modules/like/like.controller';
import { romoveLikeSchema } from '../../modules/like/validation/like.validation';
import { validateData } from '../utils/validationMiddleware';

const router = express.Router();

router.post('/', save);
router.post('/remove', validateData(romoveLikeSchema), remove);
router.get('/', getLikes);
router.get('/with-relation', getLikesWithRelation);
export default router;
