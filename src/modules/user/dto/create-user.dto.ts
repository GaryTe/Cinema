import {
  Length,
  IsEmail,
  IsOptional,
  Validate,
  IsString
} from 'class-validator';

import {ValidationFormatAvatar} from '../../../shared/util/index.js';
import {ErrorUser} from '../../../shared/errors-validation/index.js';

export class CreateUserDto {
  @IsString({message: ErrorUser.nameIsString})
  @Length(1, 15, {message: ErrorUser.nameLength})
  public name: string;

  @IsEmail({}, {message: ErrorUser.email})
  public email: string;

  @IsOptional()
  @IsString({message: ErrorUser.avatarIsString})
  @Validate(ValidationFormatAvatar, {message: ErrorUser.avatar})
  public avatar?: string;

  @Length(6, 12, {message: ErrorUser.passwordLength})
  public password: string;
}
