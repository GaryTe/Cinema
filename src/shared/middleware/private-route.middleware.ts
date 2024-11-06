import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

import { Middleware } from '../interface/index.js';
import { HttpError } from '../libs/index.js';

export class PrivateRouteMiddleware implements Middleware {
  public async execute({ tokenPayload }: Request, _res: Response, next: NextFunction): Promise<void> {
    if (! tokenPayload) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        {
          where: 'private-route-middleware.ts',
          line: '10'
        }
      );
    }

    return next();
  }
}
