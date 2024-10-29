import { Container } from 'inversify';

import { PinoLogger, RestConfig, RestSchema, MongoDatabaseClient, AppExceptionFilter } from '../shared/libs/index.js';
import { RestApplication, } from './index.js';
import { Logger, Config, DatabaseClient, ExceptionFilter } from '../shared/interface/index.js';
import { Component } from '../shared/enum/index.js';

export function createRestApplicationContainer() {
  const restApplicationContainer = new Container();

  restApplicationContainer.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  restApplicationContainer.bind<Logger>(Component.PinoLogger).to(PinoLogger).inSingletonScope();
  restApplicationContainer.bind<Config<RestSchema>>(Component.RestConfig).to(RestConfig).inSingletonScope();
  restApplicationContainer.bind<DatabaseClient>(Component.MongoDatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  restApplicationContainer.bind<ExceptionFilter>(Component.ExceptionFilter).to(AppExceptionFilter).inSingletonScope();

  return restApplicationContainer;
}
