import { z } from 'zod';

export const BlocksQuerySchema = z.object({
	offset: z.coerce.number().min(0).default(0),
	limit: z.coerce.number().min(0).max(100).default(3),
});

export type BlocksQueryDto = z.infer<typeof BlocksQuerySchema>;
