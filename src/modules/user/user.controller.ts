import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {StatusCodes} from 'http-status-codes';

import { BaseController, RestSchema, HttpError } from '../../shared/libs/index.js';
import { Logger, UserServiceInterface, Config } from '../../shared/interface/index.js';
import { Component, HttpMethod } from '../../shared/enum/index.js';
import {RequestParams, RequestBody} from '../../shared/type/index.js';
import { fillDTO } from '../../shared/util/index.js';
import { CreateUserDto, LoginUserDto, UserRto } from './index.js';


@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.PinoLogger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserServiceInterface,
    @inject(Component.RestConfig) private readonly config: Config<RestSchema>
  ) {
    super(logger);

    this.logger.info('Register routes for UserController');

    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/login', method: HttpMethod.Get, handler: this.login });
    this.addRoute({ path: '/authentication', method: HttpMethod.Get, handler: this.authentication });
  }

  public async create(
    { body }: Request<RequestParams, RequestBody, CreateUserDto>,
    res: Response
  ): Promise<void> {
    const user = await this.userService.create(body, this.config.get('SALT'));

    this.logger.info(`New user created with ${user.email}`);
    this.created(res, fillDTO(UserRto, user));
  }

  public async login(
    {body}: Request<RequestParams, RequestBody, LoginUserDto>,
    res: Response
  ): Promise<void> {
    const result = await this.userService.login(body);

    this.logger.info('You are authenticated and authorired');
    this.ok(res, result);
  }

  public async authentication(
    _req: Request<RequestParams, RequestBody>,
    _res: Response
  ): Promise<void> {
    this.logger.warn('method not implemented');

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Method not implemented',
      {
        where: 'user.controller.ts',
        line: '54'
      }
    );
  }
}
