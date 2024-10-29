import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { BaseController } from '../../shared/libs/index.js';
import { Logger, CommentServiceInterface } from '../../shared/interface/index.js';
import { Component, HttpMethod } from '../../shared/enum/index.js';
import {RequestParams, RequestBody} from '../../shared/type/index.js';
import { fillDTO } from '../../shared/util/index.js';
import { CommentRto, CreateCommentDto } from './index.js';


@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.PinoLogger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController');

    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:idFilm', method: HttpMethod.Get, handler: this.getAllComments });
  }

  public async create(
    { body }: Request<RequestParams, RequestBody, CreateCommentDto>,
    res: Response
  ): Promise<void> {
    const comment = await this.commentService.create(body);

    this.logger.info('Comment created');
    this.created(res, fillDTO(CommentRto, comment));
  }

  public async getAllComments(
    {params}: Request<RequestParams, RequestBody, CreateCommentDto>,
    res: Response
  ): Promise<void> {
    const commentsList = await this.commentService.getAllComments(params.idFilm as string);

    this.logger.info(`${commentsList.length} comments returned`);
    this.ok(res, fillDTO(CommentRto, commentsList));
  }
}
