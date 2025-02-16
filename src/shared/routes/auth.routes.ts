import express from 'express';
import {
	login,
	register,
	verifyEmail,
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
    passport.authenticate('google',
        {
            scope:
                ['profile', 'email']
        }
    ));
router.get(
    '/google/callback',
		googleAuth,
        passport.authenticate('google', { failureRedirect: '/' }),
            (req, res) => {
                const userData = req.user as any;
                console.log('req Cookies -> ', req.cookies);
                const firstLogin = req.cookies.firstLogin;
                const access_token = req.cookies.access_token;
                const refreshToken = req.cookies.refreshToken;
                res.cookie('firstLogin', firstLogin);
                res.cookie('access_token', access_token);
                res.cookie('refreshToken', refreshToken);
                if (!userData || !userData.token) {
                    return res.redirect('http://localhost:3000/login?error=NoToken');
                }
                // console.log(res.cookie);
                return res.send('<html><body>IT\'s working</body></html>')
            }
);

export default router;
