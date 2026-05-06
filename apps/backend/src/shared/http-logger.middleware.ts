import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

interface HttpRequestLogData {
  /**
   * HTTP request related information.
   *
   * NOTE: Google Cloud Logging service understands this object structure, and automatically formats it as an HTTP request log.
   * See: https://github.com/googleapis/nodejs-logging-winston?tab=readme-ov-file#formatting-request-logs
   */
  httpRequest: {
    remoteIp: string;
    requestUrl: string;
    requestMethod: string;
    status: number;
  };
  timeElapsedMs: number;
}

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    // Get the client's IP address
    const forwarded = req.header('x-forwarded-for');
    const ip = req.ip || (typeof forwarded === 'string' && forwarded.split(',')[0]) || 'unknown';

    // Get the request URL
    const url = req.originalUrl;
    const requestTime = new Date();

    const logData: HttpRequestLogData = {
      httpRequest: {
        remoteIp: ip,
        requestUrl: url,
        requestMethod: req.method,
        status: 0,
      },
      timeElapsedMs: 0,
    };

    let alreadyLogged: boolean = false;

    const onFinishHandler = () => {
      if (alreadyLogged) return;
      alreadyLogged = true;

      logData.httpRequest.status = res.statusCode;
      logData.timeElapsedMs = Date.now() - requestTime.getTime();

      this.logger.log(logData);
    };

    const onCloseHandler = () => {
      if (alreadyLogged) return;
      alreadyLogged = true;

      logData.timeElapsedMs = Date.now() - requestTime.getTime();

      this.logger.log(logData);
    };

    // Emitted when the response has been completely written and flushed to the underlying system
    res.on('finish', onFinishHandler);

    // Emitted when the underlying connection (socket) is closed. This can happen after the response
    // is finished or even before if the connection is terminated unexpectedly
    res.on('close', onCloseHandler);

    next();
  }
}
