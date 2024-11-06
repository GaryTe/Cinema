import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';

import {ExceptionFilter, Logger} from '../interface/index.js';
import {Component} from '../enum/index.js';
import {BaseUserException} from './index.js';

@injectable()
export class AuthenticationExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.PinoLogger) private readonly logger: Logger
  ) {
    this.logger.info('Register AuthenticationExceptionFilter');
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof BaseUserException)) {
      return next(error);
    }

    this.logger.error(`[class AuthenticationUser] ${error.message}`, error);
    res.status(error.httpStatusCode)
      .json({
        type: 'NOT AUTHORIZATION',
        error: error.message,
      });
  }
}
