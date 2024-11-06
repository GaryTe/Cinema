import {
  IsString
} from 'class-validator';

import {ErrorRefreshToken} from '../../../shared/errors-validation/index.js';

export class RefreshTokenDto {
  @IsString({message: ErrorRefreshToken.refreshTokenIsString})
  public refreshToken: string;
}
