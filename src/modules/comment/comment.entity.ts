import {
  defaultClasses,
  getModelForClass,
  prop,
  modelOptions,
  Ref
} from '@typegoose/typegoose';

import {Comment} from '../../shared/type/index.js';
import {UserEntity} from '../user/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CommentEntity extends defaultClasses.TimeStamps implements Comment {
  @prop({ required: true })
  public text!: string;

  @prop({ required: true})
  public rating!: number;

  @prop({ required: true})
  public idFilm!: string;

  @prop({ref: () => UserEntity, required: true, })
  public idUser: Ref<UserEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
