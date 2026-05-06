import { CanActivate, ExecutionContext, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ENV_CONFIG_TOKEN, type EnvConfig } from '@/config';
import { BaseException, ErrorCodes } from '../exceptions';

export const API_KEY_HEADER_NAME = 'api-key';
export const API_KEY_SWAGGER_SECURITY_NAME = 'api-key';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(@Inject(ENV_CONFIG_TOKEN) private readonly config: EnvConfig) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.header(API_KEY_HEADER_NAME);

    if (!apiKey) {
      throw new BaseException({
        code: ErrorCodes.AUTH_API_KEY_REQUIRED,
        message: 'API key is required',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    // API key must match one of the configured API keys
    if (![this.config.API_KEY_1, this.config.API_KEY_2].includes(apiKey)) {
      throw new BaseException({
        code: ErrorCodes.AUTH_API_KEY_INVALID,
        message: 'Invalid API key',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    return true;
  }
}
