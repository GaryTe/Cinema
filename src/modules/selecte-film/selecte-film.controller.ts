import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { BaseController } from '../../shared/libs/index.js';
import { Logger, SelecteFilmServiceInterface } from '../../shared/interface/index.js';
import { Component, HttpMethod } from '../../shared/enum/index.js';
import {RequestParams, RequestBody} from '../../shared/type/index.js';
import { fillDTO } from '../../shared/util/index.js';
import { FavoriteFilmRdo, ValueFavoriteFilm } from './index.js';


@injectable()
export class SelecteFilmController extends BaseController {
  constructor(
    @inject(Component.PinoLogger) protected readonly logger: Logger,
    @inject(Component.SelecteFilmService) private readonly selecteFilmService: SelecteFilmServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for SelecteFilmController');

    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/', method: HttpMethod.Delete, handler: this.delet });
    this.addRoute({ path: '/list', method: HttpMethod.Get, handler: this.getAllFilms });
  }

  public async create(
    { body }: Request<RequestParams, RequestBody, ValueFavoriteFilm>,
    res: Response
  ): Promise<void> {
    const favoriteFilm = await this.selecteFilmService.create(body);

    this.logger.info('Film added to watch');
    this.created(res, fillDTO(FavoriteFilmRdo, favoriteFilm));
  }

  public async delet(
    {body}: Request<RequestParams, RequestBody, ValueFavoriteFilm>,
    res: Response
  ): Promise<void> {
    const favoriteFilm = await this.selecteFilmService.delet(body);

    this.logger.info('Film has been deleted from viewed');
    this.ok(res, fillDTO(FavoriteFilmRdo, favoriteFilm));
  }

  public async getAllFilms(
    {body}: Request<RequestParams, RequestBody, ValueFavoriteFilm>,
    res: Response
  ): Promise<void> {
    const favoriteFilmsList = await this.selecteFilmService.getAllFilms(body);

    this.logger.info(`${favoriteFilmsList.length} films returned`);
    this.ok(res, fillDTO(FavoriteFilmRdo, favoriteFilmsList));
  }
}
