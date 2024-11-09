import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

import { ExceptionFilter, Logger } from '../interface/index.js';
import { Component, ApplicationError } from '../enum/index.js';
import { createErrorObject } from '../util/index.js';

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.PinoLogger) private readonly logger: Logger
  ) {
    this.logger.info('Register AppExceptionFilter');
  }

  public catch(error: Error, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.error(`[class AppExceptionFilter]: ${error.message}`, error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(ApplicationError.ServiceError, error.message));
  }
}
