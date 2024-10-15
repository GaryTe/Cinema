import 'reflect-metadata';
import { Container } from 'inversify';

import { PinoLogger, RestConfig, RestSchema } from './shared/libs/index.js';
import { RestApplication, } from './rest/index.js';
import { Logger, Config } from './shared/interface/index.js';
import { Component } from './shared/type/index.js';

async function bootstrap() {
  const container = new Container();
  container.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<Logger>(Component.PinoLogger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestSchema>>(Component.RestConfig).to(RestConfig).inSingletonScope();

  const restApplication = container.get<RestApplication>(Component.RestApplication);
  await restApplication.init();
}

bootstrap();
