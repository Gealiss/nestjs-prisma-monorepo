import z from 'zod/v4';

export const errorHttpResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
});

export type ErrorHttpResponse = z.infer<typeof errorHttpResponseSchema>;
