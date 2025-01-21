import { inject, injectable } from 'inversify';
import pg from 'pg';
import {RPCClient, Connection} from 'rabbitmq-client';

import {CommentRepositoryInterface, Config} from '../../shared/interface/index.js';
import {Component, RPCProps} from '../../shared/enum/index.js';
import {CreateCommentDto} from './index.js';
import {AMOUNT_RETURN_COMMENT} from '../../shared/const/index.js';
import {DataComment} from '../../shared/type/index.js';
import {RestSchema, RebbitMQConnection} from '../../shared/libs/index.js';
import {getClientSettings} from '../../shared/util/index.js';


let client: pg.Pool;
const connection: Connection = await new RebbitMQConnection().connect();
let rpcClient: RPCClient;

@injectable()
export class CommentRepository implements CommentRepositoryInterface {
  constructor(
    @inject(Component.RestConfig) private readonly config: Config<RestSchema>
  ) {
    const { Pool } = pg;
    client = new Pool({
      user: this.config.get('POSTGRES_USER'),
      password: this.config.get('POSTGRES_PASSWORD'),
      host: this.config.get('HOST'),
      port: this.config.get('POSTGRES_PORT'),
      database: this.config.get('POSTGRES_DB'),
      connectionTimeoutMillis: 3000,
      idleTimeoutMillis: 2000
    });

    rpcClient = getClientSettings(
      connection,
      {
        confirm: true,
        maxAttempts: 3,
        timeout: 3000
      }
    );
  }

  public async create(dto: CreateCommentDto): Promise<DataComment> {
    const {idUser, text, rating, idFilm} = dto;

    const dataComment = await client.query(`
      INSERT INTO comments
      VALUES (DEFAULT, DEFAULT, $1, $2, $3, $4)
      RETURNING *
      `,
    [idUser, text, rating, idFilm]
    );

    return dataComment.rows.find((item: DataComment) => item);
  }

  public async getAllComments(idFilm: string, limit = AMOUNT_RETURN_COMMENT): Promise<DataComment[] | []> {
    const dataCommetsList = await client.query(`
      SELECT *
      FROM comments
      WHERE comments.id_film = $1
      ORDER BY comments.created_at DESC
      LIMIT $2;
      `,
    [idFilm, limit]
    );

    const [comment] = dataCommetsList.rows;

    const {body} = await rpcClient
      .send({exchange: RPCProps.ExchangeUser, routingKey: RPCProps.RoutingKeyUser}, comment.id_user);

    return dataCommetsList.rows.map((item) => ({
      ...item,
      user: {
        ...body,
        id: body._id
      }
    }));
  }
}
