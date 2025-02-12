// import { HttpStatus } from 'http-status-ts';
import * as profileService from '../services/profile.service';
import { ProfileDto } from '../dto/profile.dto';
import { Response } from 'express';
import { HttpStatusWrapper } from '../../../shared/utils/http-status.class';

export const saveProfile = async (req: any, res: Response) => {
	try {
		req.body.user_id = req.userId;
		const newUser = await profileService.save(req.body as ProfileDto);
		res.status(await HttpStatusWrapper.getStatus('CREATED')).json({
			message: 'Profile created successfully',
			user: newUser,
		});
	} catch (err: any) {
		res.status(await HttpStatusWrapper.getStatus('BAD_REQUEST')).json({
			error: err.message,
		});
	}
};

export const getProfile = async (req: any, res: Response) => {
	try {
		const profile = await profileService.get(req.userId);
		res.status(await HttpStatusWrapper.getStatus('OK')).json(profile);
	} catch (err: any) {
		res.status(await HttpStatusWrapper.getStatus('BAD_REQUEST')).json({
			error: err.message,
		});
	}
};

export const updateProfile = async (req: any, res: Response) => {
	try {
		req.body.id = req.userId;
		const updatedProfile = await profileService.update(
			req.body as ProfileDto,
		);
		res.status(await HttpStatusWrapper.getStatus('OK')).json(
			updatedProfile,
		);
	} catch (err: any) {
		res.status(await HttpStatusWrapper.getStatus('BAD_REQUEST')).json({
			error: err.message,
		});
	}
};
