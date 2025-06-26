import z from 'zod';

export const profileSchema = z.object({
	gender: z.string(),
	sexualPreferences: z.string(),
	bio: z.string(),
	location: z.string(),
	pictures: z.array(z.string()),
	interests: z.string(),
});

export const profileUpdateSchema = z.object({
	gender: z.string().optional(),
	sexualPreferences: z.string().optional(),
	bio: z.string().optional(),
	location: z.string().optional(),
	pictures: z.array(z.string()).optional(),
	interests: z.string().optional(),
});
