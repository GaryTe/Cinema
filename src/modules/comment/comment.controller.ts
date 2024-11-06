import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { BaseController } from '../../shared/libs/index.js';
import { Logger, CommentServiceInterface, FilmRepositoryInterface } from '../../shared/interface/index.js';
import { Component, HttpMethod } from '../../shared/enum/index.js';
import {RequestParams, RequestBody, ParamsFilmId} from '../../shared/type/index.js';
import { fillDTO } from '../../shared/util/index.js';
import { CommentRto, CreateCommentDto } from './index.js';
import {
  ValidateDtoMiddleware,
  ValidateDtoObjectIdMiddleware,
  DtoDocumentExistsMiddleware,
  ValidateParamsObjectIdMiddleware,
  ParamsDocumentExistsMiddleware,
  PrivateRouteMiddleware
} from '../../shared/middleware/index.js';


@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.PinoLogger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentServiceInterface,
    @inject(Component.FilmRepository) private readonly filmRepository: FilmRepositoryInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto),
        new ValidateDtoObjectIdMiddleware(['idFilm']),
        new DtoDocumentExistsMiddleware(this.filmRepository, 'Film', 'idFilm')
      ]
    });
    this.addRoute({
      path: '/:idFilm',
      method: HttpMethod.Get,
      handler: this.getAllComments,
      middlewares: [
        new ValidateParamsObjectIdMiddleware('idFilm'),
        new ParamsDocumentExistsMiddleware(filmRepository, 'Film', 'idFilm')
      ]
    });
  }

  public async create(
    { body, tokenPayload }: Request<RequestParams, RequestBody, CreateCommentDto>,
    res: Response
  ): Promise<void> {
    const comment = await this.commentService.create({...body, idUser: tokenPayload.id});

    this.logger.info('Comment created');
    this.created(res, fillDTO(CommentRto, comment));
  }

  public async getAllComments(
    {params}: Request<ParamsFilmId>,
    res: Response
  ): Promise<void> {
    const commentsList = await this.commentService.getAllComments(params.idFilm);

    this.logger.info(`${commentsList.length} comments returned`);
    this.ok(res, fillDTO(CommentRto, commentsList));
  }
}
