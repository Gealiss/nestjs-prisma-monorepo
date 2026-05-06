import { HttpStatus } from '@nestjs/common';
import z from 'zod/v4';
import { BaseException } from './base.exception';
import { ErrorCodes } from './error-codes';

export const validationExceptionDetailsSchema = z.array(
  z.object({
    code: z.string().optional(),
    input: z.unknown().optional(),
    path: z.array(z.union([z.string(), z.number(), z.symbol()])),
    message: z.string(),
  }),
);

type ValidationExceptionDetails = z.infer<typeof validationExceptionDetailsSchema>;

export class ValidationException extends BaseException {
  constructor(params: {
    message: string;
    details?: ValidationExceptionDetails;
  }) {
    super({
      ...params,
      code: ErrorCodes.VALIDATION_FAILED,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}
