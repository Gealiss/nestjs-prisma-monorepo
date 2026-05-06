/** biome-ignore-all lint/complexity/noStaticOnlyClass: NestJS module */
import { DynamicModule, Module } from '@nestjs/common';
import { config } from 'dotenv';
import { EnvConfig, envConfigSchema } from './env.schema';

export const ENV_CONFIG_TOKEN = Symbol('ENV_CONFIG');

/**
 * The config module is used to parse and validate the environment variables against a schema.
 * It also could load the environment variables from a file.
 */
@Module({})
export class ConfigModule {
  static forRoot(options?: {
    /**
     * Whether to load environment variables from a file.
     * If true, the `envFilePath` should be provided (defaults to `.env`).
     */
    loadFromEnvFile?: boolean;
    /**
     * The path to the environment file.
     * If `loadFromEnvFile` is true, this should be provided (defaults to `.env`).
     */
    envFilePath?: string;
    /**
     * Whether to make the config module global.
     * If true, the config module will be available globally.
     */
    isGlobal?: boolean;
  }): DynamicModule {
    if (options?.loadFromEnvFile === true) {
      config({ path: options.envFilePath });
    }

    return {
      module: ConfigModule,
      global: options?.isGlobal || false,
      providers: [
        {
          provide: ENV_CONFIG_TOKEN,
          useFactory: (): EnvConfig => {
            const validationResult = envConfigSchema.safeParse(process.env);

            if (!validationResult.success) {
              const errors = validationResult.error.issues.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
              }));

              throw new Error(`Environment variables validation failed:\n${JSON.stringify(errors, null, 2)}`);
            }

            return validationResult.data;
          },
        },
      ],
      exports: [ENV_CONFIG_TOKEN],
    };
  }
}
