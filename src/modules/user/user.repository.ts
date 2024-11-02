import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import {StatusCodes} from 'http-status-codes';

import { UserEntity, CreateUserDto, LoginUserDto } from './index.js';
import { UserRepositoryInterface, Config } from '../../shared/interface/index.js';
import {RestSchema, HttpError} from '../../shared/libs/index.js';
import { Component } from '../../shared/enum/index.js';
import {createSHA256} from '../../shared/util/index.js';

@injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.RestConfig) private readonly config: Config<RestSchema>
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
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

  public async login({email, password}: LoginUserDto): Promise<string> {
    const user = await this.findByEmail(email);

    if(!user) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `The user at this ${email} is not registered`,
        {
          where: 'user.respository.ts',
          line: '43'
        }
      );
    }

    if(!(createSHA256(password, this.config.get('SALT')) === user.getPassword())) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        'Wrong password',
        {
          where: 'user.respository.ts',
          line: '54'
        }
      );
    }

    return 'Token';
  }

  public async exists(idUser: string): Promise<boolean> {
    return (await this.userModel.exists({_id: idUser})) !== null;
  }
}
