import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { SelecteFilmServiceInterface, SelecteFilmRepositoryInterface } from '../../shared/interface/index.js';
import { Component } from '../../shared/enum/index.js';
import {
  SelecteFilmService,
  SelecteFilmRepository,
  SelecteFilmEntity,
  SelecteFilmModel,
  SelecteFilmController
} from './index.js';

export function createSelecteFilmContainer() {
  const selecteFilmrContainer = new Container();

  selecteFilmrContainer.bind<SelecteFilmServiceInterface>(Component.SelecteFilmService).to(SelecteFilmService).inSingletonScope();
  selecteFilmrContainer.bind<SelecteFilmRepositoryInterface>(Component.SelecteFilmRepository).to(SelecteFilmRepository).inSingletonScope();
  selecteFilmrContainer.bind<types.ModelType<SelecteFilmEntity>>(Component.SelecteFilmModel).toConstantValue(SelecteFilmModel);
  selecteFilmrContainer.bind<SelecteFilmController>(Component.SelecteFilmController).to(SelecteFilmController).inSingletonScope();
  return selecteFilmrContainer;
}
