import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { BaseController, RestSchema } from '../../shared/libs/index.js';
import { RefreshTokenServiceInterface, Logger, Config } from '../../shared/interface/index.js';
import { Component, HttpMethod } from '../../shared/enum/index.js';
import {
  ParseRefreshTokenMiddleware,
  PrivateRouteMiddleware
} from '../../shared/middleware/index.js';


@injectable()
export class RefreshTokenController extends BaseController {
  constructor(
    @inject(Component.PinoLogger) protected readonly logger: Logger,
    @inject(Component.RefreshTokenService) private readonly refreshTokenService: RefreshTokenServiceInterface,
    @inject(Component.RestConfig) private readonly config: Config<RestSchema>
  ) {
    super(logger);

    this.logger.info('Register routes for SelecteFilmController');

    this.addRoute({
      path: '/editing',
      method: HttpMethod.Post,
      handler: this.editing,
      middlewares: [
        new ParseRefreshTokenMiddleware(this.config.get('JWT_REFRESH_SECRET')),
        new PrivateRouteMiddleware()
      ]
    });
  }

  public async editing(
    {tokenPayload}: Request,
    res: Response
  ): Promise<void> {
    const newAccessAndRefreshToken = await this.refreshTokenService.editing(tokenPayload);

    this.created(res, newAccessAndRefreshToken);
  }
}
