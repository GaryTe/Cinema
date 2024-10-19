import { defaultClasses, getModelForClass, prop, modelOptions, Ref } from '@typegoose/typegoose';

import {Genres} from '../../shared/enum/index.js';
import {UserEntity} from '../user/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface FilmEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'movies',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class FilmEntity extends defaultClasses.TimeStamps {
  @prop({ required: true })
  public nameFilm!: string;

  @prop({ required: true })
  public description!: string;

  @prop({required: true, enum: () => Genres })
  public genres!: Genres;

  @prop({ required: true })
  public release!: Date;

  @prop({ required: true, default: 0 })
  public rating!: number;

  @prop({ required: true })
  public previewVideo!: string;

  @prop({ required: true })
  public video!: string;

  @prop({ required: true })
  public actors!: string[];

  @prop({ required: true })
  public director!: string;

  @prop({ required: true })
  public movieDuration!: string;

  @prop({ required: true, default: 0 })
  public numberComments!: number;

  @prop({ ref: () => UserEntity, required: true})
  public user!: Ref<UserEntity>;

  @prop({ required: true })
  public poster!: string;

  @prop({ required: true })
  public backgroundImag!: string;

  @prop({ required: true })
  public backgroundColor!: string;
}

export const FilmModel = getModelForClass(FilmEntity);
