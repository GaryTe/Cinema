import {injectable, inject} from 'inversify';
import express, {Express} from 'express';
import cors from 'cors';

import { Logger, Config, DatabaseClient, ExceptionFilter } from '../shared/interface/index.js';
import { RestSchema } from '../shared/libs/index.js';
import { Component } from '../shared/enum/index.js';
import {getMongoURI, getFullServerPath} from '../shared/util/index.js';
import {UserController} from '../modules/user/index.js';
import {FilmController} from '../modules/film/index.js';
import {CommentController} from '../modules/comment/index.js';
import {SelecteFilmController} from '../modules/selecte-film/index.js';
import {RefreshTokenController} from '../modules/refresh-token/index.js';
import {ParseAccessTokenMiddleware} from '../shared/middleware/parse-access-token.middleware.js';
import {STATIC_UPLOAD_ROUTE, STATIC_FILES_ROUTE} from '../shared/const/index.js';

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
    @inject(Component.AppExceptionFilter) private readonly appExceptionFilter: ExceptionFilter,
    @inject(Component.AuthenticationExceptionFilter) private readonly authenticationExceptionFilter: ExceptionFilter,
    @inject(Component.ValidationExceptionFilter) private readonly validationExceptionFilter: ExceptionFilter,
    @inject(Component.RefreshTokenController) private readonly refreshTokenController: RefreshTokenController,
    @inject(Component.HttpExceptionFilter) private readonly httpExceptionFilter: ExceptionFilter
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
    this.server.use('/refreshToken', this.refreshTokenController.router);
  }

  private async _initMiddleware() {
    const authenticateMiddleware = new ParseAccessTokenMiddleware(this.config.get('JWT_ACCESS_SECRET'));
    this.server.use(express.json());
    this.server.use(
      STATIC_UPLOAD_ROUTE,
      express.static(this.config.get('UPLOAD_DIRECTORY'))
    );
    this.server.use(
      STATIC_FILES_ROUTE,
      express.static(this.config.get('STATIC_DIRECTORY'))
    );
    this.server.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
    this.server.use(cors({origin: getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}));
  }

  private async _initExceptionFilters() {
    this.server.use(this.authenticationExceptionFilter.catch.bind(this.authenticationExceptionFilter));
    this.server.use(this.validationExceptionFilter.catch.bind(this.validationExceptionFilter));
    this.server.use(this.httpExceptionFilter.catch.bind(this.httpExceptionFilter));
    this.server.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
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
    this.logger.info(`Server started on ${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}`);
  }
}
