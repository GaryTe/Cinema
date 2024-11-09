import { injectable, inject } from 'inversify';
import { Router, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {StatusCodes} from 'http-status-codes';

import { Controller, Logger, Route, PathTransformerInterface } from '../interface/index.js';
import {DEFAULT_CONTENT_TYPE} from '../const/index.js';
import {Component} from '../enum/index.js';

@injectable()
export abstract class BaseController implements Controller {
  private readonly _router: Router;

  @inject(Component.PathTransformer)
  private pathTranformer: PathTransformerInterface;

  constructor(
    protected readonly logger: Logger,
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: Route) {
    const middlewareHandlers = route.middlewares?.map(
      (item) => asyncHandler(item.execute.bind(item))
    );
    const wrapperAsyncHandler = asyncHandler(route.handler.bind(this));

    const allHandlers = middlewareHandlers ? [...middlewareHandlers, wrapperAsyncHandler] : wrapperAsyncHandler;
    this._router[route.method](route.path, allHandlers);
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    const modifiedData = this.pathTranformer.execute(data as Record<string, unknown>);

    res
      .type(DEFAULT_CONTENT_TYPE)
      .status(statusCode)
      .json(modifiedData);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  public ok<T>(res: Response, data?: T): void {
    this.send(res, StatusCodes.OK, data);
  }
}
