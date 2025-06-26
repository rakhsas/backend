import express from 'express';
import { getTags } from '../../modules/tags/tags.controller';

const router = express.Router();

router.get('/', getTags);

export default router;
