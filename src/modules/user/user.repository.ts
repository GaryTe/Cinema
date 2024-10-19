import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

import { UserEntity, CreateUserDto } from './index.js';
import { UserRepositoryInterface } from '../../shared/interface/index.js';
import { Component } from '../../shared/enum/index.js';

@injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
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
      return existedUser;
    }

    return await this.create(dto, salt);
  }
}
