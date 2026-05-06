import { CanActivate, ExecutionContext, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
// import { PrismaClient } from '@repo/database';
import { Request } from 'express';
import { createRemoteJWKSet, JWTVerifyResult, errors as joseErrors, jwtVerify } from 'jose';
import { ENV_CONFIG_TOKEN, type EnvConfig } from '@/config';
import { BaseException, ErrorCodes } from '../exceptions';
import { AccessTokenPayload, AuthenticatedRequest, accessTokenPayloadSchema } from './types';

export const JWT_AUTH_SWAGGER_SECURITY_NAME = 'jwt-auth';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger: Logger = new Logger(JwtAuthGuard.name);

  private jwks?: ReturnType<typeof createRemoteJWKSet>;

  constructor(
    // private readonly prisma: PrismaClient,
    @Inject(ENV_CONFIG_TOKEN) private readonly config: EnvConfig,
  ) {
    // If no JWT secret is configured, use JWKS from the auth server
    if (!this.config.AUTH_JWT_SECRET) {
      // Should never happen
      if (!this.config.AUTH_JWKS_URL) {
        throw new Error('AUTH_JWKS_URL is not configured');
      }
      this.jwks = createRemoteJWKSet(new URL(this.config.AUTH_JWKS_URL));
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new BaseException({
        code: ErrorCodes.AUTH_ACCESS_TOKEN_REQUIRED,
        message: 'Access token is required',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    let payload: JWTVerifyResult<AccessTokenPayload>['payload'];
    try {
      if (this.config.AUTH_JWT_SECRET) {
        const secret = new TextEncoder().encode(this.config.AUTH_JWT_SECRET);
        payload = (await jwtVerify<AccessTokenPayload>(token, secret)).payload;
      } else if (this.jwks) {
        payload = (await jwtVerify<AccessTokenPayload>(token, this.jwks)).payload;
      } else {
        throw new Error('No JWT strategy configured');
      }
    } catch (error) {
      throw this.mapJwtVerifyError(error);
    }

    // Validate the token payload
    const payloadParseResult = accessTokenPayloadSchema.safeParse(payload);
    if (!payloadParseResult.success) {
      this.logger.error({ message: 'Invalid access token payload', issues: payloadParseResult.error.issues });
      throw new BaseException({
        code: ErrorCodes.UNKNOWN,
        message: 'Internal server error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    // Here we can fetch user from database, allow or deny access based on some logic
    // And attach user data to request object
    // request.user = user satisfies RequestUserData;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.header('authorization')?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private mapJwtVerifyError(error: unknown): unknown {
    if (error instanceof joseErrors.JWTExpired) {
      return new BaseException({
        code: ErrorCodes.AUTH_ACCESS_TOKEN_EXPIRED,
        message: 'Access token expired',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    if (
      error instanceof joseErrors.JWSSignatureVerificationFailed ||
      error instanceof joseErrors.JWTInvalid ||
      error instanceof joseErrors.JWSInvalid ||
      error instanceof joseErrors.JOSENotSupported ||
      error instanceof joseErrors.JWKSNoMatchingKey // Also appears when the token is valid but random
    ) {
      return new BaseException({
        code: ErrorCodes.AUTH_ACCESS_TOKEN_INVALID,
        message: 'Invalid access token',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    return error;
  }
}
