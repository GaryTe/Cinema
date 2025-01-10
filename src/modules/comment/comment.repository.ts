import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import {Connection} from 'rabbitmq-client';

import {CommentRepositoryInterface} from '../../shared/interface/index.js';
import {Component, RPCProps} from '../../shared/enum/index.js';
import {CommentEntity, CreateCommentDto} from './index.js';
import {AMOUNT_RETURN_COMMENT, SORT_DESCENDING} from '../../shared/const/index.js';
import {RebbitMQConnection} from '../../shared/libs/index.js';
import {getConsumerSetting} from '../../shared/util/index.js';
import {MSG} from '../../shared/type/index.js';

const connection: Connection = await new RebbitMQConnection().connect();

@injectable()
export class CommentRepository implements CommentRepositoryInterface {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {
    connection.createConsumer(
      getConsumerSetting({
        consumerTag: 'VladVankov',
        durable: true,
        type: 'direct',
        exchange: RPCProps.Exchange,
        routingKey: RPCProps.RoutingKey,
        queue: RPCProps.Queue
      }), async ({body}, reply) => {
        const {idFilm, limit, delet} = body as MSG;

        if(delet) {
          await this.delet(idFilm);
          await reply([]);
          return;
        }

        const commentsList = await this.getAllComments(idFilm, limit);
        await reply(commentsList);
      });
  }

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
