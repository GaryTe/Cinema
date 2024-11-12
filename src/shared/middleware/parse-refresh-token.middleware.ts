import { NextFunction, Request, Response } from 'express';
import { jwtVerify } from 'jose';
import { StatusCodes } from 'http-status-codes';
import { createSecretKey } from 'node:crypto';

import { HttpError } from '../libs/index.js';
import { TokenPayload } from '../type/index.js';
import {Middleware} from '../interface/index.js';

function isTokenPayload(payload: unknown): payload is TokenPayload {
  return (
    (typeof payload === 'object' && payload !== null) &&
    ('email' in payload && typeof payload.email === 'string') &&
    ('name' in payload && typeof payload.name === 'string') &&
    ('id' in payload && typeof payload.id === 'string')
  );
}

export class ParseRefreshTokenMiddleware implements Middleware{
  constructor(private readonly refreshSecret: string) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const refreshToken = req.headers.refreshtoken as string;

    if (!refreshToken) {
      return next();
    }

    const [, token] = refreshToken.split(' ');

    try{
      const { payload } = await jwtVerify(token, createSecretKey(this.refreshSecret, 'utf-8'));

      if (isTokenPayload(payload)) {
        req.tokenPayload = { ...payload, refreshToken: token };
        return next();
      } else {
        throw new Error('Bad refreshToken');
      }
    } catch {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid refreshToken',
        {
          where: 'parse-refresh-token.ts',
          line: '40'
        }
      );
    }
  }
}
