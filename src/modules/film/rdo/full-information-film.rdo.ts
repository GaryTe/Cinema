import {Expose, Type } from 'class-transformer';

import {Genres} from '../../../shared/enum/index.js';
import {UserRto} from '../../user/index.js';

export class FullInformationFilmRdo {
  @Expose()
  public id: string;

  @Expose({ name: 'name_film' })
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

  @Expose({ name: 'preview_video' })
  public previewVideo: string;

  @Expose()
  public video: string;

  @Expose()
  public actors: string[];

  @Expose()
  public director: string;

  @Expose({name: 'movie_duration'})
  public movieDuration: string;

  @Expose({name: 'count_comments'})
  public numberComments: number;

  @Expose()
  @Type(() => UserRto)
  public user: UserRto;

  @Expose()
  public poster: string;

  @Expose({name: 'background_imag'})
  public backgroundImag: string;

  @Expose({name: 'background_color'})
  public backgroundColor: string;

  @Expose({ name: 'created_at' })
  public datePublication: string;

  @Expose({name: 'promo_film'})
  public promoFilm: boolean;
}
