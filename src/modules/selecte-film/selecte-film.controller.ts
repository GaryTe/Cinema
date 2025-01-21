import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { BaseController } from '../../shared/libs/index.js';
import { Logger, SelecteFilmServiceInterface } from '../../shared/interface/index.js';
import { Component, HttpMethod } from '../../shared/enum/index.js';
import {RequestParams, RequestBody} from '../../shared/type/index.js';
import { fillDTO } from '../../shared/util/index.js';
import { FavoriteFilmRdo, ValueFavoriteFilmDto } from './index.js';
import {
  ValidateDtoMiddleware,
  PrivateRouteMiddleware
} from '../../shared/middleware/index.js';


@injectable()
export class SelecteFilmController extends BaseController {
  constructor(
    @inject(Component.PinoLogger) protected readonly logger: Logger,
    @inject(Component.SelecteFilmService) private readonly selecteFilmService: SelecteFilmServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for SelecteFilmController');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(ValueFavoriteFilmDto)
      ]
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Delete,
      handler: this.delet,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(ValueFavoriteFilmDto)
      ]
    });

    this.addRoute({
      path: '/list',
      method: HttpMethod.Get,
      handler: this.getAllFilms,
      middlewares: [
        new PrivateRouteMiddleware()
      ]
    });
  }

  public async create(
    { body, tokenPayload }: Request<RequestParams, RequestBody, ValueFavoriteFilmDto>,
    res: Response
  ): Promise<void> {
    const favoriteFilm = await this.selecteFilmService.create({...body, idUser: tokenPayload.id});

    this.created(res, fillDTO(FavoriteFilmRdo, favoriteFilm));
  }

  public async delet(
    {body, tokenPayload}: Request<RequestParams, RequestBody, ValueFavoriteFilmDto>,
    res: Response
  ): Promise<void> {
    const favoriteFilm = await this.selecteFilmService.delet({...body, idUser: tokenPayload.id});

    this.ok(res, fillDTO(FavoriteFilmRdo, favoriteFilm));
  }

  public async getAllFilms(
    {tokenPayload}: Request<RequestParams, RequestBody, ValueFavoriteFilmDto>,
    res: Response
  ): Promise<void> {
    const favoriteFilmsList = await this.selecteFilmService.getAllFilms({idUser: tokenPayload.id});

    this.ok(res, fillDTO(FavoriteFilmRdo, favoriteFilmsList));
  }
}
