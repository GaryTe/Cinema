import { config } from 'dotenv';
import {injectable, inject} from 'inversify';

import { Config, Logger } from '../interface/index.js';
import { mistake } from '../util/index.js';
import { RestSchema, configRestSchema } from './rest-schema.js';
import { Component } from '../enum/index.js';

@injectable()
export class RestConfig implements Config<RestSchema> {
  private readonly config: RestSchema;

  constructor(
    @inject(Component.PinoLogger) private readonly logger: Logger
  ) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error(mistake(`
        where: src/shared/libs/rest-config.ts
        mistake: Cant not read .env file. Perhaps the file does not exists.
        line: 29
        `));
    }

    configRestSchema.load({});
    configRestSchema.validate({ allowed: 'strict' });

    this.config = configRestSchema.getProperties();
    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}
