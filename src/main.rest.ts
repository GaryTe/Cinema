import 'reflect-metadata';
import { Container } from 'inversify';
import {createTables} from './create-tables-postgres.js';

import { RestApplication, createRestApplicationContainer} from './rest/index.js';
import {createUserContainer} from './modules/user/index.js';
import {createFilmContainer} from './modules/film/index.js';
import {createSelecteFilmContainer} from './modules/selecte-film/index.js';
import {createCommentContainer} from './modules/comment/index.js';
import {createRefreshTokenContainer} from './modules/refresh-token/index.js';
import { Component } from './shared/enum/index.js';

async function bootstrap() {
  const mainRestContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createFilmContainer(),
    createSelecteFilmContainer(),
    createCommentContainer(),
    createRefreshTokenContainer()
  );

  const restApplication = mainRestContainer.get<RestApplication>(Component.RestApplication);
  await restApplication.init();
}

bootstrap();
createTables();
