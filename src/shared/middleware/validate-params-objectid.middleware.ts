import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';

import { Middleware } from '../interface/index.js';
import { HttpError } from '../libs/index.js';

export class ValidateParamsObjectIdMiddleware implements Middleware {
  constructor(private param: string) {}

  public execute({ params }: Request, _res: Response, next: NextFunction): void {
    const objectId = params[this.param];

    if (Types.ObjectId.isValid(objectId)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${objectId} is invalid ObjectID`,
      {
        where: 'validate-params-objectid.middleware.ts',
        line: '19'
      }
    );
  }
}
