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
import {ValidationFormat, ValidationActors} from '../../../shared/util/index.js';

export class RedactionFilmDto {
  @IsOptional()
  @IsString({message: ErrorFilm.nameFilmIsString})
  @Length(2, 100 ,{message: ErrorFilm.nameFilmLength})
  public nameFilm: string;

  @IsOptional()
  @IsString({message: ErrorFilm.descriptionIsString})
  @Length(20, 1024 ,{message: ErrorFilm.descriptionLength})
  public description: string;

  @IsOptional()
  @IsEnum(Genres, {message: ErrorFilm.genres})
  public genres: Genres;

  @IsOptional()
  @IsString({message: ErrorFilm.releaseIsString})
  public release: string;

  @IsOptional()
  @IsString({message: ErrorFilm.previewVideoIsString})
  public previewVideo: string;

  @IsOptional()
  @IsString({message: ErrorFilm.videoIsString})
  public video: string;

  @IsOptional()
  @IsArray({message: ErrorFilm.actorsIsArray})
  @Validate(ValidationActors, {message: ErrorFilm.actorsIsString})
  public actors: string[];

  @IsOptional()
  @IsString({message: ErrorFilm.directorIsString})
  @Length(2, 50, {message: ErrorFilm.directorLength})
  public director: string;

  @IsOptional()
  @IsString({message: ErrorFilm.movieDurationIsString})
  public movieDuration: string;

  @IsOptional()
  @IsString({message: ErrorFilm.userIsString})
  public user: string;

  @IsOptional()
  @IsString({message: ErrorFilm.posterIsString})
  @Validate(ValidationFormat, {message: ErrorFilm.poster})
  public poster: string;

  @IsOptional()
  @IsString({message: ErrorFilm.backgroundImagIsString})
  @Validate(ValidationFormat, {message: ErrorFilm.backgroundImag})
  public backgroundImag: string;

  @IsOptional()
  @IsString({message: ErrorFilm.backgroundColorIsString})
  public backgroundColor: string;

  @IsOptional()
  @IsBoolean({message: ErrorFilm.promoFilmIsBoolean})
  public promoFilm?: boolean;
}
