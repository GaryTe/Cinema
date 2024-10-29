import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { CommentServiceInterface, CommentRepositoryInterface } from '../../shared/interface/index.js';
import { Component } from '../../shared/enum/index.js';
import {
  CommentService,
  CommentRepository,
  CommentEntity,
  CommentModel,
  CommentController
} from './index.js';

export function createCommentContainer() {
  const commentContainer = new Container();

  commentContainer.bind<CommentServiceInterface>(Component.CommentService).to(CommentService).inSingletonScope();
  commentContainer.bind<CommentRepositoryInterface>(Component.CommentRepository).to(CommentRepository).inSingletonScope();
  commentContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
  commentContainer.bind<CommentController>(Component.CommentController).to(CommentController).inSingletonScope();

  return commentContainer;
}
