import {injectable, inject} from 'inversify';

import { Logger, Config, DatabaseClient } from '../shared/interface/index.js';
import { RestSchema } from '../shared/libs/index.js';
import { Component } from '../shared/enum/index.js';
import {getMongoURI} from '../shared/util/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.PinoLogger) private readonly logger: Logger,
    @inject(Component.RestConfig) private readonly config: Config<RestSchema>,
    @inject(Component.MongoDatabaseClient) private readonly databaseClient: DatabaseClient
  ) {}

  private async _initDb() {
    const mongoUri = getMongoURI(
      this.config.get('MONGO_USER'),
      this.config.get('MONGO_PASSWORD'),
      this.config.get('MONGO_DB_HOST'),
      this.config.get('MONGO_PORT')
    );

    return await this.databaseClient.connect(mongoUri);
  }

  public async init() {
    this.logger.info('REST Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database');
    await this._initDb();
    this.logger.info('Init database completed');
  }
}
