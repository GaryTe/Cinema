import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { BaseController, RestSchema } from '../../shared/libs/index.js';
import {
  Logger,
  UserServiceInterface,
  Config,
  Authentication,
  RefreshTokenRepositoryInterface
} from '../../shared/interface/index.js';
import { Component, HttpMethod } from '../../shared/enum/index.js';
import {RequestParams, RequestBody} from '../../shared/type/index.js';
import { fillDTO } from '../../shared/util/index.js';
import { CreateUserDto, LoginUserDto, UserRto, AuthorizedUserRdo } from './index.js';
import {
  ValidateDtoMiddleware,
  UploadFileMiddleware,
  ParseRefreshTokenMiddleware,
  PrivateRouteMiddleware
} from '../../shared/middleware/index.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.PinoLogger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserServiceInterface,
    @inject(Component.RestConfig) private readonly config: Config<RestSchema>,
    @inject(Component.AuthenticationUser) private readonly authenticationUser: Authentication,
    @inject(Component.RefreshTokenRepository) private readonly refreshTokenRepository: RefreshTokenRepositoryInterface
  ) {
    super(logger);

    this.logger.info('Register routes for UserController');

    this.addRoute({
      path: '/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });
    this.addRoute({
      path: '/authentication',
      method: HttpMethod.Get,
      handler: this.authentication,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });
    this.addRoute({
      path: '/logout',
      method: HttpMethod.Delete,
      handler: this.logout,
      middlewares: [
        new ParseRefreshTokenMiddleware(this.config.get('JWT_REFRESH_SECRET')),
        new PrivateRouteMiddleware()
      ]
    });
  }

  public async uploadAvatar({file}: Request, res: Response) {
    const filename = file?.filename as string;
    const path = file?.destination.split('/') as unknown as string[];
    this.created(res, {
      filename: `${path[path.length - 2]}/${path[path.length - 1]}/${filename}`
    });
  }

  public async create(
    { body }: Request<RequestParams, RequestBody, CreateUserDto>,
    res: Response
  ): Promise<void> {
    const user = await this.userService.create(body, this.config.get('SALT'));

    this.logger.info(`New user created with ${user.email}`);
    this.created(res, fillDTO(UserRto, user));
  }

  public async authentication(
    {body}: Request<RequestParams, RequestBody, LoginUserDto>,
    res: Response
  ): Promise<void> {
    const user = await this.authenticationUser.verify(body);
    const parAccessTokenAndrefreshToken = await this.authenticationUser.authenticate(user);

    this.logger.info(`A user with this email: ${user.email} is authorized`);
    this.created(res, fillDTO(AuthorizedUserRdo, parAccessTokenAndrefreshToken));
  }

  public async logout(
    {tokenPayload}: Request,
    res: Response
  ): Promise<void> {
    await this.refreshTokenRepository.delet({refreshToken: tokenPayload.refreshToken as string, idUser: tokenPayload.id});

    this.logger.info('logout completed');
    this.ok(res, 'logout completed');
  }
}
