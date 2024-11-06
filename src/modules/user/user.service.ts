import { DocumentType } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

import { UserServiceInterface, UserRepositoryInterface } from '../../shared/interface/index.js';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './index.js';
import { Component } from '../../shared/enum/index.js';

@injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @inject(Component.UserRepository) private readonly repository: UserRepositoryInterface
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {

    const user = await this.repository.findOrCreate(dto, salt);
    return user;
  }
}
