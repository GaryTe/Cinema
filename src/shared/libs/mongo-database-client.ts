import * as Mongoose from 'mongoose';
import { inject, injectable } from 'inversify';
import { setTimeout } from 'node:timers/promises';

import { DatabaseClient } from '../interface/index.js';
import { Component } from '../enum/index.js';
import { Logger } from '../interface/index.js';
import {RETRY_COUNT, RETRY_TIMEOUT} from '../const/index.js';


@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private mongoose: typeof Mongoose;
  private isConnected: boolean;

  constructor(
    @inject(Component.PinoLogger) private readonly logger: Logger
  ) {
    this.isConnected = false;
  }

  public isConnectedToDatabase() {
    return this.isConnected;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnectedToDatabase()) {
      throw new Error(`
        where: src/shared/libs/mongo-database-client.ts
        mistake: MongoDB client already connected
        line: 27
        `);
    }

    this.logger.info('Trying to connect to MongoDB');

    let attempt = 0;
    while (attempt < RETRY_COUNT) {
      try {
        this.mongoose = await Mongoose.connect(uri);
        this.isConnected = true;
        this.logger.info('Database connection established.');
        return;
      } catch (error) {
        attempt++;
        this.logger.error(`
          where: src/shared/libs/mongo-database-client.ts
          mistake: Failed to connect to the database. Attempt ${attempt}
          line: 46
          `,
          error as Error
        );
        await setTimeout(RETRY_TIMEOUT);
      }
    }

    throw new Error(`
      where: src/shared/libs/mongo-database-client.ts
      mistake: Unable to establish database connection after ${RETRY_COUNT}
      line: 57
      `);
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnectedToDatabase()) {
      throw new Error(`
        where: src/shared/libs/mongo-database-client.ts
        mistake: Not connected to the database
        line: 65
        `);
    }

    await this.mongoose.disconnect();
    this.isConnected = false;
    this.logger.info('Database connection closed.');
  }
}
