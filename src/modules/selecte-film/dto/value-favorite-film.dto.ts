import {IsString} from 'class-validator';

import {ErrorSelecteFilm} from '../../../shared/errors-validation/index.js';

export class ValueFavoriteFilmDto {
  @IsString({message: ErrorSelecteFilm.idUserIsString})
  public idUser: string;

  @IsString({message: ErrorSelecteFilm.idFilmIsString})
  public idFilm: string;
}
