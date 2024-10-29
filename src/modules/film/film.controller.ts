import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { BaseController } from '../../shared/libs/index.js';
import { Logger, FilmServiceInterface } from '../../shared/interface/index.js';
import { Component, HttpMethod } from '../../shared/enum/index.js';
import {RequestParams, RequestBody} from '../../shared/type/index.js';
import { fillDTO } from '../../shared/util/index.js';
import { CreateFilmDto, RedactionFilmDto, FilmRdo, FullInformationFilmRdo } from './index.js';


@injectable()
export class FilmController extends BaseController {
  constructor(
    @inject(Component.PinoLogger) protected readonly logger: Logger,
    @inject(Component.FilmService) private readonly filmService: FilmServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for SelecteFilmController');

    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/redaction/:idFilm', method: HttpMethod.Patch, handler: this.editing });
    this.addRoute({ path: '/:idFilm', method: HttpMethod.Delete, handler: this.delet });
    this.addRoute({path: '/list', method: HttpMethod.Get, handler: this.getAllFilms});
    this.addRoute({path: '/list/genre', method: HttpMethod.Get, handler: this.getAllFilmsOfGenre});
    this.addRoute({path: '/show/:idFilm', method: HttpMethod.Get, handler: this.show});
    this.addRoute({path: '/promo', method: HttpMethod.Get, handler: this.showPromoFilm});
  }

  public async create(
    { body }: Request<RequestParams, RequestBody, CreateFilmDto>,
    res: Response
  ): Promise<void> {
    const film = await this.filmService.create(body);

    this.logger.info(`New film created: ${film.nameFilm}`);
    this.created(res, fillDTO(FullInformationFilmRdo, film));
  }

  public async editing(
    {body, params}: Request<RequestParams, RequestBody, RedactionFilmDto>,
    res: Response
  ): Promise<void> {
    const film = await this.filmService.editing(body, params.idFilm as string);

    this.logger.info(`film: ${film.nameFilm}, has been updated`);
    this.ok(res, fillDTO(FullInformationFilmRdo, film));
  }

  public async delet(
    {params}: Request<RequestParams, RequestBody>,
    res: Response
  ): Promise<void> {
    const film = await this.filmService.delet(params.idFilm as string);

    this.logger.info(`film: ${film.nameFilm}, has been deleted`);
    this.ok(res, fillDTO(FullInformationFilmRdo, film));
  }

  public async getAllFilms(
    {query}: Request<RequestParams, RequestBody>,
    res: Response
  ): Promise<void> {
    const limit = Number(query.limit);

    const filmsList = await this.filmService.getAllFilms(limit);
    this.logger.info(`${filmsList.length} films returned`);
    this.ok(res, fillDTO(FilmRdo, filmsList));
  }

  public async getAllFilmsOfGenre(
    {query}: Request<RequestParams, RequestBody>,
    res: Response
  ): Promise<void> {
    const limit = Number(query.limit);

    const filmsList = await this.filmService.getAllFilmsOfGenre(limit, query.genre as string);
    this.logger.info(`${filmsList.length} films returned`);
    this.ok(res, fillDTO(FilmRdo, filmsList));
  }

  public async show(
    {params}: Request<RequestParams, RequestBody>,
    res: Response
  ): Promise<void> {
    const film = await this.filmService.show(params.idFilm as string);

    this.logger.info(`Film: ${film.nameFilm}, found and returned`);
    this.ok(res, fillDTO(FullInformationFilmRdo, film));
  }

  public async showPromoFilm(
    _req: Request<RequestParams, RequestBody>,
    res: Response
  ): Promise<void> {
    const film = await this.filmService.showPromoFilm();

    if(!film) {
      this.logger.info('Promo film not found');
      this.ok(res);
      return;
    }

    this.logger.info(`Promo film: ${film.nameFilm}, found and returned`);
    this.ok(res, fillDTO(FilmRdo, film));
  }
}
