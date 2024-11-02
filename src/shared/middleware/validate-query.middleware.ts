import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Middleware } from '../interface/index.js';
import { HttpError } from '../libs/index.js';
import {GENRES_LIST} from '../const/index.js';

export class ValidateQueryMiddleware implements Middleware {
  constructor(
    private param: string
  ) {}

  public execute({ query }: Request, _res: Response, next: NextFunction): void {
    const genre = query[this.param] as string | undefined;

    if(!genre) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Select movie genre',
        {
          where: 'validate-query.middileware.ts',
          line: '17'
        }
      );
    }

    const isValue = GENRES_LIST.includes(genre);

    if (!isValue) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Choose a different movie genre',
        {
          where: 'validate-query.middileware.ts',
          line: '30'
        }
      );
    }

    return next();
  }
}
