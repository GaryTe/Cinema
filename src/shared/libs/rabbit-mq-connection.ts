import {Connection} from 'rabbitmq-client';
import { setTimeout } from 'node:timers/promises';

import {RETRY_COUNT, RETRY_TIMEOUT, TIMEOUT} from '../const/index.js';
import {Logger, Config} from '../interface/index.js';
import {RestSchema, RestConfig, PinoLogger} from './index.js';

export class RebbitMQConnection {
  private readonly rabbit: Connection;
  private readonly logger: Logger = new PinoLogger();
  private readonly config: Config<RestSchema> = new RestConfig(this.logger);

  constructor() {
    this.rabbit = new Connection({
      hostname: this.config.get('MONGO_DB_HOST'),
      port: this.config.get('RABBITMQ_PORT'),
      password: this.config.get('RABBITMQ_PASSWORD'),
      username: this.config.get('RABBITMQ_USER')
    });
  }

  public async connect(): Promise<Connection> {

    this.logger.info('Trying to connect to RebbitMQ');

    let attempt = 0;
    while (attempt < RETRY_COUNT) {
      try {
        await this.rabbit.onConnect(TIMEOUT, true);
        this.logger.info('RebbitMQ connection established.');
        return this.rabbit;
      } catch (error) {
        attempt++;
        this.logger.warn(`
          Failed to connect to the RebbitMQ. Attempt ${attempt}
        `);
        await setTimeout(RETRY_TIMEOUT);
      }
    }

    this.rabbit.close();
    throw new Error(`
          where: src/shared/libs/rabbit-mq-connection.ts
          mistake: Unable to establish RebbitMQ connection after ${RETRY_COUNT} attemt
          line: 46
          `);
  }
}
