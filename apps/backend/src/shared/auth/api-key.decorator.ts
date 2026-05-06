import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';

import { API_KEY_SWAGGER_SECURITY_NAME, ApiKeyAuthGuard } from './api-key-auth.guard';

/**
 * Decorator that ensures a correct API key is provided to access a controller or its endpoint.
 *
 * This decorator uses the following guards:
 * - `ApiKeyAuthGuard`: Verifies API key authentication.
 */
export const ApiKeyRequired = (): MethodDecorator => {
  const guards: Parameters<typeof UseGuards> = [ApiKeyAuthGuard];

  const decorators: Parameters<typeof applyDecorators> = [ApiSecurity(API_KEY_SWAGGER_SECURITY_NAME)];

  decorators.push(UseGuards(...guards));

  return applyDecorators(...decorators);
};
