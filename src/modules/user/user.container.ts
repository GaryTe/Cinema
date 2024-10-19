import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { UserServiceInterface, UserRepositoryInterface } from '../../shared/interface/index.js';
import { Component } from '../../shared/enum/index.js';
import { UserService, UserRepository } from './index.js';
import { UserEntity, UserModel } from './user.entity.js';

export function createUserContainer() {
  const userContainer = new Container();

  userContainer.bind<UserServiceInterface>(Component.UserService).to(UserService).inSingletonScope();
  userContainer.bind<UserRepositoryInterface>(Component.UserRepository).to(UserRepository).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);

  return userContainer;
}
