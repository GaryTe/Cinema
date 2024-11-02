import {Length, IsString, Min, Max, IsNumber} from 'class-validator';

import {ErrorComment} from '../../../shared/errors-validation/index.js';

export class CreateCommentDto {
  @IsString({message:ErrorComment.textIsString})
  @Length(5, 1024, {message: ErrorComment.textLength})
  public text: string;

  @IsNumber({}, {message: ErrorComment.ratingIsNumber})
  @Min(1, {message: ErrorComment.ratingMin})
  @Max(10, {message: ErrorComment.ratingMax})
  public rating: number;

  @IsString({message: ErrorComment.idFilmIsString})
  public idFilm: string;

  @IsString({message: ErrorComment.idUserIsString})
  public idUser: string;
}
