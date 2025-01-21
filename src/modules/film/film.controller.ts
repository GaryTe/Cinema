import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { BaseController } from '../../shared/libs/index.js';
import { Logger, FilmServiceInterface } from '../../shared/interface/index.js';
import { Component, HttpMethod, Genres} from '../../shared/enum/index.js';
import {RequestParams, RequestBody, ParamsFilmId, RequestQuery} from '../../shared/type/index.js';
import { fillDTO } from '../../shared/util/index.js';
import { CreateFilmDto, RedactionFilmDto, FilmRdo, FullInformationFilmRdo } from './index.js';
import {AMOUNT_RETURN_FILM} from '../../shared/const/rest.js';
import {
  ValidateDtoMiddleware,
  PrivateRouteMiddleware,
  ValidateQueryMiddleware
} from '../../shared/middleware/index.js';


@injectable()
export class FilmController extends BaseController {
  constructor(
    @inject(Component.PinoLogger) protected readonly logger: Logger,
    @inject(Component.FilmService) private readonly filmService: FilmServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for SelecteFilmController');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateFilmDto),
      ]
    });
    this.addRoute({
      path: '/redaction/:idFilm',
      method: HttpMethod.Patch,
      handler: this.editing,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(RedactionFilmDto)
      ]
    });
    this.addRoute({
      path: '/:idFilm',
      method: HttpMethod.Delete,
      handler: this.delet,
      middlewares: [
        new PrivateRouteMiddleware()
      ]
    });
    this.addRoute({path: '/list', method: HttpMethod.Get, handler: this.getAllFilms});
    this.addRoute({
      path: '/list/genre',
      method: HttpMethod.Get,
      handler: this.getAllFilmsOfGenre,
      middlewares: [new ValidateQueryMiddleware('genre')]
    });
    this.addRoute({
      path: '/show/:idFilm',
      method: HttpMethod.Get,
      handler: this.show
    });
    this.addRoute({path: '/promo', method: HttpMethod.Get, handler: this.showPromoFilm});
  }

  public async create(
    { body, tokenPayload}: Request<RequestParams, RequestBody, CreateFilmDto>,
    res: Response
  ): Promise<void> {
    const film = await this.filmService.create({...body, idUser: tokenPayload.id});

    this.created(res, fillDTO(
      FullInformationFilmRdo,
      {
        ...film,
        numberComments: 0,
        user: {
          avatar: tokenPayload.avatar,
          email: tokenPayload.email,
          name: tokenPayload.name,
          id: tokenPayload.id
        }
      }
    ));
  }

  public async editing(
    {body, params, tokenPayload}: Request<ParamsFilmId, RequestBody, RedactionFilmDto>,
    res: Response
  ): Promise<void> {
    const film = await this.filmService.editing(body, params.idFilm);

    this.ok(res, fillDTO(
      FullInformationFilmRdo,
      {
        ...film,
        user: {
          avatar: tokenPayload.avatar,
          email: tokenPayload.email,
          name: tokenPayload.name,
          id: tokenPayload.id
        }
      }
    ));
  }

  public async delet(
    {params}: Request<ParamsFilmId, RequestBody>,
    res: Response
  ): Promise<void> {
    const film = await this.filmService.delet(params.idFilm);

    this.ok(res, film ? 'Movie card removed' : 'Movie card not deleted. Movie card does not exist in the database.');
  }

  public async getAllFilms(
    {query}: Request<RequestParams, unknown ,RequestBody, RequestQuery>,
    res: Response
  ): Promise<void> {
    const {limit} = query;
    const _limit = Number(limit) ?? AMOUNT_RETURN_FILM;

    const filmsList = await this.filmService.getAllFilms(_limit);
    this.ok(res, fillDTO(FilmRdo, filmsList));
  }

  public async getAllFilmsOfGenre(
    {query}: Request<RequestParams, unknown, RequestBody, RequestQuery>,
    res: Response
  ): Promise<void> {
    const {limit, genre} = query;
    const _limit = Number(limit) ?? AMOUNT_RETURN_FILM;
    const _genre = genre ?? Genres.Comedy;

    const filmsList = await this.filmService.getAllFilmsOfGenre(_limit, _genre);
    this.ok(res, fillDTO(FilmRdo, filmsList));
  }

  public async show(
    {params}: Request<ParamsFilmId, RequestBody>,
    res: Response
  ): Promise<void> {
    const film = await this.filmService.show(params.idFilm);

    this.ok(res, fillDTO(FullInformationFilmRdo, film ?? 'Movie not found'));
  }

  public async showPromoFilm(
    _req: Request<RequestParams, RequestBody>,
    res: Response
  ): Promise<void> {
    const promoFilm = await this.filmService.showPromoFilm();

    this.ok(res, fillDTO(FilmRdo, promoFilm ?? 'Promo film not found'));
  }
}
