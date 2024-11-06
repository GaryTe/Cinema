import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import {StatusCodes} from 'http-status-codes';

import {RefreshTokenRepositoryInterface} from '../../shared/interface/index.js';
import {Component} from '../../shared/enum/index.js';
import {RefreshTokenEntity} from './index.js';
import {HttpError} from '../../shared/libs/index.js';

@injectable()
export class RefreshTokenRepository implements RefreshTokenRepositoryInterface {
  constructor(
    @inject(Component.RefreshTokenModel) private readonly refreshTokenModel: types.ModelType<RefreshTokenEntity>
  ) {}

  public async create(data: {refreshToken: string, idUser: string}): Promise<DocumentType<RefreshTokenEntity>> {
    return (await this.refreshTokenModel.create(data));
  }

  public async find(data: {refreshToken: string, idUser: string}): Promise<DocumentType<RefreshTokenEntity>> {
    const _refreshToken = await this.refreshTokenModel.findOne({idUser: data.idUser, refreshToken: data.refreshToken});

    if(!_refreshToken) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'This token was not found in the database',
        {
          where: 'refresh-token.repository.ts',
          line: '25'
        }
      );
    }

    return _refreshToken;
  }

  public async delet(data: {refreshToken: string, idUser: string}): Promise<void> {
    const _refreshToken = await this.refreshTokenModel.findOneAndDelete({idUser: data.idUser, refreshToken: data.refreshToken});

    if(!_refreshToken) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'This token cannot be deleted because it does not in the database',
        {
          where: 'refresh-token.repository.ts',
          line: '42'
        }
      );
    }
  }
}
