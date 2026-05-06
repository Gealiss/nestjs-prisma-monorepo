import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorHttpResponse } from '../error-http-response';
import { ErrorCode } from './error-codes';

export class BaseException extends HttpException {
  constructor(params: {
    message: string;
    code: ErrorCode;
    statusCode: HttpStatus;
    details?: unknown;
  }) {
    const response: ErrorHttpResponse = {
      code: params.code,
      message: params.message,
      details: params.details ?? undefined,
    };
    super(response, params.statusCode);
  }
}
