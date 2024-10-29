import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

import {CommentRepositoryInterface} from '../../shared/interface/index.js';
import {Component} from '../../shared/enum/index.js';
import {CommentEntity, CreateCommentDto} from './index.js';
import {AMOUNT_RETURN_COMMENT, SORT_DESCENDING} from '../../shared/const/index.js';

@injectable()
export class CommentRepository implements CommentRepositoryInterface {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    return (await this.commentModel.create(dto)).populate('idUser');
  }

  public async getAllComments(idFilm: string, limit = AMOUNT_RETURN_COMMENT): Promise<DocumentType<CommentEntity>[] | []> {
    return await this.commentModel
      .find({idFilm})
      .sort({createdAt: SORT_DESCENDING})
      .limit(limit)
      .populate('idUser');
  }

  public async delet(idFilm: string): Promise<void> {
    await this.commentModel.deleteMany({idFilm});
  }
}
