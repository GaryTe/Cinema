import {
  defaultClasses,
  getModelForClass,
  prop,
  modelOptions
} from '@typegoose/typegoose';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface SelecteFilmEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'selecteFilms',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class SelecteFilmEntity extends defaultClasses.TimeStamps {
  @prop({ required: true })
  public idUser!: string;

  @prop({ required: true })
  public idFilm!: string;
}

export const SelecteFilmModel = getModelForClass(SelecteFilmEntity);
