import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest, RequestUserData } from './types';

export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext): RequestUserData => {
  const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
  const user = request.user;

  if (!user) {
    throw new Error('No user data found in request');
  }

  return user;
});
