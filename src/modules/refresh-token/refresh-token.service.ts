import { inject, injectable } from 'inversify';

import {
  RefreshTokenRepositoryInterface,
  Authentication,
  UserRepositoryInterface,
  RefreshTokenServiceInterface
} from '../../shared/interface/index.js';
import { Component } from '../../shared/enum/index.js';
import {TokenPayload} from '../../shared/type/index.js';
import { UserNotFoundException } from '../../shared/libs/user-not-found-exception.js';
import {UserEntity} from '../user/index.js';

@injectable()
export class RefreshTokenService implements RefreshTokenServiceInterface {
  constructor(
    @inject(Component.RefreshTokenRepository) private readonly refreshTokenRepository: RefreshTokenRepositoryInterface,
    @inject(Component.AuthenticationUser) private readonly authenticationUser: Authentication,
    @inject(Component.UserRepository) private readonly userRepository: UserRepositoryInterface
  ) {}

  public async editing(data: TokenPayload): Promise<{
    accessToken: string,
    refreshToken: string
  }> {
    const {refreshToken, idUser} = await this.refreshTokenRepository.find({refreshToken: data.refreshToken as string, idUser: data.id});
    await this.refreshTokenRepository.delet({refreshToken, idUser});
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new UserNotFoundException();
    }

    const newAccessAndRefreshToken = await this.authenticationUser.authenticate(user as unknown as UserEntity);
    return newAccessAndRefreshToken;
  }
}
