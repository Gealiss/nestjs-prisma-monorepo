import { Request } from 'express';
import z from 'zod/v4';

export const accessTokenCustomPayloadSchema = z.object({
  // Any custom JWT payload properties should be added here
});

export type AccessTokenCustomPayload = z.infer<typeof accessTokenCustomPayloadSchema>;

export const accessTokenPayloadSchema = accessTokenCustomPayloadSchema.extend({
  sub: z.string(),
});

export type AccessTokenPayload = z.infer<typeof accessTokenPayloadSchema>;

export interface RequestUserData {
  id: number;
}

export interface AuthenticatedRequest extends Request {
  user: RequestUserData;
}
