import { inject, injectable } from 'inversify';
import {Connection, RPCClient} from 'rabbitmq-client';

import {
  SelecteFilmServiceInterface,
  SelecteFilmRepositoryInterface
} from '../../shared/interface/index.js';
import {ValueFavoriteFilmDto} from './index.js';
import {Component, RPCProps} from '../../shared/enum/index.js';
import {_Film} from '../../shared/type/index.js';
import {RebbitMQConnection} from '../../shared/libs/index.js';
import {getClientSettings} from '../../shared/util/index.js';

const connection: Connection = await new RebbitMQConnection().connect();
const rpcClient: RPCClient = getClientSettings(
  connection,
  {
    confirm: true,
    maxAttempts: 3,
    timeout: 3000
  }
);

@injectable()
export class SelecteFilmService implements SelecteFilmServiceInterface {
  constructor(
    @inject(Component.SelecteFilmRepository) private readonly repository: SelecteFilmRepositoryInterface
  ) {}

  public async create(data: ValueFavoriteFilmDto): Promise<_Film> {
    const favoriteFilm = await this.repository.create(data);
    const {body} = await rpcClient
      .send({exchange: RPCProps.ExchangeFilm, routingKey: RPCProps.RoutingKeyFilm}, {idFilm: favoriteFilm.idFilm});
    return body;
  }

  public async delet(data: ValueFavoriteFilmDto): Promise<_Film> {
    const favoriteFilm = await this.repository.delet(data);
    const {body} = await rpcClient
      .send({exchange: RPCProps.ExchangeFilm, routingKey: RPCProps.RoutingKeyFilm}, {idFilm: favoriteFilm.idFilm});
    return body;
  }

  public async getAllFilms(data: ValueFavoriteFilmDto): Promise<_Film[] | []> {
    const favoriteFilmsList = await this.repository.getAllFilms(data);
    const _filmsList = [];

    if(favoriteFilmsList.length > 0) {
      for await(const film of favoriteFilmsList) {
        const {body} = await rpcClient
          .send({exchange: RPCProps.ExchangeFilm, routingKey: RPCProps.RoutingKeyFilm}, {idFilm: film.idFilm});
        _filmsList.push(body);
      }
    }
    return _filmsList;
  }
}
