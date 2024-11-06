import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { UserServiceInterface, UserRepositoryInterface, Authentication } from '../../shared/interface/index.js';
import { Component } from '../../shared/enum/index.js';
import { UserService, UserRepository, UserController } from './index.js';
import { UserEntity, UserModel } from './user.entity.js';
import {AuthenticationUser} from '../../shared/libs/index.js';

export function createUserContainer() {
  const userContainer = new Container();

  userContainer.bind<UserServiceInterface>(Component.UserService).to(UserService).inSingletonScope();
  userContainer.bind<UserRepositoryInterface>(Component.UserRepository).to(UserRepository).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  userContainer.bind<UserController>(Component.UserController).to(UserController).inSingletonScope();
  userContainer.bind<Authentication>(Component.AuthenticationUser).to(AuthenticationUser).inSingletonScope();

  return userContainer;
}
