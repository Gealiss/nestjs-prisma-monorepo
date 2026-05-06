export enum LogLevel {
  Fatal = 'fatal',
  Error = 'error',
  Warn = 'warn',
  /**
   * Also sometimes appears in console as the 'log' level. Call `.log()` to log at this level.
   */
  Info = 'info',
  Verbose = 'verbose',
  Debug = 'debug',
}

export function validateLogLevelSafe(level: string): LogLevel | undefined {
  return Object.values(LogLevel).includes(level as LogLevel) ? (level as LogLevel) : undefined;
}

/**
 * A mapping between `LogLevel` and the integer level used by Google Cloud Logging.
 * The lower the integer, the more severe the log level is.
 *
 * NOTE: Based on GCP logging levels, see:
 * https://docs.cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogSeverity
 */
export const GCP_LOG_LEVELS_CONFIG = {
  [LogLevel.Fatal]: 0,
  [LogLevel.Error]: 3,
  [LogLevel.Warn]: 4,
  [LogLevel.Info]: 6,
  [LogLevel.Verbose]: 7,
  [LogLevel.Debug]: 7,
} as const;
