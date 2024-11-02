import { NextFunction, Request, Response } from 'express';

import { DocumentExists, Middleware } from '../interface/index.js';
import { HttpError } from '../libs/index.js';
import { StatusCodes } from 'http-status-codes';

export class DtoDocumentExistsMiddleware implements Middleware {
  constructor(
    private readonly service: DocumentExists,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {}

  public async execute({ body }: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = body[this.paramName];

    if(!documentId) {
      return next();
    }

    if (! await this.service.exists(documentId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with ${documentId} not found.`,
        {
          where: 'dto-document-exists.middleware.ts',
          line: '22'
        }
      );
    }

    next();
  }
}
