import {
  defaultClasses,
  getModelForClass,
  prop,
  modelOptions
} from '@typegoose/typegoose';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface RefreshTokenEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'refreshTokens',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class RefreshTokenEntity extends defaultClasses.TimeStamps {
  @prop({ required: true })
  public idUser!: string;

  @prop({ required: true })
  public refreshToken!: string;
}

export const RefreshTokenModel = getModelForClass(RefreshTokenEntity);
