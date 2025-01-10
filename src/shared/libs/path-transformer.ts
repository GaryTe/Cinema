import { inject, injectable } from 'inversify';

import {Component} from '../enum/index.js';
import {Logger, Config, PathTransformerInterface} from '../interface/index.js';
import {RestSchema} from '../libs/index.js';
import {getFullServerPath} from '../util/index.js';
import {STATIC_UPLOAD_ROUTE, FILE} from '../const/index.js';

@injectable()
export class PathTransformer implements PathTransformerInterface{
  constructor(
    @inject(Component.PinoLogger) private readonly logger: Logger,
    @inject(Component.RestConfig) private readonly config: Config<RestSchema>,
  ) {
    this.logger.info('PathTranformer created!');
  }

  public execute(data: Record<string, unknown>): Record<string, unknown> {
    if(!data) {
      return data;
    }

    if(!(Object.hasOwn(data, FILE))){
      return data;
    }

    data.filename = `${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}${STATIC_UPLOAD_ROUTE}/${data.filename}`;

    return data;
  }
}
