import express from 'express';
import {
    login,
    register,
    verifyEmail,
    googleAuthentication
} from '../../modules/auth/auth.controller';
import { validateData } from '../utils/validationMiddleware';
import {
    loginSchema,
} from '../../modules/auth/auth.validation';
import { userRegistrationSchema } from '../../modules/user/user.validation';
import authGoogle from './auth.google';
import passport from 'passport';

const router = express.Router();
router.post('/register', validateData(userRegistrationSchema), register);
router.post('/login', validateData(loginSchema), login);
router.get('/verify', verifyEmail);
const googleAuth = authGoogle;
router.get(
    '/google',
    googleAuth,
    passport.authenticate('google',{
            scope:
                ['profile', 'email']
        }
    ));
router.get(
    '/google/callback',
    googleAuth,
    passport.authenticate('google',
        { failureRedirect: '/' }),
    (req, res) => {
        googleAuthentication(req, res);
    }
);

export default router;
