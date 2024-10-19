import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { FilmServiceInterface, FilmRepositoryInterface } from '../../shared/interface/index.js';
import { Component } from '../../shared/enum/index.js';
import { FilmService, FilmRepository } from './index.js';
import { FilmEntity, FilmModel } from './film.entity.js';

export function createFilmContainer() {
  const filmContainer = new Container();

  filmContainer.bind<FilmServiceInterface>(Component.FilmService).to(FilmService).inSingletonScope();
  filmContainer.bind<FilmRepositoryInterface>(Component.FilmRepository).to(FilmRepository).inSingletonScope();
  filmContainer.bind<types.ModelType<FilmEntity>>(Component.FilmModel).toConstantValue(FilmModel);

  return filmContainer;
}
