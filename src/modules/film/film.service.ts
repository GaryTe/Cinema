import { inject, injectable } from 'inversify';
import {Connection, RPCClient} from 'rabbitmq-client';
import { DocumentType } from '@typegoose/typegoose';

import {FilmServiceInterface, FilmRepositoryInterface} from '../../shared/interface/index.js';
import {CreateFilmDto, RedactionFilmDto} from './index.js';
import {Component, RPCProps} from '../../shared/enum/index.js';
import {countRating, fillDTO} from '../../shared/util/index.js';
import {_Film, MSG} from '../../shared/type/index.js';
import {RebbitMQConnection} from '../../shared/libs/index.js';
import {getConsumerSetting, getClientSettings} from '../../shared/util/index.js';
import {UserRto, UserEntity} from '../user/index.js';

const connection: Connection = await new RebbitMQConnection().connect();
let rpcClient: RPCClient;


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

    rpcClient = getClientSettings(
      connection,
      {
        confirm: true,
        maxAttempts: 3,
        timeout: 3000
      }
    );
  }

  public async create(dto: CreateFilmDto): Promise<_Film> {
    const film = await this.repository.create(dto);
    return film;
  }

  public async editing(dto:RedactionFilmDto, idFilm: string): Promise<_Film> {
    const film = await this.repository.editing(dto, idFilm);

    const _film = {
      ...film,
      rating: countRating(film.rating as unknown as number[])
    };

    return _film;
  }

  public async delet(idFilm: string): Promise<number> {
    const film = await this.repository.delet(idFilm);

    return film;
  }

  public async getAllFilms(limit: number): Promise<_Film[] | []> {
    const _filmsList = [];

    const filmsList = await this.repository.getAllFilms(limit);

    if(filmsList.length > 0) {
      const {body} = await rpcClient
        .send({exchange: RPCProps.ExchangeUser, routingKey: RPCProps.RoutingKeyUser}, filmsList);
      for (const film of filmsList) {
        _filmsList.push({
          ...film,
          user: body.find((item: DocumentType<UserEntity>) => fillDTO(UserRto, item).id === film.id_user)
        });
      }
    }

    return _filmsList;
  }

  public async getAllFilmsOfGenre(limit: number, genre: string): Promise<_Film[] | []> {
    const _filmsList = [];

    const filmsList = await this.repository.getAllFilmsOfGenre(limit, genre);

    if(filmsList.length > 0) {
      const {body} = await rpcClient
        .send({exchange: RPCProps.ExchangeUser, routingKey: RPCProps.RoutingKeyUser}, filmsList);
      for (const film of filmsList) {
        _filmsList.push({
          ...film,
          user: body.find((item: DocumentType<UserEntity>) => fillDTO(UserRto, item).id === film.id_user)
        });
      }
    }

    return _filmsList;
  }

  public async show(idFilm: string): Promise<_Film | undefined> {
    let _film: _Film | undefined = undefined;

    const film = await this.repository.show(idFilm);

    if(film) {
      const {body} = await rpcClient
        .send({exchange: RPCProps.ExchangeUser, routingKey: RPCProps.RoutingKeyUser}, film.id_user);
      _film = {
        ...film,
        rating: countRating(film.rating as unknown as number[]),
        user: body
      };
    }

    return _film;
  }

  public async showPromoFilm(): Promise<_Film | undefined> {
    let _promoFilm: _Film | undefined = undefined;

    const promoFilm = await this.repository.showPromoFilm();

    if(promoFilm) {
      const {body} = await rpcClient
        .send({exchange: RPCProps.ExchangeUser, routingKey: RPCProps.RoutingKeyUser}, promoFilm.id_user);
      _promoFilm = {
        ...promoFilm,
        user: body
      };
    }

    return _promoFilm;
  }
}
