import express from 'express';
import {
	getUserBlocks,
	unblockUser,
} from '../../modules/block/block.controller';
const router = express.Router();

router.get('/', getUserBlocks);
router.delete('/:userId', unblockUser);

export default router;
