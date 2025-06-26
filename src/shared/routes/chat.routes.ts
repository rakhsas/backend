import express from 'express';
import {
	save,
	getLastConversations,
	getMessagesByConversationId,
} from './../../modules/chat/chat.controller';
const router = express.Router();

router.post('/', save);
router.get('/last', getLastConversations);
router.get('/conversation', getMessagesByConversationId);
// router.get('/relations', getUserViewersWithRelations);
export default router;
