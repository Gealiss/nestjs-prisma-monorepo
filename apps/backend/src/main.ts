import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { ENV_CONFIG_TOKEN, type EnvConfig, getWinstonOptions } from './config';
import { AppModule } from './modules/app.module';
import { AppEnvironment, LogLevel, validateLogLevelSafe } from './shared';
import { API_KEY_HEADER_NAME, API_KEY_SWAGGER_SECURITY_NAME, JWT_AUTH_SWAGGER_SECURITY_NAME } from './shared/auth';
import { AllExceptionsFilter } from './shared/exceptions';

async function bootstrap() {
  // NOTE: parsed and validated env config is not used here because its is not available yet
  const LOG_LEVEL: LogLevel = (process.env.LOG_LEVEL && validateLogLevelSafe(process.env.LOG_LEVEL)) || LogLevel.Info;
  const USE_JSON_LOG_FORMAT: boolean = process.env.USE_JSON_LOG_FORMAT === 'true';
  const APP_ENV: AppEnvironment = (process.env.APP_ENV as AppEnvironment) || AppEnvironment.Local;
  const APP_NAME = process.env.APP_NAME || 'backend-nestjs';

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // Replacing the Nest logger
    logger: WinstonModule.createLogger(
      getWinstonOptions({
        logLevel: LOG_LEVEL,
        useJsonFormat: USE_JSON_LOG_FORMAT,
        appName: APP_NAME,
      }),
    ),
  });

  // Global exception filter that catches all exceptions and returns a standardized error response
  app.useGlobalFilters(new AllExceptionsFilter());

  const logger = new Logger();

  // If true, the client's IP address is understood as the left-most entry in the X-Forwarded-For header.
  // NOTE: should enable this when a reverse proxy is used
  // app.set('trust proxy', 'loopback');

  app.enableCors({ origin: '*' }); // TODO: change to the actual origin(s)

  app.disable('x-powered-by');

  const envConfig = app.get<EnvConfig>(ENV_CONFIG_TOKEN);

  // Swagger configuration (only for non-production environments)
  if (APP_ENV !== AppEnvironment.Production) {
    const config = new DocumentBuilder()
      .setTitle('Backend NestJS')
      .setDescription('This document describes the API endpoints')
      .setVersion('1.0')
      .setOpenAPIVersion('3.1.1')
      .addBearerAuth(
        {
          type: 'http',
          bearerFormat: 'JWT',
          scheme: 'bearer',
        },
        JWT_AUTH_SWAGGER_SECURITY_NAME,
      )
      .addApiKey(
        {
          type: 'apiKey',
          in: 'header',
          name: API_KEY_HEADER_NAME,
        },
        API_KEY_SWAGGER_SECURITY_NAME,
      )
      .build();
    const documentFactory = () => cleanupOpenApiDoc(SwaggerModule.createDocument(app, config));
    SwaggerModule.setup('swagger', app, documentFactory);
  }

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  await app.listen(envConfig.PORT, () => {
    logger.log(
      `HTTP server is running on port ${envConfig.PORT}.` +
        ` APP_ENV=${envConfig.APP_ENV}, NODE_ENV=${envConfig.NODE_ENV}.`,
    );
  });
}

void bootstrap();
