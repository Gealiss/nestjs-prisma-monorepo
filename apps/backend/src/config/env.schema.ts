import { z } from 'zod';
import { AppEnvironment, LogLevel, NodeEnvironment } from '@/shared';

// NOTE: environment variables (from process.env) are strings
export const envConfigSchema = z
  .object({
    NODE_ENV: z.enum(NodeEnvironment).default(NodeEnvironment.Production),
    APP_ENV: z.enum(AppEnvironment).default(AppEnvironment.Local),
    APP_NAME: z.string().min(1),
    PORT: z.coerce.number().int(),
    TZ: z.string().optional(),

    DATABASE_URL: z.url(),

    LOG_LEVEL: z.enum(LogLevel).default(LogLevel.Info),
    USE_JSON_LOG_FORMAT: z.stringbool().default(false),

    API_KEY_1: z.string().min(1),
    API_KEY_2: z.string().min(1),
    AUTH_JWKS_URL: z.url().optional(),
    AUTH_JWT_SECRET: z.string().min(1).optional(), // Can be used for local tests instead of JWKS
  })
  .superRefine((data, ctx) => {
    if (!data.AUTH_JWKS_URL && !data.AUTH_JWT_SECRET) {
      ctx.addIssue({
        code: 'custom',
        message: 'Either AUTH_JWKS_URL or AUTH_JWT_SECRET must be defined',
        path: ['AUTH_JWKS_URL', 'AUTH_JWT_SECRET'],
      });
    }
  });

export type EnvConfig = z.infer<typeof envConfigSchema>;
