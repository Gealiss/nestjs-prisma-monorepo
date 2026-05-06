import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { HttpLoggerMiddleware } from '@/shared';
import { ConfigModule } from '../config';
import { DatabaseModule } from '../infra/database/database.module';
import { HealthController } from './health.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, UsersModule],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe, // validate the request body, query, and params
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor, // required in order to validate the response bodies
    },
  ],
})
export class AppModule implements NestModule {
  // Log every HTTP request, except for requests with methods OPTIONS and HEAD, plus `/health`
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpLoggerMiddleware)
      .exclude({ path: '*', method: RequestMethod.OPTIONS })
      .exclude({ path: '*', method: RequestMethod.HEAD })
      .exclude({ path: 'health', method: RequestMethod.GET })
      .forRoutes('*'); // Apply to all routes
  }
}
