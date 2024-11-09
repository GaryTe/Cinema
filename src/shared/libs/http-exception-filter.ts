import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

import { ExceptionFilter, Logger } from '../interface/index.js';
import { Component, ApplicationError } from '../enum/index.js';
import { createErrorObject } from '../util/index.js';
import {HttpError} from '../libs/http-error.js';

@injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.PinoLogger) private readonly logger: Logger
  ) {
    this.logger.info('Register HttpExceptionFilter');
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if(!(error instanceof HttpError)) {
      return next();
    }

    this.logger.error(`[class HttpExceptionFilter]: ${error.message}`, error);

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ApplicationError.CommonError, error.message));
  }
}
