import z from 'zod';

export const romoveLikeSchema = z
	.object({
		user_id: z.string().uuid(),
	})
	.strict();
