export const ErrorCodes = {
  NOT_FOUND: 'not_found',
  UNKNOWN: 'unknown',
  TRY_AGAIN_LATER: 'try_again_later',

  AUTH_ACCESS_DENIED: 'auth.access_denied',
  AUTH_API_KEY_REQUIRED: 'auth.api_key_required',
  AUTH_API_KEY_INVALID: 'auth.api_key_invalid',
  AUTH_ACCESS_TOKEN_REQUIRED: 'auth.access_token_required',
  AUTH_ACCESS_TOKEN_INVALID: 'auth.access_token_invalid',
  AUTH_ACCESS_TOKEN_EXPIRED: 'auth.access_token_expired',

  VALIDATION_FAILED: 'validation.failed',
} as const satisfies Record<string, string>;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
