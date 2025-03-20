import HttpStatus from 'http-status';
import * as userService from '../services/user.service';
import * as profileService from '../services/profile.service';
import * as locationService from '../services/location.service';
import * as sexualPreferencesService from '../services/sexual-preferences.service';
import { Response } from 'express';
import { GetUserWithRelationsDTO } from '../dto/user.dto';

export const uploadUserProfile = async (req: any, res: Response) => {
    try {
        const userId = req.userId;
        const mainPicture = (req.files as any)?.['mainPicture']?.[0] || null;
        const pictures = (req.files as any)?.['pictures'] || [];
        
        // Handle profile data passed as a string (this needs to be handled safely)
        let userProfile: GetUserWithRelationsDTO = req.body.profile ? JSON.parse(req.body.profile) : {};

        // If the user uploaded a main picture
        if (mainPicture && mainPicture?.path) {
            userProfile.mainPicture = mainPicture?.path;
            userProfile.pictures = [];

            // Push uploaded pictures into the profile
            (pictures as Express.Multer.File[])?.forEach(
                (file: Express.Multer.File) => {
                    userProfile.pictures?.push(file.path);
                },
            );
        } else {
            // If no new pictures, clean up the mainPicture and other pictures to store only paths from 'uploads'
            userProfile.mainPicture = userProfile?.mainPicture?.slice(
                userProfile.mainPicture.indexOf('uploads'),
            );
            userProfile.pictures = userProfile?.pictures?.map((picture: string) => {
                return picture.slice(picture.indexOf('uploads'));
            });
        }

        // If location data is provided, update it
        if (userProfile.location) {
            userProfile.location.address = userProfile.location?.address;
            userProfile.location.lat = userProfile.location?.lat;
            userProfile.location.lng = userProfile.location?.lng;
        }

        // Now, update the user profile in the database. You can selectively update fields if they are provided.
        await Promise.all([
            userService.update(
                {
                    firstname: userProfile.firstname,
                    lastname: userProfile.lastname,
                    username: userProfile.username,
                },
                { id: userId },
                false,
                false
            ),
            profileService.save({
                bio: userProfile.bio,
                pictures: userProfile.pictures,
                mainpicture: userProfile.mainPicture,
                gender: userProfile.gender,
                interests: userProfile.interests,
                user_id: userId,
                birthdate: userProfile.birthdate,
            }),
            locationService.save({
                user_id: userId,
                lat: userProfile.location?.lat,
                lng: userProfile.location?.lng,
                address: userProfile.location?.address,
            }),
            sexualPreferencesService.save({
                preferences: userProfile.sexualPreferences,
                user_id: userId,
                sexual_orientation: userProfile.sexualOrientation,
            }),
        ]);

        // Response indicating successful update
        res.status(HttpStatus.OK).json("User profile updated successfully");
    } catch (err: any) {
        console.log(err);
        res.status(HttpStatus.BAD_REQUEST).json({
            error: err.message,
        });
    }
};
