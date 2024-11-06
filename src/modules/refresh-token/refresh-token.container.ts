import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { Component } from '../../shared/enum/index.js';
import {
  RefreshTokenEntity,
  RefreshTokenModel,
  RefreshTokenRepository,
  RefreshTokenService,
  RefreshTokenController
} from './index.js';
import {RefreshTokenRepositoryInterface, RefreshTokenServiceInterface} from '../../shared/interface/index.js';

export function createRefreshTokenContainer() {
  const refreshTokenContainer = new Container();

  refreshTokenContainer.bind<types.ModelType<RefreshTokenEntity>>(Component.RefreshTokenModel).toConstantValue(RefreshTokenModel);
  refreshTokenContainer.bind<RefreshTokenRepositoryInterface>(Component.RefreshTokenRepository).to(RefreshTokenRepository).inSingletonScope();
  refreshTokenContainer.bind<RefreshTokenServiceInterface>(Component.RefreshTokenService).to(RefreshTokenService).inSingletonScope();
  refreshTokenContainer.bind<RefreshTokenController>(Component.RefreshTokenController).to(RefreshTokenController).inSingletonScope();

  return refreshTokenContainer;
}
