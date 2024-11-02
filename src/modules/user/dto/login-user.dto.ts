import {IsEmail, Length} from 'class-validator';

import {ErrorUser} from '../../../shared/errors-validation/index.js';

export class LoginUserDto {
  @IsEmail({}, {message: ErrorUser.email})
  public email: string;

  @Length(6, 12, {message: ErrorUser.passwordLength})
  public password: string;
}
