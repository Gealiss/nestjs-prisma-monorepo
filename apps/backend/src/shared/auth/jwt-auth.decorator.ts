import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JWT_AUTH_SWAGGER_SECURITY_NAME, JwtAuthGuard } from './jwt-auth.guard';

/**
 * Decorator that ensures only authorized users can access a controller or its endpoint.
 *
 * This decorator adds `Bearer` authentication to the Swagger.
 */
export const JwtAuth = (): MethodDecorator => {
  const guards: Parameters<typeof UseGuards> = [JwtAuthGuard];

  const decorators: Parameters<typeof applyDecorators> = [ApiBearerAuth(JWT_AUTH_SWAGGER_SECURITY_NAME)];

  decorators.push(UseGuards(...guards));

  return applyDecorators(...decorators);
};
