import express from 'express';
import {
	save,
	getLastConversations,
	getMessagesByConversationId,
	getLastCallConversations,
} from './../../modules/chat/chat.controller';
const router = express.Router();

router.post('/', save);
router.get('/last', getLastConversations);
router.get('/lastCalls', getLastCallConversations);
router.get('/conversation', getMessagesByConversationId);
// router.get('/relations', getUserViewersWithRelations);
export default router;
