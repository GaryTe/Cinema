import {
  IsString,
  Length,
  IsEnum,
  IsArray,
  Validate,
  IsOptional,
  IsBoolean
} from 'class-validator';

import {Genres} from '../../../shared/enum/index.js';
import {ErrorFilm} from '../../../shared/errors-validation/index.js';
import {ValidationFormat, ValidationActors, ValidationDateRelease} from '../../../shared/util/index.js';

export class CreateFilmDto {
  @IsString({message: ErrorFilm.nameFilmIsString})
  @Length(2, 100 ,{message: ErrorFilm.nameFilmLength})
  public nameFilm: string;

  @IsString({message: ErrorFilm.descriptionIsString})
  @Length(20, 1024 ,{message: ErrorFilm.descriptionLength})
  public description: string;

  @IsEnum(Genres, {message: ErrorFilm.genres})
  public genres: Genres;

  @IsString({message: ErrorFilm.releaseIsString})
  @Validate(ValidationDateRelease, {message: ErrorFilm.releaseDate})
  public release: string;

  @IsString({message: ErrorFilm.previewVideoIsString})
  public previewVideo: string;

  @IsString({message: ErrorFilm.videoIsString})
  public video: string;

  @IsArray({message: ErrorFilm.actorsIsArray})
  @Validate(ValidationActors, {message: ErrorFilm.actorsIsString})
  public actors: string[];

  @IsString({message: ErrorFilm.directorIsString})
  @Length(2, 50, {message: ErrorFilm.directorLength})
  public director: string;

  @IsString({message: ErrorFilm.movieDurationIsString})
  public movieDuration: string;

  public user?: string;

  @IsString({message: ErrorFilm.posterIsString})
  @Validate(ValidationFormat, {message: ErrorFilm.poster})
  public poster: string;

  @IsString({message: ErrorFilm.backgroundImagIsString})
  @Validate(ValidationFormat, {message: ErrorFilm.backgroundImag})
  public backgroundImag: string;

  @IsString({message: ErrorFilm.backgroundColorIsString})
  public backgroundColor: string;

  @IsOptional()
  @IsBoolean({message: ErrorFilm.promoFilmIsBoolean})
  public promoFilm?: boolean;
}
