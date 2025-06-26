import express from 'express';
import {
	save,
	remove,
	getLikes,
	getLikesWithRelation,
	hasLikedUser,
	areFriends,
} from '../../modules/like/like.controller';

const router = express.Router();

router.post('/', save);
router.post('/remove', remove);
router.get('/', getLikes);
router.post('/hasLiked', hasLikedUser);
router.get('/relations', getLikesWithRelation);
router.get('/getFriendship/:id', areFriends);
export default router;
