import { DocumentType } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import {RPCClient, Connection} from 'rabbitmq-client';

import {FilmServiceInterface, FilmRepositoryInterface} from '../../shared/interface/index.js';
import {CreateFilmDto, FilmEntity, RedactionFilmDto} from './index.js';
import {Component, RPCProps} from '../../shared/enum/index.js';
import {countRating, getClientSettings} from '../../shared/util/index.js';
import {_Film, MSG} from '../../shared/type/index.js';
import {RebbitMQConnection} from '../../shared/libs/index.js';
import {getConsumerSetting} from '../../shared/util/index.js';

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
export class FilmService implements FilmServiceInterface {
  constructor(
    @inject(Component.FilmRepository) private readonly repository: FilmRepositoryInterface
  ) {
    connection.createConsumer(
      getConsumerSetting({
        consumerTag: 'VladVankov',
        durable: true,
        type: 'direct',
        exchange: RPCProps.ExchangeFilm,
        routingKey: RPCProps.RoutingKeyFilm,
        queue: RPCProps.QueueFilm
      }), async ({body}, reply) => {
        const {idFilm} = body as MSG;

        const dataFilm = await this.show(idFilm);
        await reply(dataFilm);
      });
  }

  public async create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>> {
    const film = await this.repository.create(dto);
    return film;
  }

  public async editing(dto:RedactionFilmDto, idFilm: string): Promise<_Film> {
    const {body} = await rpcClient
      .send({exchange: RPCProps.Exchange, routingKey: RPCProps.RoutingKey}, {idFilm, limit: 0, delet: false});
    const film = await this.repository.editing(dto, idFilm);

    const _film = {
      ...film.toObject(),
      id: film.id,
      rating: countRating(body),
      numberComments: body.length
    };

    return _film;
  }

  public async delet(idFilm: string): Promise<DocumentType<FilmEntity>> {
    await rpcClient
      .send({exchange: RPCProps.Exchange, routingKey: RPCProps.RoutingKey}, {idFilm, limit: 0, delet: true});
    const film = await this.repository.delet(idFilm);
    return film;
  }

  public async getAllFilms(limit: number): Promise<_Film[] | []> {
    const _filmsList = [];

    const filmsList = await this.repository.getAllFilms(limit);
    if(filmsList.length > 0) {
      for await (const film of filmsList) {
        const {body} = await rpcClient
          .send({exchange: RPCProps.Exchange, routingKey: RPCProps.RoutingKey}, {idFilm: film.id, limit: 0, delet: false});
        if(body.length > 0) {
          _filmsList.push({
            ...film.toObject(),
            id: film.id,
            numberComments: body.length
          });
        }else{
          _filmsList.push({...film.toObject(), id: film.id});
        }
      }
    }

    return _filmsList;
  }

  public async getAllFilmsOfGenre(limit: number, genre: string): Promise<_Film[] | []> {
    const _filmsList = [];

    const filmsList = await this.repository.getAllFilmsOfGenre(limit, genre);
    if(filmsList.length > 0) {
      for await (const film of filmsList) {
        const {body} = await rpcClient
          .send({exchange: RPCProps.Exchange, routingKey: RPCProps.RoutingKey}, {idFilm: film.id, limit: 0, delet: false});
        if(body.length > 0) {
          _filmsList.push({
            ...film.toObject(),
            id: film.id,
            numberComments: body.length
          });
        }else{
          _filmsList.push({...film.toObject(), id: film.id});
        }
      }
    }

    return _filmsList;
  }

  public async show(idFilm: string): Promise<_Film> {
    const {body} = await rpcClient
      .send({exchange: RPCProps.Exchange, routingKey: RPCProps.RoutingKey}, {idFilm, limit: 0, delet: false});
    const film = await this.repository.show(idFilm);

    const _film = {
      ...film.toObject(),
      id: film.id,
      rating: countRating(body),
      numberComments: body.length
    };

    return _film;
  }

  public async showPromoFilm(): Promise<_Film | null> {
    const film = await this.repository.showPromoFilm();

    if(!film) {
      return film;
    }

    const {body} = await rpcClient
      .send({exchange: RPCProps.Exchange, routingKey: RPCProps.RoutingKey}, {idFilm: film.id, limit: 0, delet: false});

    const _film = {
      ...film.toObject(),
      id: film.id,
      numberComments: body.length
    };

    return _film;
  }
}
