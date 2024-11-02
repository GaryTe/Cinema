import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';

import { Middleware } from '../interface/index.js';
import { HttpError } from '../libs/index.js';

export class ValidateDtoObjectIdMiddleware implements Middleware {
  constructor(
    private param: string[]
  ) {}

  public execute({ body }: Request, _res: Response, next: NextFunction): void {

    if(this.param.length - 1 === 0) {
      return next();
    }

    this.param.forEach((value) => {
      const objectId = body[value];

      if (!(Types.ObjectId.isValid(objectId))) {
        throw new HttpError(
          StatusCodes.BAD_REQUEST,
          `${objectId} is invalid ObjectID`,
          {
            where: 'validate-dto-objectid.middleware.ts',
            line: '23'
          }
        );
      }
    });

    return next();
  }
}
