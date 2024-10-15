import {injectable, inject} from 'inversify';

import { Logger, Config } from '../shared/interface/index.js';
import { RestSchema } from '../shared/libs/index.js';
import { Component } from '../shared/type/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.PinoLogger) private readonly logger: Logger,
    @inject(Component.RestConfig) private readonly config: Config<RestSchema>
  ) {}

  public async init() {
    this.logger.info('REST Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
  }
}
