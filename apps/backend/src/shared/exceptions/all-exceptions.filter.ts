import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

import { ErrorHttpResponse } from '../error-http-response';
import { BaseException } from './base.exception';
import { ErrorCodes } from './error-codes';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(error: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Handling custom exceptions
    if (error instanceof BaseException) {
      const errorResponse = error.getResponse() as ErrorHttpResponse;
      response.status(error.getStatus()).json(errorResponse);
      return;
    }

    // Handling NestJS HTTP exceptions, but not internal server errors
    if (error instanceof HttpException && error.getStatus() < 500) {
      const errorResponse = error.getResponse();
      const finalResponse: ErrorHttpResponse = {
        ...(typeof errorResponse === 'object' ? errorResponse : {}),
        code: ErrorCodes.UNKNOWN,
        message: error.message,
      };

      response.status(error.getStatus()).json(finalResponse);
      return;
    }

    // TODO: handle ZodSerializationException

    let errorMessage: string = 'Unexpected error';

    // Trying to get the error message from the error object
    if (typeof error === 'object' && error !== null) {
      if ('message' in error && typeof error.message === 'string') {
        errorMessage = error.message;
      }
    }

    // Logging the error
    this.logger.error({
      message: errorMessage,
      error,
      stack: error instanceof Error ? error.stack : undefined,
    });

    const errorResponse: ErrorHttpResponse = {
      code: ErrorCodes.UNKNOWN,
      message: 'Unexpected error',
    };

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
}
