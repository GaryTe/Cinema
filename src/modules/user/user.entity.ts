import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';

import { createSHA256 } from '../../shared/util/index.js';
import {CreateUserDto} from './index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps {
  @prop({ required: true })
  public name!: string;

  @prop({ required: false, unique: true })
  public email!: string;

  @prop()
  public avatar?: string;

  @prop({required: true, default: '' })
  private password?: string;

  constructor(dto: CreateUserDto, salt: string) {
    super();

    this.name = dto.name;
    this.email = dto.email;
    this.avatar = dto.avatar;
    this.password = this.setPassword(dto.password, salt);
  }

  public setPassword(password: string, salt: string) {
    const encodPassword = createSHA256(password, salt);
    return encodPassword;
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
