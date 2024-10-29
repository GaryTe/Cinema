import {Expose, Type } from 'class-transformer';

import {Genres} from '../../../shared/enum/index.js';
import {UserRto} from '../../user/index.js';

export class FullInformationFilmRdo {
  @Expose()
  public id: string;

  @Expose()
  public nameFilm: string;

  @Expose()
  public description: string;

  @Expose()
  public genres: Genres;

  @Expose()
  @Type(() => Date)
  public release: Date;

  @Expose()
  public rating: number;

  @Expose()
  public previewVideo: string;

  @Expose()
  public video: string;

  @Expose()
  public actors: string[];

  @Expose()
  public director: string;

  @Expose()
  public movieDuration: string;

  @Expose()
  public numberComments: number;

  @Expose()
  @Type(() => UserRto)
  public user: UserRto;

  @Expose()
  public poster: string;

  @Expose()
  public backgroundImag: string;

  @Expose()
  public backgroundColor: string;

  @Expose({ name: 'createdAt' })
  public datePublication: string;

  @Expose()
  public promoFilm: boolean;
}
