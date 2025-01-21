import { NextFunction, Request, Response } from 'express';
import { jwtVerify } from 'jose';
import { StatusCodes } from 'http-status-codes';
import { createSecretKey } from 'node:crypto';

import { Middleware } from '../interface/index.js';
import { HttpError } from '../libs/index.js';
import { TokenPayload } from '../type/index.js';

function isTokenPayload(payload: unknown): payload is TokenPayload {
  return (
    (typeof payload === 'object' && payload !== null) &&
    ('email' in payload && typeof payload.email === 'string') &&
    ('name' in payload && typeof payload.name === 'string') &&
    ('id' in payload && typeof payload.id === 'string') &&
    ('avatar' in payload && typeof payload.id === 'string')
  );
}

export class ParseAccessTokenMiddleware implements Middleware {
  constructor(private readonly accessSecret: string) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers?.authorization?.split(' ');
    if (!authorizationHeader) {
      return next();
    }

    const [, token] = authorizationHeader;

    try {
      const { payload } = await jwtVerify(token, createSecretKey(this.accessSecret, 'utf-8'));

      if (isTokenPayload(payload)) {
        req.tokenPayload = { ...payload };
        return next();
      } else {
        throw new Error('Bad accessToken');
      }
    } catch {
      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid accessToken',
        {
          where: 'parse-access-token.middieware',
          line: '40'
        }
      )
      );
    }
  }
}
