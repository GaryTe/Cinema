import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { BaseController } from '../../shared/libs/index.js';
import { Logger, FilmServiceInterface, UserRepositoryInterface, FilmRepositoryInterface } from '../../shared/interface/index.js';
import { Component, HttpMethod, Genres} from '../../shared/enum/index.js';
import {RequestParams, RequestBody, ParamsFilmId, RequestQuery} from '../../shared/type/index.js';
import { fillDTO } from '../../shared/util/index.js';
import { CreateFilmDto, RedactionFilmDto, FilmRdo, FullInformationFilmRdo } from './index.js';
import {AMOUNT_RETURN_FILM} from '../../shared/const/rest.js';
import {
  ValidateDtoMiddleware,
  ValidateDtoObjectIdMiddleware,
  DtoDocumentExistsMiddleware,
  ParamsDocumentExistsMiddleware,
  ValidateParamsObjectIdMiddleware,
  ValidateQueryMiddleware
} from '../../shared/middleware/index.js';


@injectable()
export class FilmController extends BaseController {
  constructor(
    @inject(Component.PinoLogger) protected readonly logger: Logger,
    @inject(Component.FilmService) private readonly filmService: FilmServiceInterface,
    @inject(Component.UserRepository) private readonly userRepository: UserRepositoryInterface,
    @inject(Component.FilmRepository) private readonly filmRepository: FilmRepositoryInterface
  ) {
    super(logger);

    this.logger.info('Register routes for SelecteFilmController');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateFilmDto),
        new ValidateDtoObjectIdMiddleware(['user']),
        new DtoDocumentExistsMiddleware(this.userRepository, 'User', 'user'),
      ]
    });
    this.addRoute({
      path: '/redaction/:idFilm',
      method: HttpMethod.Patch,
      handler: this.editing,
      middlewares: [
        new ValidateDtoMiddleware(RedactionFilmDto),
        new ValidateDtoObjectIdMiddleware(['user']),
        new DtoDocumentExistsMiddleware(this.userRepository, 'User', 'user'),
        new ValidateParamsObjectIdMiddleware('idFilm'),
        new ParamsDocumentExistsMiddleware(this.filmRepository, 'Film', 'idFilm')
      ]
    });
    this.addRoute({
      path: '/:idFilm',
      method: HttpMethod.Delete,
      handler: this.delet,
      middlewares: [
        new ValidateParamsObjectIdMiddleware('idFilm'),
        new ParamsDocumentExistsMiddleware(this.filmRepository, 'Film', 'idFilm')
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
      handler: this.show,
      middlewares: [
        new ValidateParamsObjectIdMiddleware('idFilm'),
        new ParamsDocumentExistsMiddleware(this.filmRepository, 'Film', 'idFilm')
      ]
    });
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
    {body, params}: Request<ParamsFilmId, RequestBody, RedactionFilmDto>,
    res: Response
  ): Promise<void> {
    const film = await this.filmService.editing(body, params.idFilm);

    this.logger.info(`film: ${film.nameFilm}, has been updated`);
    this.ok(res, fillDTO(FullInformationFilmRdo, film));
  }

  public async delet(
    {params}: Request<ParamsFilmId, RequestBody>,
    res: Response
  ): Promise<void> {
    const film = await this.filmService.delet(params.idFilm);

    this.logger.info(`film: ${film.nameFilm}, has been deleted`);
    this.ok(res, fillDTO(FullInformationFilmRdo, film));
  }

  public async getAllFilms(
    {query}: Request<RequestParams, unknown ,RequestBody, RequestQuery>,
    res: Response
  ): Promise<void> {
    const {limit} = query;
    const _limit = Number(limit) ?? AMOUNT_RETURN_FILM;

    const filmsList = await this.filmService.getAllFilms(_limit);
    this.logger.info(`${filmsList.length} films returned`);
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
    this.logger.info(`${filmsList.length} films returned`);
    this.ok(res, fillDTO(FilmRdo, filmsList));
  }

  public async show(
    {params}: Request<ParamsFilmId, RequestBody>,
    res: Response
  ): Promise<void> {
    const film = await this.filmService.show(params.idFilm);

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
