import { DocumentType } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

import { UserServiceInterface, UserRepositoryInterface, Logger } from '../../shared/interface/index.js';
import { UserEntity } from './user.entity.js';
import { CreateUserDto, LoginUserDto } from './index.js';
import { Component } from '../../shared/enum/index.js';

@injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @inject(Component.UserRepository) private readonly repository: UserRepositoryInterface,
    @inject(Component.PinoLogger) private readonly logger: Logger,
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {

    const user = await this.repository.findOrCreate(dto, salt);
    return user;
  }

  public async login(dto: LoginUserDto): Promise<string> {
    const result = await this.repository.login(dto);
    return result;
  }

  public async authentication(): Promise<void> {
    this.logger.warn('method not implemented');
  }
}
