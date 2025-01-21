import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { BaseController } from '../../shared/libs/index.js';
import { Logger, CommentServiceInterface } from '../../shared/interface/index.js';
import { Component, HttpMethod } from '../../shared/enum/index.js';
import {RequestParams, RequestBody, ParamsFilmId} from '../../shared/type/index.js';
import { fillDTO } from '../../shared/util/index.js';
import { CommentRto, CreateCommentDto } from './index.js';
import {
  ValidateDtoMiddleware,
  PrivateRouteMiddleware
} from '../../shared/middleware/index.js';


@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.PinoLogger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto)
      ]
    });
    this.addRoute({
      path: '/:idFilm',
      method: HttpMethod.Get,
      handler: this.getAllComments
    });
  }

  public async create(
    { body, tokenPayload }: Request<RequestParams, RequestBody, CreateCommentDto>,
    res: Response
  ): Promise<void> {
    const {id, name, email, avatar} = tokenPayload;
    const comment = await this.commentService.create({...body, idUser: id});

    this.created(res, fillDTO(CommentRto, {
      ...comment,
      user: {
        name,
        email,
        id,
        avatar
      }
    }));
  }

  public async getAllComments(
    {params}: Request<ParamsFilmId>,
    res: Response
  ): Promise<void> {
    const commentsList = await this.commentService.getAllComments(params.idFilm);

    this.ok(res, fillDTO(CommentRto, commentsList));
  }
}
