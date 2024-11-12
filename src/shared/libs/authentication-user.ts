import { inject, injectable } from 'inversify';
import * as crypto from 'node:crypto';
import { SignJWT } from 'jose';

import { Authentication, Logger, UserRepositoryInterface, Config, RefreshTokenRepositoryInterface } from '../interface/index.js';
import { Component } from '../enum/index.js';
import {RestSchema, UserNotFoundException, UserPasswordIncorrectException} from '../libs/index.js';
import {LoginUserDto, UserEntity} from '../../modules/user/index.js';
import {AccessAndRefreshToken, TokenPayload} from '../type/index.js';

@injectable()
export class AuthenticationUser implements Authentication {
  constructor(
    @inject(Component.PinoLogger) private readonly logger: Logger,
    @inject(Component.UserRepository) private readonly userRepository: UserRepositoryInterface,
    @inject(Component.RestConfig) private readonly config: Config<RestSchema>,
    @inject(Component.RefreshTokenRepository) private readonly refreshTokenRepository: RefreshTokenRepositoryInterface
  ) {}

  public async authenticate(user: UserEntity): Promise<AccessAndRefreshToken> {
    const jwtAccessSecret = this.config.get('JWT_ACCESS_SECRET');
    const secretKey = crypto.createSecretKey(jwtAccessSecret, 'utf-8');
    const accessTokenPayload: TokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name
    };

    const jwtRefreshSecret = this.config.get('JWT_REFRESH_SECRET');
    const _secretKey = crypto.createSecretKey(jwtRefreshSecret, 'utf-8');

    this.logger.info(`Create accessToken for ${user.email}`);
    const _accessToken = await new SignJWT(accessTokenPayload)
      .setProtectedHeader({
        alg: this.config.get('JWT_ALGORITHM'),
        typ: this.config.get('TYP')
      })
      .setIssuedAt()
      .setExpirationTime(this.config.get('JWT_ACCESS_EXPIRED'))
      .sign(secretKey);

    this.logger.info(`Create refreshToken for ${user.email}`);
    const _refreshToken = await new SignJWT(accessTokenPayload)
      .setProtectedHeader({
        alg: this.config.get('JWT_ALGORITHM'),
        typ: this.config.get('TYP')
      })
      .setIssuedAt()
      .setExpirationTime(this.config.get('JWT_REFRESH_EXPIRED'))
      .sign(_secretKey);

    await this.refreshTokenRepository.create({refreshToken: _refreshToken, idUser: user.id});

    return {
      accessToken: _accessToken,
      refreshToken: _refreshToken
    };
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      this.logger.warn(`User with ${dto.email} not found`);
      throw new UserNotFoundException();
    }

    if (! user.verifyPassword(dto.password, this.config.get('SALT'))) {
      this.logger.warn(`Incorrect password for ${dto.email}`);
      throw new UserPasswordIncorrectException();
    }

    return user;
  }


}
