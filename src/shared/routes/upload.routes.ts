import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadUserProfile } from '../../modules/user/controllers/upload.controller';

const router = express.Router();
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(
			null,
			file.fieldname +
				'-' +
				uniqueSuffix +
				path.extname(file.originalname),
		);
	},
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 25 * 1024 * 1024, fieldSize: 25 * 1024 * 1024 },
});
const fileFilter = (
	req: any,
	file: Express.Multer.File,
	cb: multer.FileFilterCallback,
) => {
	if (file.mimetype.startsWith('audio/')) {
		cb(null, true);
	} else {
		cb(new Error('Only audio files are allowed!'));
	}
};
const audioUpload = multer({
	storage: storage,
	limits: { fileSize: 10 * 1024 * 1024, fieldSize: 10 * 1024 * 1024 },
	fileFilter,
});

router.post(
	'/user/upload',
	upload.fields([
		{ name: 'pictures', maxCount: 5 },
		{ name: 'mainPicture', maxCount: 1 },
	]),
	uploadUserProfile,
);
router.post('/chat/audio', audioUpload.single('audio'), (req, res) => {
	if (!req.file) {
		return res.status(400).json({ message: 'No audio file uploaded.' });
	}

	// You can access file info like this:
	const audioPath = req.file.path;

	res.status(200).json({
		message: 'Audio uploaded successfully.',
		file: {
			originalname: req.file.originalname,
			filename: req.file.filename,
			path: audioPath,
			mimetype: req.file.mimetype,
			size: req.file.size,
		},
	});
});
router.use(
	'/uploads',
	express.static(path.join(__dirname, '../../../uploads')),
);
export default router;
