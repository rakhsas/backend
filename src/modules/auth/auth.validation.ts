import z from 'zod';

export const loginSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.min(8)
		.max(12)
		.regex(/[A-Z]/, 'Must contain at least one upper-case letter')
		.regex(/[a-z]/, 'Must contain at least one lower-case letter')
		.regex(/[^\w]/, 'Must contain at least one special character')
		.regex(/[0-9]/, 'Must contain at least one number'),
});

export const resetPasswordSchema = z.object({
	password: z
		.string()
		.min(8)
		.max(12)
		.regex(/[A-Z]/, 'Must contain at least one upper-case letter')
		.regex(/[a-z]/, 'Must contain at least one lower-case letter')
		.regex(/[^\w]/, 'Must contain at least one special character')
		.regex(/[0-9]/, 'Must contain at least one number'),
});
