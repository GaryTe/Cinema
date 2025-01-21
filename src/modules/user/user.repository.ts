import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import {StatusCodes} from 'http-status-codes';
import {Connection} from 'rabbitmq-client';

import { UserEntity, CreateUserDto } from './index.js';
import { UserRepositoryInterface, Config } from '../../shared/interface/index.js';
import {HttpError, RestSchema, RebbitMQConnection} from '../../shared/libs/index.js';
import { Component, RPCProps } from '../../shared/enum/index.js';
import {getFullServerPath, getConsumerSetting} from '../../shared/util/index.js';
import {STATIC_FILES_ROUTE} from '../../shared/const/index.js';
import {STATIC_IMAGES} from '../../shared/const/index.js';

const connection: Connection = await new RebbitMQConnection().connect();

@injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.RestConfig) private readonly config: Config<RestSchema>
  ) {
    connection.createConsumer(
      getConsumerSetting({
        consumerTag: 'VladVankov',
        durable: true,
        type: 'direct',
        exchange: RPCProps.ExchangeUser,
        routingKey: RPCProps.RoutingKeyUser,
        queue: RPCProps.QueueUser
      }), async ({body}, reply) => {
        if(!Array.isArray(body)) {
          const dataUser = await this.userModel.findById(body);
          await reply(dataUser);
        } else {
          const usersList = [];
          for await(const value of body) {
            const dataUser = await this.userModel.findById(value.id_user);
            usersList.push(dataUser);
          }
          await reply(usersList);
        }
      });
  }

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    dto.avatar = dto.avatar ?? `${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}${STATIC_FILES_ROUTE}${STATIC_IMAGES}`;
    const user = new UserEntity(dto, salt);

    const _user = await this.userModel.create(user);
    return _user;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return await this.userModel.findOne({email});
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `A user with this email: ${existedUser.email} is exists`,
        {
          where: 'user.respository.ts',
          line: '33'
        }
      );
    }

    return await this.create(dto, salt);
  }

  public async exists(idUser: string): Promise<boolean> {
    return (await this.userModel.exists({_id: idUser})) !== null;
  }
}
