import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import * as authService from '../../modules/auth/services/auth.service';
import { CreateUserDto } from '../../modules/user/dto/user.dto';

dotenv.config();

const router = express.Router();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
            scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            const { id, displayName, emails, photos, name, provider } = profile;
            console.log('profile -> ', profile)
            const user = {
                username: displayName,
                email: emails?.[0]?.value || '',
                firstName: name?.givenName || '',
                lastName: name?.familyName || '',
                password: 'Mdarify1337@',
                verified: true,
                provider: provider,
            };
            const createUserDto = await authService.register(user)
            const token = jwt.sign({ 
                    userId: createUserDto.id 
                },
                process.env.JWT_SECRET as string, {
                expiresIn: '1h',
            });

            return done(null, { user: createUserDto, token });
        }
    )
);
passport.serializeUser((user: any, done) => {
    done(null, user);
});
passport.deserializeUser((user: any, done) => {
    done(null, user);
});
export default router;
