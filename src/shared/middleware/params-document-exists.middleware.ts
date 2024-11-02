import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { DocumentExists, Middleware} from '../interface/index.js';
import { HttpError } from '../libs/index.js';

export class ParamsDocumentExistsMiddleware implements Middleware {
  constructor(
    private readonly service: DocumentExists,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {}

  public async execute({ params }: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = params[this.paramName];
    if (! await this.service.exists(documentId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with ${documentId} not found.`,
        {
          where: 'params-document-exists-middleware.ts',
          line: '17'
        }
      );
    }

    next();
  }
}
