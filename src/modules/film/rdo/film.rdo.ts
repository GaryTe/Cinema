import {Expose, Type} from 'class-transformer';

import {Genres} from '../../../shared/enum/index.js';
import {UserRto} from '../../user/index.js';

export class FilmRdo {
  @Expose()
  public id: string;

  @Expose({name: 'name_film' })
  public nameFilm: string;

  @Expose({ name: 'created_at' })
  public datePublication: string;

  @Expose()
  public genres: Genres;

  @Expose({ name: 'preview_video' })
  public previewVideo: string;

  @Expose({name: 'count_comments'})
  public numberComments: number;

  @Expose()
  @Type(() => UserRto)
  public user: UserRto;

  @Expose()
  public poster: string;

  @Expose({name: 'promo_film'})
  public promoFilm: boolean;
}
