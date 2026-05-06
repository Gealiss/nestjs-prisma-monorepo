import { utilities as nestWinstonModuleUtilities, WinstonModuleOptions } from 'nest-winston';
import { config, format, Logform, transports } from 'winston';
import { GCP_LOG_LEVELS_CONFIG, LogLevel } from '@/shared/log-level';

export function getWinstonOptions(options: {
  logLevel: LogLevel;
  appName: string;
  useJsonFormat: boolean;
}): WinstonModuleOptions {
  let consoleFormat: Logform.Format;

  if (options.useJsonFormat) {
    consoleFormat = format.combine(format.ms(), format.timestamp(), format.json());
  } else {
    consoleFormat = format.combine(
      format.timestamp(),
      format.ms(),
      nestWinstonModuleUtilities.format.nestLike(options.appName, {
        colors: true,
        prettyPrint: true,
      }),
    );
  }

  const usedTransports: WinstonModuleOptions['transports'] = [
    new transports.Console({
      format: consoleFormat,
    }),
  ];

  return {
    level: options.logLevel,
    levels: config.npm.levels,
    transports: usedTransports,
  };
}

export function getWinstonOptionsForConsole(options: { logLevel: LogLevel }): WinstonModuleOptions {
  const consoleFormat = format.combine(
    format.timestamp({ format: 'HH:mm:ss' }),
    nestWinstonModuleUtilities.format.nestLike('console', {
      colors: true,
      prettyPrint: true,
      appName: false,
    }),
  );

  return {
    level: options.logLevel,
    levels: GCP_LOG_LEVELS_CONFIG,
    transports: [
      new transports.Console({
        format: consoleFormat,
      }),
    ],
  };
}
