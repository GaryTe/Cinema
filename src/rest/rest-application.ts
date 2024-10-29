import {injectable, inject} from 'inversify';
import express, {Express} from 'express';

import { Logger, Config, DatabaseClient, ExceptionFilter } from '../shared/interface/index.js';
import { RestSchema } from '../shared/libs/index.js';
import { Component } from '../shared/enum/index.js';
import {getMongoURI} from '../shared/util/index.js';
import {UserController} from '../modules/user/index.js';
import {FilmController} from '../modules/film/index.js';
import {CommentController} from '../modules/comment/index.js';
import {SelecteFilmController} from '../modules/selecte-film/index.js';

@injectable()
export class RestApplication {
  private readonly server: Express;

  constructor(
    @inject(Component.PinoLogger) private readonly logger: Logger,
    @inject(Component.RestConfig) private readonly config: Config<RestSchema>,
    @inject(Component.MongoDatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.UserController) private readonly userController: UserController,
    @inject(Component.FilmController) private readonly filmController: FilmController,
    @inject(Component.CommentController) private readonly commentController: CommentController,
    @inject(Component.SelecteFilmController) private readonly selecteFilmController: SelecteFilmController,
    @inject(Component.ExceptionFilter) private readonly exceptionFilter: ExceptionFilter
  ) {
    this.server = express();
  }

  private async _initDb() {
    const mongoUri = getMongoURI(
      this.config.get('MONGO_USER'),
      this.config.get('MONGO_PASSWORD'),
      this.config.get('MONGO_DB_HOST'),
      this.config.get('MONGO_PORT')
    );

    return await this.databaseClient.connect(mongoUri);
  }

  private async _initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async _initControllers() {
    this.server.use('/user', this.userController.router);
    this.server.use('/film', this.filmController.router);
    this.server.use('/comment', this.commentController.router);
    this.server.use('/favorit', this.selecteFilmController.router);
  }

  private async _initMiddleware() {
    this.server.use(express.json());
  }

  private async _initExceptionFilters() {
    this.server.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }


  public async init() {
    this.logger.info('REST Application initialization');

    this.logger.info('Init database');
    await this._initDb();
    this.logger.info('Init database completed');

    this.logger.info('Init express middleware');
    await this._initMiddleware();
    this.logger.info('Express middleware initialization completed');

    this.logger.info('Init controllers');
    await this._initControllers();
    this.logger.info('Controller initialization completed');

    this.logger.info('Init exception filters');
    await this._initExceptionFilters();
    this.logger.info('Exception filters initialization compleated');

    this.logger.info('Try to init server');
    await this._initServer();
    this.logger.info(`Server started on http://localhost:${this.config.get('PORT')}`);
  }
}
