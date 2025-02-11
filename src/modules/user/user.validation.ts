// src/validations/userValidation.js
import { z } from 'zod';

export const userRegistrationSchema = z.object({
	firstName: z.string().min(2),
	lastName: z.string().min(2),
	email: z.string().email(),
	username: z.string().min(3),
	password: z
		.string()
		.min(8)
		.max(12)
		.regex(/[A-Z]/, 'upper-case')
		.regex(/[a-z]/, 'lower-case')
		.regex(/[^\w]/, 'special character')
		.regex(/[0-9]/, 'number'),
});

export const updateUserSchema = z.object({
	firstName: z.string().min(2).optional(),
	lastName: z.string().min(2).optional(),
	email: z.string().email().optional(),
	username: z.string().min(3).optional(),
});
