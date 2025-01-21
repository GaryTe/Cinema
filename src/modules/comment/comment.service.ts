import { inject, injectable } from 'inversify';

import {CommentServiceInterface, CommentRepositoryInterface} from '../../shared/interface/index.js';
import {CreateCommentDto} from './index.js';
import {Component} from '../../shared/enum/index.js';
import {DataComment} from '../../shared/type/index.js';

@injectable()
export class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.CommentRepository) private readonly repository: CommentRepositoryInterface
  ) {}

  public async create(dto: CreateCommentDto): Promise<DataComment> {
    const comment = await this.repository.create(dto);
    return comment;
  }

  public async getAllComments(idFilm: string): Promise<DataComment[] | []> {
    const commentsList = await this.repository.getAllComments(idFilm);
    return commentsList;
  }
}
