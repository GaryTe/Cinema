import 'reflect-metadata';
import { Container } from 'inversify';

import { RestApplication, createRestApplicationContainer} from './rest/index.js';
import {createUserContainer} from './modules/user/index.js';
import {createFilmContainer} from './modules/film/index.js';
import { Component } from './shared/enum/index.js';

async function bootstrap() {
  const mainRestContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createFilmContainer()
  );

  const restApplication = mainRestContainer.get<RestApplication>(Component.RestApplication);
  await restApplication.init();
}

bootstrap();
